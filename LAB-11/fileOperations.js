// Import file system module
const fs = require('fs');

// File name
const fileName = 'example.txt';

// 1. CREATE / WRITE FILE
fs.writeFile(fileName, 'Hello, this is the initial content.\n', (err) => {
    if (err) {
        console.error('Error creating file:', err);
        return;
    }
    console.log('File created successfully.');

    // 2. READ FILE
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('\nFile content after creation:');
        console.log(data);

        // 3. APPEND FILE
        fs.appendFile(fileName, 'This is appended content.\n', (err) => {
            if (err) {
                console.error('Error appending file:', err);
                return;
            }
            console.log('\nContent appended successfully.');

            // 4. READ AGAIN
            fs.readFile(fileName, 'utf8', (err, updatedData) => {
                if (err) {
                    console.error('Error reading updated file:', err);
                    return;
                }
                console.log('\nFile content after appending:');
                console.log(updatedData);

                // 5. DELETE FILE
                fs.unlink(fileName, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log('\nFile deleted successfully.');
                });
            });
        });
    });
});