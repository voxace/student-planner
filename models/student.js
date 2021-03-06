const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Create schemas
const AssTaskSchema = new Schema({
  title: String,
  description: String,
  weight: Number,
  assigned: Date,
  due: Date
});

const HwTaskSchema = new Schema({
  title: String,
  description: String,
  due: Date
});

const ClassSchema = new Schema({
  name: String,
  teacher: String,
  ass_tasks: [AssTaskSchema],
  hw_tasks: [HwTaskSchema]
});

// username == email
const StudentSchema = new Schema({
  name: String,
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  twitterId: String,
  thumbnail: String,
  grade: Number,
  classes: [ClassSchema]
});


// Generating a hash
StudentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
StudentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create model
const Student = mongoose.model('student', StudentSchema);

// Export to use in other files
module.exports = Student;
