
/*
 * Schema describing required/optional fields of a business object.
 */
const AssignmentSchema = {
  course: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true },
};
exports.AssignmentSchema = AssignmentSchema;

//should return id of inserted course
async function insertNewAssignment(assignment) {
  const a = "write this function";
}
exports.insertNewAssignment = insertNewAssignment;


async function getAssignmentDetailsById(id) {
  const a = "write this function";
}
exports.getAssignmentDetailsById = getAssignmentDetailsById;


async function deleteAssignmentById(id) {
  const a = "write this function";
}
exports.deleteAssignmentById = deleteAssignmentById;

async function getSubmissionPage(courseId, page) {
  const db = getDBReference();
  const collection = db.collection('submissions');
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



//This is going to need to be modified to actually work
  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();
//do this plz

  return {
    submissions: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getSubmissionPage = getSubmissionPage;

async function patchAssignment(id, data) {
  const a = "write this function";
}
exports.patchAssignment = patchAssignment;
