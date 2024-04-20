const fs = require('fs');
const path = require('path');


/**
 * Reads the input file and processes each section separated by '===end==='.
 * @param {string} inputFile - The path to the input file containing structured content.
 */
function processInputFile(inputFile) {
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Split the data on the end marker and process each valid section
    const sections = data
      .split('===end===')
      .filter((section) => section.trim());

    sections.forEach((section) => {
      // Match filename and initialize other variables
      const filenameMatch = section.match(/===filename: (.*?)===/s);
      if (!filenameMatch) return;

      const filePath = path.resolve(__dirname, filenameMatch[1].trim());
      const dir = path.dirname(filePath);

      // Ensure the directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Read existing content if file exists
      let fileContent = fs.existsSync(filePath)
        ? fs.readFileSync(filePath, 'utf8')
        : '';

      // Regex to find all search and replace pairs
      const regexPairs = [
        ...section.matchAll(/===search: (.*?)===[\r\n]+===replace: (.*?)===/gs),
      ];

      // Apply all search-replace pairs
      regexPairs.forEach((matches) => {
        const searchRegex = new RegExp(matches[1].trim(), 'gs'); // 'g' for global, 's' for dot matches newline
        const replace = matches[2].trim();
        fileContent = fileContent.replace(searchRegex, replace);
      });

      // Write the updated content to the file
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`File updated at ${filePath}`);
    });
  });
}

// Example usage:
const inputFile = './refactored.txt'; // Replace with your actual input file path
processInputFile(inputFile);
