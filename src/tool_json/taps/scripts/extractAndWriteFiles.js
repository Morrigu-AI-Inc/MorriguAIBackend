const fs = require('fs');
const path = require('path');


/**
 * Processes an input file to extract, replace, add, or remove content based on structured input.
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

      // Find all search-replace pairs in the section
      const regexPairs = [
        ...section.matchAll(/===search: (.*?)===[\r\n]+===replace: (.*?)===/gs),
      ];
      let operationsPerformed = false;

      // Apply each search-replace pair sequentially
      regexPairs.forEach((matches) => {
        const searchRegex = new RegExp(matches[1].trim(), 'gs'); // 'g' for global, 's' for dot matches newline
        const replace = matches[2].trim();
        fileContent = fileContent.replace(searchRegex, replace);
        operationsPerformed = true;
      });

      // Check for insertions where no search is provided
      const insertMatch = section.match(/===insert:(.*?)===/s);
      if (insertMatch && !operationsPerformed) {
        fileContent += '\n' + insertMatch[1].trim();
      }

      // Check for removals where no replace is specified
      const removeMatch = section.match(
        /===search: (.*?)===[\r\n]+===replace:===/s,
      );
      if (removeMatch) {
        const removeRegex = new RegExp(removeMatch[1].trim(), 'gs');
        fileContent = fileContent.replace(removeRegex, '');
      }

      // Write the updated content to the file
      fs.writeFileSync(filePath, fileContent, 'utf8');
      console.log(`File updated at ${filePath}`);
    });
  });
}

// Example usage
const inputFile = './refactored.txt'; // Replace with your actual input file path
processInputFile(inputFile);
