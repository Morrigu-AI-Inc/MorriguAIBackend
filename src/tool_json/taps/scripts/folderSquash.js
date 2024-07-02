const fs = require('fs').promises;
const path = require('path');
const ignore = require('ignore');

async function concatenateFiles(sourceDir, outputFile) {
  let ig = ignore();

  try {
    // Read .gitignore file and add rules to the ignore instance
    const gitignore = await fs.readFile(
      path.join(sourceDir, '../../.gitignore'),
      'utf8',
    );
    ig = ignore().add(gitignore.split(/\r?\n/)); // Handle potential Windows line endings
  } catch (error) {
  }

  async function traverseDirectory(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      // Skip the specific public directory
      if (
        entry.isDirectory() &&
        entry.name === 'public' &&
        path.relative(sourceDir, entryPath) === 'public'
      ) {
        continue;
      }
      if (entry.isDirectory() && entry.name === 'locales') {
        continue;
      }
      // Explicitly skip the .git directory
      if (entry.isDirectory() && entry.name === '.git') {
        continue;
      }
      // Check if the path is ignored
      if (ig.ignores(path.relative(sourceDir, entryPath))) {
        continue;
      }

      if (entry.isDirectory()) {
        await traverseDirectory(entryPath);
      } else {
        // Skip image files, video files, and lock files
        if (
          /\.(jpg|jpeg|png|gif|bmp|tiff|mov)$/i.test(entry.name) ||
          /(\.lock|package-lock\.json|yarn\.lock)$/i.test(entry.name)
        ) {
          continue;
        }
        const content = await fs.readFile(entryPath, 'utf8');
        await fs.appendFile(
          outputFile,
          `===filename:${entryPath}===\n${content}\n===end===\n`,
        );
      }
    }
  }

  try {
    // Ensure the output file is created or cleared if it exists
    await fs.writeFile(outputFile, '');
    await traverseDirectory(sourceDir);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Usage
const sourceDirectory =
  '/Users/jasonst.cyr/Developer/morrigu/MorriguAI/src/pages'; // Update this path
const outputFilePath = './fullrepo.txt'; // Update this path
concatenateFiles(sourceDirectory, outputFilePath);
