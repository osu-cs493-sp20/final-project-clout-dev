
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
