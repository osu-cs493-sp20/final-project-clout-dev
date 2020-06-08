const router = require('express').Router();
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');
const { validateAgainstSchema } = require('../lib/validation');
const {
  getCoursePage,
  CourseSchema,
  insertNewCourse,
  getCourseDetailsById,
  deleteCourseById,
  getCourseStudents
} = require('../models/course');



router.get('/', async (req, res) => {

  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const coursePage = await getCoursePage(parseInt(req.query.page) || 1);
    coursePage.links = {};
    if (coursePage.page < coursePage.totalPages) {
      coursePage.links.nextPage = `/courses?page=${coursePage.page + 1}`;
      coursePage.links.lastPage = `/courses?page=${coursePage.totalPages}`;
    }
    if (coursePage.page > 1) {
      coursePage.links.prevPage = `/courses?page=${coursePage.page - 1}`;
      coursePage.links.firstPage = '/courses?page=1';
    }
    res.status(200).send(coursePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching courses list.  Please try again later."
    });
  }



});

//must be admin
router.post('/', requireAuthentication, async (req, res) => {

  console.log("Create a new Course");
  if(req.role == 'admin') {

    if( validateAgainstSchema(req.body, CourseSchema)  ) {

      try {
        const id = await insertNewCourse(req.body);
        res.status(201).send({  id: id});
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Error inserting course into DB.  Please try again later." });
      }

    } else {
      res.status(400).send({error: "not a valid course object"});
    }

  } else {
    res.status(403).send({error: "must be admin to create a course"});
  }


});


router.get('/:id', async (req, res, next) => {

  try {
    const course = await getCourseDetailsById(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course.  Please try again later."
    });
  }

});

//either admin or instructor of course
router.patch('/:id', requireAuthentication, (req, res) => {

  console.log("Update course data");


});

//must be admin
router.delete('/:id', requireAuthentication, async (req, res, next) => {

  if(req.role == 'admin') {

    try {
      const deleteSuccessful = await deleteCourseById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete course.  Please try again later."
      });
    }

  } else {
    res.status(403).send({error: "must be admin to delete a course"});

  }


});

//either admin or instructor of course
router.get('/:id/students', requireAuthentication, async (req, res, next) => {

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
        try {
          const students = await getCourseStudents(req.params.id);
          res.status(200).send( {students: students} );
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to fetch course.  Please try again later."
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
router.post('/:id/students', requireAuthentication, (req, res) => {

  console.log("update enrollment for the course");


});

//either admin or instructor of course
router.get('/:id/roster', requireAuthentication, async (req, res) => {

  const course = await getCourseDetailsById(req.params.id);
  if(course) {

    if((course.instructorId == req.user && req.role == 'instructor') || (req.role == 'admin') ) {
        try {
          const students = await getCourseStudents(req.params.id);

//Do the csv shit instead of sending the array
          res.status(200).send( {students: students} );

        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to fetch course.  Please try again later."
          });
        }
    } else {
      res.status(403).send({error: "must be admin or course instructor"});
    }

  } else {
    next(); //course does not exist so 404
  }

});

router.get('/:id/assignments', (req, res) => {

  console.log("get a list of all assignments in the course");


});

module.exports = router;
