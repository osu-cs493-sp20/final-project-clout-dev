const router = require('express').Router();

router.get('/')

router.get('/', (req, res, next) => {
  res.status(200).send("Welcome to our App  :)");
});


module.exports = router;
