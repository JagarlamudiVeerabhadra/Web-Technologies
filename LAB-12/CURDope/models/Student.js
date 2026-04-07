const mongoose = require('mongoose');

// Schema definition
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        required: true
    }
});

// Model creation
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;