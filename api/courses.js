const router = require('express').Router();
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');




router.get('/', (req, res) => {

  console.log("get a list of all courses");


});

//must be admin
router.post('/', requireAuthentication, (req, res) => {

  console.log("Create a new Course");


});


router.get('/:id', (req, res) => {

  console.log("Get data on a specific course");


});

//either admin or instructor of course
router.patch('/:id', requireAuthentication, (req, res) => {

  console.log("Update course data");


});

//must be admin
router.delete('/:id', requireAuthentication, (req, res) => {

  console.log("Delete a course");


});

//either admin or instructor of course
router.get('/:id/students', requireAuthentication, (req, res) => {

  console.log("get a list of all students in course");


});

//either admin or instructor of course
router.post('/:id/students', requireAuthentication, (req, res) => {

  console.log("update enrollment for the course");


});

//either admin or instructor of course
router.get('/:id/roster', requireAuthentication, (req, res) => {

  console.log("get a csv of all students in the course");


});

router.get('/:id/assignments', (req, res) => {

  console.log("get a list of all assignments in the course");


});

module.exports = router;
