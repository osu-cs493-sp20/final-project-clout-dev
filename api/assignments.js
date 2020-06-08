const router = require('express').Router();
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const {
  AssignmentSchema,
  insertNewAssignment,
  deleteAssignmentById,
  getAssignmentDetailsById,
  patchAssignment,
  getSubmissionPage
} = require('../models/assignment');
const {
  getCourseDetailsById
} = require('../models/course');



//either admin or instructor of course
router.post('/', requireAuthentication, async (req, res) => {

  const course = await getCourseDetailsById(req.body.courseId);
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
router.delete('/:id', requireAuthentication, async (req, res) => {

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
      try {
        const deleteSuccessful = await deleteAssignmentById(parseInt(req.params.id));
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

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

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
    next(); //course does not exist so 404
  }

});

//only the student who is submitting the assignment
router.post('/:id/submissions', requireAuthentication, async (req, res) => {

  console.log("submit an assignment");
//do this shit

});


module.exports = router;
