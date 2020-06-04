const router = require('express').Router();






router.post('/', (req, res) => {

  console.log("Create a new assignment");


});

router.get('/:id', (req, res) => {

  console.log("get a specific assignment");


});

router.patch('/:id', (req, res) => {

  console.log("update an assignment");


});

router.delete('/:id', (req, res) => {

  console.log("delete an assignment");


});

router.get('/:id/submissions', (req, res) => {

  console.log("get all submissions for an assignment");


});

router.post('/:id/submissions', (req, res) => {

  console.log("submit an assignment");


});


module.exports = router;
