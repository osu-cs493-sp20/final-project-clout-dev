const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');
/*
 * Schema describing required/optional fields of a business object.
 */
const CourseSchema = {
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructor: { required: true }
};
exports.CourseSchema = CourseSchema;


/*
 * Executes a DB query to return a single page of coursees.  Returns a
 * Promise that resolves to an array containing the fetched page of coursees.
 */
async function getCoursePage(page) {
  const db = getDBReference();
  const collection = db.collection('courses');
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 5;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    courses: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getCoursePage = getCoursePage;

//should return id of inserted course
async function insertNewCourse(course) {
  const a = "write this function";
}
exports.insertNewCourse = insertNewCourse;


async function getCourseDetailsById(id) {
  const db = getDBReference();
  const collection = db.collection('courses');
  console.log("Is valid Id? ", ObjectId.isValid(id));
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    console.log(results[0]);
    return results[0];
  }
}
exports.getCourseDetailsById = getCourseDetailsById;


async function deleteCourseById(id) {
  const a = "write this function";
}
exports.deleteCourseById = deleteCourseById;

//should return array of student ids
async function getCourseStudents(id) {
  const a = "write this function";
}
exports.getCourseStudents = getCourseStudents;


async function getCourseAssignments(id) {
  const a = "write this function";
}
exports.getCourseAssignments = getCourseAssignments;

//enrolled returns True or False for whether a student (by id) is enrolled in a course (by id)
async function enrolled(studentId, courseId) {
  const db = getDBReference();
  const collection = db.collection('courses');
  if (!ObjectId.isValid(courseId)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(courseId) })
      .toArray();
    console.log("Is Enrolled:", results[0].enrolled.includes(studentId));
    return results[0].enrolled.includes(studentId);
  }
}
exports.enrolled = enrolled;


async function patchCourse(id, data) {
  const a = "write this function";
}
exports.patchCourse = patchCourse;
