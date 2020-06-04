// hardcoded _ids generated using https://observablehq.com/@hugodf/mongodb-objectid-generator

db.users.createIndex( { email: 1 }, { unique: true, sparse: true } )
db.users.insertMany([
  {
    "_id": ObjectId("5ed87c1aeb574b43042c65ab"),
    "name": "Christopher Hoskins",
    "email": "hoskinsc@example.edu",
    "role": "admin",
    "password": "$2y$08$UwtalT3cHwyXAW1tlQksrOJ.zr9aAWFHcdkeLJ7AnlgkPTtsIW7UW"
  },
  {
    "_id": ObjectId("5ed87de2804989d940f81b51"),
    "name": "Erin Hoskins",
    "email": "hoskinse@example.edu",
    "role": "admin",
    "password": "$2a$08$pGiii9ETeM4ObGvPb7vaW..4J9PdzN9IR4.TQjC0b7qOAX5lAiV/q"
  },
  {
    "_id": ObjectId("5ed87defc1f3893ea1579827"),
    "name": "John Doe",
    "email": "john.doe@example.edu",
    "role": "instructor",
    "password": "$2a$08$8vtK5JZbfzlkAUFjipZlbO02bHSdNzN.DOYcjrqPJ.2b18vrCwQZm"
  },
  {
    "_id": ObjectId("5ed87dfa953930c19a5c8d9c"),
    "name": "Jane Doe",
    "email": "jane.doe@example.edu",
    "role": "instructor",
    "password": "$2a$08$bzUMKN9QVMjIezuBThB7gOjX7qJIdl8U7KsES9PwVq6iVfk4u/9qq"
  },
  {
    "_id": ObjectId("5ed87e0779fae4e5d30dd812"),
    "name": "Bob Vance",
    "email": "Bob.Vance@example.edu",
    "role": "student",
    "password": "$2a$08$dM9ZKXoiCzs0xqg4bH3pIuc5Afr9AqRKwZnPTpueXBIvVe1MOK1eG"
  },
  {
    "_id": ObjectId("5ed87e0f05b806ac872cc522"),
    "name": "Phyllis Vance",
    "email": "Phyllis.Vance@example.edu",
    "role": "student",
    "password": "$2a$08$RIizm5mh7nAXESMoqIaLN.rRRx6/IIaTY2fqnSxc7UBXMUpi.osB2"
  }
])
db.courses.createIndex( { subject: 1, number: 1 }, { unique: true, sparse: true } )
db.courses.insertMany([
  {
    "_id": ObjectId("5ed8d947d3b79896da3daa16"),
    "subject": "CS",
    "number": "101",
    "title": "Intro to Quantum Computing",
    "term": "Spring 2020",
    "instructorId": "5ed87c1aeb574b43042c65ab"
  },
  {
    "_id": ObjectId("5ed8d95f46e3cd915a1bea83"),
    "subject": "CS",
    "number": "420",
    "title": "Python for Funsies",
    "term": "Spring 2020",
    "instructorId": "5ed87de2804989d940f81b51"
  }
])
db.assignments.createIndex( { course: 1 , name: 1}, { unique: true, sparse: true } )
db.assignments.insertMany([
  {
    "courseId": "5ed8d947d3b79896da3daa16",
    "title": "Quantum Computer Schematic",
    "due": "2020-12-04T11:26:19+0000",
    "points": "100"
  },
  {
    "courseId": "5ed8d947d3b79896da3daa16",
    "title": "Quantum Computer Prototype",
    "due": "2020-12-04T11:26:19+0000",
    "points": "200"
  },
  {
    "courseId": "5ed8d95f46e3cd915a1bea83",
    "title": "Hello World",
    "due": "2020-12-04T11:26:19+0000",
    "points": "100"
  },
  {
    "courseId": "5ed8d95f46e3cd915a1bea83",
    "title": "Basic Math",
    "due": "2020-12-04T11:26:19+0000",
    "points": "200"
  }
])

db.submissions.createIndex( { course: 1 , name: 1, userId: 1}, { unique: true, sparse: true } )
