const router = require('express').Router();






router.post('/', (req, res) => {

  console.log("Create a new user");


});

router.post('/login', (req, res) => {

  console.log("log in a user");


});

router.get('/:id', (req, res) => {

  console.log("fetch data on a specific ");


});



module.exports = router;
