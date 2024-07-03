const fs = require('fs');
const path = require('path');


/**
 * Processes an input file to extract and replace content based on structured input.
 * @param {string} inputFile - The path to the input file containing structured content.
 */
function processInputFile(inputFile) {
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Split the data on the end marker and filter out any empty sections
    const sections = data
      .split('===end===')
      .filter((section) => section.trim());

    sections.forEach((section) => {
      const filenameMatch = section.match(/===filename: (.*?)===/s);
      if (!filenameMatch) return;

      const filePath = path.resolve(filenameMatch[1].trim());

      // Ensure the directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Extract the content to replace, assuming it starts after "===replace:"
      const replaceIndex = section.indexOf('===replace:') + 11;
      const newContent = section.slice(replaceIndex).trim();

      // Write the new content to the file
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`File updated at ${filePath}`);
    });
  });
}

// Example usage
const inputFile = './refactored/refactored-1713983673095.changes';
processInputFile(inputFile);
