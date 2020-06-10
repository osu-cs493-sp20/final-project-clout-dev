const { ObjectId, collectionNames } = require('mongodb');
const bcrypt = require('bcryptjs');
const { getDBReference } = require('../lib/mongo');
const { extractValidFields } = require('../lib/validation');


/*
 * Schema describing required/optional fields of a business object.
 */
const UserSchema = {
  name: { required: true },
  email: { required: true },
  role: { required: true },
  password: { required: true },
};
exports.UserSchema = UserSchema;


async function insertNewUser(user) {
  console.log("Inside insertNewUser");
  userToInsert = extractValidFields(user, UserSchema);
  console.log("Prehash: ", userToInsert.password);
  userToInsert.password = await bcrypt.hash(
    userToInsert.password,
    8
  )
  console.log("Post-Hash: ", userToInsert.password);
  const db = getDBReference();
  const collection = db.collection('users');
  const result = await collection.insertOne(userToInsert);
  console.log(result.insertedId);
  return result.insertedId;
}
exports.insertNewUser = insertNewUser;

exports.validateUser = async function(email, password) {
  const user = await exports.getUserByEmail(email);
  return user &&
    await bcrypt.compare(password, user.password);
};

/*
 * Executes a DB query to fetch information about a single specified
 * business based on its ID.  Does not fetch photo data for the
 * business.  Returns a Promise that resolves to an object containing
 * information about the requested business.  If no business with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getUserByEmail(email) {
  console.log("Searching for email: ", email);
  const db = getDBReference();
  const collection = db.collection('users');
/* db.listCollections().toArray(function(err, collInfos) {
    // collInfos is an array of collection info objects that look like:
    // { name: 'test', options: {} }
    console.log(collInfos);
});
*/
  const results = await collection
      .find({ "email": email })
      .toArray();
    return results[0];
}
exports.getUserByEmail = getUserByEmail;

async function getUserById(id) {
  console.log("Searching for id: ", id);
  const db = getDBReference();
  const collection = db.collection('users');
/* db.listCollections().toArray(function(err, collInfos) {
    // collInfos is an array of collection info objects that look like:
    // { name: 'test', options: {} }
    console.log(collInfos);
});
*/
  const results = await collection
      .find({ "id": id })
      .toArray();
    return results[0];
}
exports.getUserById = getUserById;

async function getStudentCourses(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const studentsClasses = [];
  if(ObjectId.isValid(id))
  {
    const results = await collection
      .find({"enrollment" : id}).toArray();
    
    for(var i = 0; i < results.length; i++)
    {
      studentsClasses.push(results[i]._id);
    }  
    return studentsClasses;
  }
  else
  {
    return null;
  }
  
}
exports.getStudentCourses = getStudentCourses;


async function getTaughtCourses(id) {
  const db = getDBReference();
	const collection = db.collection('courses');
  
  if(ObjectId.isValid(id))
  {
		const results = await collection
			.find({instructorId: id})
			.toArray();
		return results;
  }
  else
  {
    return null;
  }
}
exports.getTaughtCourses = getTaughtCourses;
