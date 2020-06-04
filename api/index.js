const router = require('express').Router();

router.use('/hello', require('./hello'));
router.use('/courses', require('./courses'));
router.use('/users', requircoursese('./users'));
router.use('/assignments', require('./assignments'));

module.exports = router;
