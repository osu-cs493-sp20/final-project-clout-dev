const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

/*
 * Schema describing required/optional fields of a business object.
 */
const AssignmentSchema = {
  course: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true }
};
exports.AssignmentSchema = AssignmentSchema;

const SubmitSchema = {
  studentId: { required: true },
  assignmentId: { required: true },
  courseId: { required: true }
};
exports.SubmitSchema = SubmitSchema;

//should return id of inserted course
async function insertNewAssignment(assignment) {
  const a = "write this function";
}
exports.insertNewAssignment = insertNewAssignment;


async function getAssignmentDetailsById(id) {
  const db = getDBReference();
  const collection = db.collection('assignments');
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
exports.getAssignmentDetailsById = getAssignmentDetailsById;


async function deleteAssignmentById(id) {
  const a = "write this function";
}
exports.deleteAssignmentById = deleteAssignmentById;

async function getSubmissionPage(assignmentId, page) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, {
    bucketName: 'submissions'
  });

  const total = await bucket.find({ "metadata.assignmentId": assignmentId }).toArray();
  const count = total.length;

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 5;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;
  if (!ObjectId.isValid(assignmentId)) {
    return null;
  } else {

    const results = await bucket.find({ "metadata.assignmentId": assignmentId })
      .sort({ _id: 1 })
      .skip(offset)
      .limit(pageSize)
      .toArray();

    for (const i in results){
      console.log(i);
      results[i].url = `/assignments/media/${results[i].filename}`;
    }

    return {
      submissions: results,
      page: page,
      totalPages: lastPage,
      pageSize: pageSize,
      count: count
    };
  }
}
exports.getSubmissionPage = getSubmissionPage;

async function patchAssignment(id, data) {
  const a = "write this function";
}
exports.patchAssignment = patchAssignment;

//SUBMISSION QUERIES

exports.getFileDownloadStreamByFilename = function (filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, {
    bucketName: 'submissions'
  });
  return bucket.openDownloadStreamByName(filename);
};

exports.saveSubmitFile = async function (file) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, {
      bucketName: 'submissions'
    });
    const metadata = {
      contentType: file.contentType,
      studentId: file.studentId,
      assignmentId: file.assignmentId,
      timestamp: file.timestamp
    };
    console.log("========", file.path, "========");
    const uploadStream = bucket.openUploadStream(
      file.filename,
      { metadata: metadata }
    );
    fs.createReadStream(file.path).pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
  });
};
