/**
 * Base class for WordPress structure generators
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const boxen = require('boxen');
const { catppuccin, boxStyles } = require('../config/theme');
const { 
  createSectionHeader, 
  displaySuccess, 
  displayInfo, 
  displayWarning, 
  displayProcessing, 
} = require('../utils/ui');

class Structure {
  /**
   * Create a new structure generator
   * @param {string} projectPath - Path to the project directory
   */
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.projectName = path.basename(projectPath);
  }

  /**
   * Generate the WordPress structure
   * This method should be overridden by subclasses
   */
  async generate() {
    throw new Error('Method not implemented. Subclasses must implement this method.');
  }

  /**
   * Write a file to the project directory
   * @param {string} relativePath - Path relative to project root
   * @param {string} content - File content
   */
  writeProjectFile(relativePath, content) {
    const filePath = path.join(this.projectPath, relativePath);
    fs.writeFileSync(filePath, content);
    const displayPath = path.relative(process.cwd(), filePath);
    console.log(chalk.hex(catppuccin.green)(`  ✓ Created: ${displayPath}`));
  }

  /**
   * Create a directory in the project
   * @param {string} relativePath - Path relative to project root
   */
  createProjectDir(relativePath, { log = true } = {}) {
    const dirPath = path.join(this.projectPath, relativePath);
    fs.mkdirSync(dirPath, { recursive: true });
    
    if (log) {
      const displayPath = path.relative(process.cwd(), dirPath);
      console.log(chalk.hex(catppuccin.green)(`  ✓ Created: ${displayPath}`));
    }
    
    return dirPath;
  }

  /**
   * Create multiple directories in the project
   * @param {string[]} relativePaths - Array of paths relative to project root
   */
  createProjectDirs(relativePaths) {
    relativePaths.forEach((relativePath) => {
      this.createProjectDir(relativePath);
    });
  }

  /**
   * Generate a basic README file
   * @param {string} structureType - Type of structure ('classic' or 'bedrock')
   * @param {string} additionalContent - Additional content for README
   */
  generateReadme(structureType, additionalContent = '') {
    const readmeContent = `# ${this.projectName}

WordPress project created with WordPress Starter using the ${structureType} structure.

## Structure
${structureType === 'classic' 
  ? 'Standard WordPress installation with the latest WordPress core.' 
  : 'Modern WordPress stack with improved folder structure and security.'}
${additionalContent}`;

    this.writeProjectFile('README.md', readmeContent);
  }

  /**
   * Display structure information
   * @param {string} title - Title of the info box
   * @param {string} description - Description content
   * @param {string} color - Color for the box border
   */
  displayInfo(title, description, color = catppuccin.blue) {
    console.log('\n');
    
    const infoBox = boxen(
      chalk.hex(catppuccin.text).bold(`${title}\n\n`) +
      chalk.hex(catppuccin.text)(description),
      {
        padding: 2,
        margin: 0,
        borderStyle: 'round',
        borderColor: color,
        float: 'left',
      },
    );
    
    console.log(infoBox);
    console.log('\n');
  }

  /**
   * Display project completion message
   */
  displayCompletion() {
    console.log('\n');
    console.log(chalk.hex(catppuccin.green).bold('✅ Project initialized successfully!'));
    
    // Display next steps in a styled box
    const nextStepsContent = 
      chalk.hex(catppuccin.yellow).bold('📝 Next steps:\n\n') +
      chalk.hex(catppuccin.text)(`1. cd ${this.projectName}\n`) +
      chalk.hex(catppuccin.text)(`2. Follow the instructions in the README.md file`);
    
    console.log(
      boxen(nextStepsContent, boxStyles.nextSteps),
    );
    
    console.log('\n');
  }
}

module.exports = Structure; 