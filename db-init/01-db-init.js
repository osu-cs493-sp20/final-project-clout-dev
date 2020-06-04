db.users.createIndex( { email: 1 }, { unique: true, sparse: true } )
db.users.insertMany([
  {
    "_id": ObjectId("5ed87c1aeb574b43042c65ab"),
    "name": "Christopher Hoskins",
    "email": "hoskinsc@example.edu",
    "userType": "admin",
    "password": "$2y$08$UwtalT3cHwyXAW1tlQksrOJ.zr9aAWFHcdkeLJ7AnlgkPTtsIW7UW"
  },
  {
    "_id": ObjectId("5ed87de2804989d940f81b51"),
    "name": "Erin Hoskins",
    "email": "hoskinse@example.edu",
    "userType": "admin",
    "password": "$2a$08$pGiii9ETeM4ObGvPb7vaW..4J9PdzN9IR4.TQjC0b7qOAX5lAiV/q"
  },
  {
    "_id": ObjectId("5ed87defc1f3893ea1579827"),
    "name": "John Doe",
    "email": "john.doe@example.edu",
    "userType": "instructor",
    "password": "$2a$08$8vtK5JZbfzlkAUFjipZlbO02bHSdNzN.DOYcjrqPJ.2b18vrCwQZm"
  },
  {
    "_id": ObjectId("5ed87dfa953930c19a5c8d9c"),
    "name": "Jane Doe",
    "email": "jane.doe@example.edu",
    "userType": "instructor",
    "password": "$2a$08$bzUMKN9QVMjIezuBThB7gOjX7qJIdl8U7KsES9PwVq6iVfk4u/9qq"
  },
  {
    "_id": ObjectId("5ed87e0779fae4e5d30dd812"),
    "name": "Bob Vance",
    "email": "Bob.Vance@example.edu",
    "userType": "student",
    "password": "$2a$08$dM9ZKXoiCzs0xqg4bH3pIuc5Afr9AqRKwZnPTpueXBIvVe1MOK1eG"
  },
  {
    "_id": ObjectId("5ed87e0f05b806ac872cc522"),
    "name": "Phyllis Vance",
    "email": "Phyllis.Vance@example.edu",
    "userType": "student",
    "password": "$2a$08$RIizm5mh7nAXESMoqIaLN.rRRx6/IIaTY2fqnSxc7UBXMUpi.osB2"
  }
])
