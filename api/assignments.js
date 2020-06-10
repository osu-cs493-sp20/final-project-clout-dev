const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const {
  AssignmentSchema,
  SubmitSchema,
  insertNewAssignment,
  deleteAssignmentById,
  getAssignmentDetailsById,
  patchAssignment,
  getSubmissionPage,
  getSubmitInfoById,
  saveSubmitFile,
  getFileDownloadStreamByFilename
} = require('../models/assignment');
const {
  getCourseDetailsById,
  enrolled
} = require('../models/course');



//either admin or instructor of course
router.post('/', requireAuthentication, async (req, res) => {

  const course = await getCourseDetailsById(req.body.course);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {

      if(validateAgainstSchema(req.body, AssignmentSchema)) {
        try {
          const id = await insertNewAssignment(req.body);
          res.status(201).send({  id: id});
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to insert assignment.  Please try again later."
          });
        }
      } else {
        res.status(400).send({error: "not a valid assignment object"});
      }

    } else {
      res.status(403).send({error: "must be admin or course instructor"});
    }

  } else {
    next(); //course does not exist so 404
  }

});

router.get('/:id', async (req, res) => {

  try {
    const assignment = await getAssignmentDetailsById(req.params.id);
    if (assignment) {
      res.status(200).send(assignment);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch assignment.  Please try again later."
    });
  }

});

//either admin or instructor of course
router.patch('/:id', requireAuthentication, async (req, res, next) => {

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
        try {
          const patchData = extractValidFields(req.body, AssignmentSchema);
          if(patchData){
            patchAssignment(req.params.id, patchData);
            res.status(200).end();
          }
          else {
            res.status(400).send({error: "must contain data to patch"})
          }
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to patch assignment.  Please try again later."
          });
        }
    } else {
      res.status(403).send({error: "must be admin or course instructor"});
    }

  } else {
    next(); //course does not exist so 404
  }

});

//either admin or instructor of course
router.delete('/:id', requireAuthentication, async (req, res, next) => {

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
      try {
        const deleteSuccessful = await deleteAssignmentById(req.params.id);
        res.status(204).end();
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to delete course.  Please try again later."
        });
      }

    } else {
      res.status(403).send({error: "must be admin or course instructor"});
    }

  } else {
    next(); //course does not exist so 404
  }

});

//either admin or instructor of course
router.get('/:id/submissions', requireAuthentication, async (req, res) => {

  const assignment = await getAssignmentDetailsById(req.params.id);
  if(assignment) {
    const course = await getCourseDetailsById(assignment.courseId);

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
      try {
        const submissionPage = await getSubmissionPage( req.params.id,  parseInt(req.query.page) || 1  );
        submissionPage.links = {};
        if (submissionPage.page < submissionPage.totalPages) {
          submissionPage.links.nextPage = `/assignments/${req.params.id}/submissions?page=${submissionPage.page + 1}`;
          submissionPage.links.lastPage = `/assignments/${req.params.id}/submissions?page=${submissionPage.totalPages}`;
        }
        if (submissionPage.page > 1) {
          submissionPage.links.prevPage = `/assignments/${req.params.id}/submissions?page=${submissionPage.page - 1}`;
          submissionPage.links.firstPage = '/assignments/${req.params.id}/submissions?page=1';
        }
        res.status(200).send(submissionPage);

      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to fetch submissions.  Please try again later."
        });
      }

    } else {
      res.status(403).send({error: "must be admin or course instructor"});
    }

  } else {
    res.status(404).send({error: "assignment does not exist"});
  }

});



//POST SUBMISSION HELPERS
/*
Supported Filetypes: jpg, pdf, docx, doc, txt
*/
const fileTypes = {
  'image/jpeg': 'jpg',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'text/plain': 'txt'
};

const upload = multer({
  // dest: `${__dirname}/uploads`
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = fileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype]);
  }
});


function removeUploadedFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

}




//only the student who is submitting the assignment
router.post('/:id/submissions', requireAuthentication, upload.single('file'), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.user, req.body.studentId, req.user == req.body.studentId);
  console.log(req.params.id, req.body.assignmentId, req.params.id == req.body.assignmentId);
  console.log(req.role, "student")
  if(req.user == req.body.studentId && req.params.id == req.body.assignmentId && req.role == "student" && await enrolled(req.body.studentId, req.body.courseId)){

    if (validateAgainstSchema(req.body, SubmitSchema)) {
      try {
        const image = {
          contentType: req.file.mimetype,
          filename: req.file.filename,
          path: req.file.path,
          studentId: req.body.studentId,
          assignmentId: req.body.assignmentId,
          timestamp: new Date().toISOString()
      };
        const id = await saveSubmitFile(image);
        await removeUploadedFile(req.file);
        res.status(200).send({
          id: id
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting file into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid photo object"
      });
    }
  } else{
    res.status(400).send({
      error: "Unauthorized Submission Input"
    });

  }
});



//get file from URL

router.get('/media/:filename', (req, res, next) => {
  console.log(req.params.filename);
  getFileDownloadStreamByFilename(req.params.filename)
    .on('file', (file) => {
      res.status(200).type(file.metadata.contentType);
    })
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .pipe(res);
});


module.exports = router;
