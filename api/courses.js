const router = require('express').Router();





router.get('/', (req, res) => {

  console.log("get a list of all courses");


});

router.post('/', (req, res) => {

  console.log("Create a new Course");


});

router.get('/:id', (req, res) => {

  console.log("Get data on a specific course");


});

router.patch('/:id', (req, res) => {

  console.log("Update course data");


});

router.delete('/:id', (req, res) => {

  console.log("Delete a course");


});

router.get('/:id/students', (req, res) => {

  console.log("Create a new assignment");


});

router.post('/:id/students', (req, res) => {

  console.log("Create a new assignment");


});

router.get('/:id/roster', (req, res) => {

  console.log("Create a new assignment");


});

router.get('/:id/assignments', (req, res) => {

  console.log("Create a new assignment");


});

module.exports = router;
