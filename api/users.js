const router = require('express').Router();
const { validateAgainstSchema } = require('../lib/validation');
const {
  insertNewUser,
  validateUser,
  UserSchema,
  getUserById,
  getStudentCourses,
  getTaughtCourses
} = require('../models/user');
const { generateAuthToken, requireAuthentication } = require('../lib/authentication');

router.post('/', async (req, res) => {
  console.log("Create a new user");
  console.log(req.body);
   if (validateAgainstSchema(req.body, UserSchema)) {
     try {
       const id = await insertNewUser(req.body);
       res.status(201).send({
         _id: id
       });
     } catch (err) {
       console.error("  -- Error:", err);
       res.status(500).send({
         error: "Error inserting new user. User may already exist. Try again later."
       });
     }
   } else {
     res.status(400).send({
       error: "Request body does not contain a valid User."
     });
   }


});

router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
     try {
       const authenticated = await validateUser(
         req.body.email,
         req.body.password
       );
       if (authenticated) {
         const token = await generateAuthToken(req.body.email);
         res.status(200).send({
           token: token
         });
       } else {
         res.status(401).send({
           error: "Invalid authentication credentials."
         })
       }
     } catch (err) {
       console.error("  -- error:", err);
       res.status(500).send({
         error: "Error logging in.  Try again later."
       });
     }
   } else {
     res.status(400).send({
       error: "Request body needs a user ID and password."
     });
   }


});

//must be the one who they are requesting the data of
router.get('/:id', requireAuthentication, async (req, res, next) => {

  if(req.user == req.params.id) {

    const user = await getUserById(req.params.id);
    if(user) {

      try{
        if(req.role =='student') {
          const enrolledCourses = await getStudentCourses(req.params.id);
          user.courses = enrolledCourses;
        } else if (req.role == 'instructor') {
          const taughtCourses = await getTaughtCourses(req.params.id);
          user.courses = taughtCourses;
        }
        delete user.password;
        res.status(200).send(user);
      } catch (err) {
        console.error("  -- error:", err);
        res.status(500).send({  error: "Error logging in.  Try again later."  });
      }

    } else {
      next();
    }

  } else {
    res.status(403).send({error: "can not request the data of another user"});
  }

});



module.exports = router;
