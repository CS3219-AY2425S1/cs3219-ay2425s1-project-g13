const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// executes code
exports.executePython = async (req, res) => {
    const code = (req.body.code);
    console.log(code)

    // Generate a temporary file path
    const tempFilePath = path.join(__dirname, 'temp_code.py');

    // Write the code to the temporary file
    fs.writeFile(tempFilePath, code, (writeErr) => {
        if (writeErr) {
            return res.status(500).json({ error: 'Failed to write temporary Python file.' });
        }

        // Run the Python code from the file in Docker
        exec(`docker run --rm -v ${tempFilePath}:/temp_code.py python:3.9 python /temp_code.py`, (error, stdout, stderr) => {
            // Clean up the temporary file after execution
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete temporary file:', unlinkErr);
            });

            if (error) {
                return res.status(400).json({ error: `Command execution error: ${error.message}` });
            }
            if (stderr) {
                return res.json({ output: stdout, error: stderr });
            }
            res.json({ output: stdout });
        });
    });
}
