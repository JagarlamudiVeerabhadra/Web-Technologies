const EventEmitter = require('events');

// Create event emitter object
const emitter = new EventEmitter();

// Register first listener
emitter.on('studentRegistered', (name, course) => {
    console.log(`Listener 1: ${name} has registered for ${course}.`);
});

// Register second listener for same event
emitter.on('studentRegistered', (name, course) => {
    console.log(`Listener 2: Welcome ${name} to the ${course} course.`);
});

// Register another custom event
emitter.on('examScheduled', (subject, date) => {
    console.log(`Exam for ${subject} is scheduled on ${date}.`);
});

// Trigger event with data
emitter.emit('studentRegistered', 'Veera', 'Node.js');

// Demonstrate asynchronous behavior
setTimeout(() => {
    emitter.emit('examScheduled', 'Web Technology', '10 April 2026');
}, 2000);