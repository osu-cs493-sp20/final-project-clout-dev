const router = require('express').Router();
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');




//either admin or instructor of course
router.post('/', requireAuthentication, (req, res) => {

  console.log("Create a new assignment");


});

router.get('/:id', (req, res) => {

  console.log("get a specific assignment");


});

//either admin or instructor of course
router.patch('/:id', requireAuthentication, (req, res) => {

  console.log("update an assignment");


});

//either admin or instructor of course
router.delete('/:id', requireAuthentication, (req, res) => {

  console.log("delete an assignment");


});

//either admin or instructor of course
router.get('/:id/submissions', requireAuthentication, (req, res) => {

  console.log("get all submissions for an assignment");


});

//only the student who is submitting the assignment
router.post('/:id/submissions', requireAuthentication, (req, res) => {

  console.log("submit an assignment");


});


module.exports = router;
