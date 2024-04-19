const fs = require('fs');
const path = require('path');

/**
 * Processes an input file to extract and write content to respective file paths.
 * @param {string} inputFile - The path to the input file containing structured content.
 */
function processInputFile(inputFile) {
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Split the data on the end marker and process each section
    const sections = data.split('===end===');

    sections.forEach((section) => {
      // Extract the filename
      const filenameMatch = section.match(/===filename:(.*?)===/s);
      // Extract the content immediately after the filename declaration to the end of the section
      const contentStart = section.indexOf('===', 12) + 3; // Start capturing after the filename line
      const content = section.substring(contentStart).trim();

      if (filenameMatch && content) {
        const filePath = filenameMatch[1].trim();
        const fullPath = path.resolve(__dirname, filePath); // Resolve full path for file writing

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });

        // Write the file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`File written to ${fullPath}`);
      }
    });
  });
}

// Example usage:
const inputFile = './refactored.txt'; // Replace with your actual input file path
processInputFile(inputFile);
