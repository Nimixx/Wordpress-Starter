/**
 * UI utility functions for the WordPress Starter CLI
 */

const chalk = require('chalk');
const boxen = require('boxen');
const { catppuccin, boxStyles } = require('../config/theme');

/**
 * Display a welcome message
 */
function displayWelcome() {
  console.log('\n');
  console.log(chalk.hex(catppuccin.green).bold('✨ Welcome to WordPress Starter! ✨'));
  console.log('\n');
  
  const welcomeBox = boxen(
    chalk.hex(catppuccin.text)('This tool will help you scaffold a new WordPress project with a modern setup.\n\n') +
    chalk.hex(catppuccin.sapphire).bold('Features:\n') +
    chalk.hex(catppuccin.text)('• Interactive project setup\n') +
    chalk.hex(catppuccin.text)('• Multiple folder structure options\n') +
    chalk.hex(catppuccin.text)('• Automated WordPress installation\n') +
    chalk.hex(catppuccin.text)('• Environment configuration'),
    boxStyles.welcome,
  );
  
  console.log(welcomeBox);
  console.log('\n');
}

/**
 * Create a formatted section header
 * @param {string} title - The title of the section
 */
function createSectionHeader(title) {
  console.log('\n');
  console.log(chalk.hex(catppuccin.blue)('┌' + '─'.repeat(title.length + 8) + '┐'));
  console.log(chalk.hex(catppuccin.blue)('│  ') + chalk.hex(catppuccin.blue).bold(title) + chalk.hex(catppuccin.blue)('  │'));
  console.log(chalk.hex(catppuccin.blue)('└' + '─'.repeat(title.length + 8) + '┘'));
  console.log('\n');
}

/**
 * Display a success message
 * @param {string} message - The success message
 */
function displaySuccess(message) {
  console.log('\n' + chalk.hex(catppuccin.green)('✅ ') + chalk.hex(catppuccin.green).bold(message) + '\n');
}

/**
 * Display an info message
 * @param {string} message - The info message
 */
function displayInfo(message) {
  console.log('\n' + chalk.hex(catppuccin.blue)('ℹ️  ') + chalk.hex(catppuccin.text)(message) + '\n');
}

/**
 * Display a warning message
 * @param {string} message - The warning message
 */
function displayWarning(message) {
  console.log('\n' + chalk.hex(catppuccin.yellow)('⚠️  ') + chalk.hex(catppuccin.yellow)(message) + '\n');
}

/**
 * Display a processing/loading message
 * @param {string} message - The processing message
 */
function displayProcessing(message) {
  console.log('\n' + chalk.hex(catppuccin.teal)('⏳ ') + chalk.hex(catppuccin.teal)(message) + '\n');
}

/**
 * Display a structure description box
 * @param {string} structure - The structure type ('classic' or 'bedrock')
 */
function displayStructureDescription(structure, structureDescriptions) {
  const structureInfo = structureDescriptions[structure];
  
  console.log(
    boxen(
      chalk.hex(structureInfo.color).bold(`${structureInfo.title}\n\n`) +
      chalk.hex(catppuccin.text)(structureInfo.description.join('\n')),
      {
        padding: 2,
        margin: 0,
        borderStyle: 'round',
        borderColor: structureInfo.color,
        width: 70,
        float: 'left',
      },
    ),
  );
  
  console.log('\n');
}

/**
 * Display project completion with next steps
 * @param {string} projectPath - Path to the project directory
 */
function displayProjectCompletion(projectName) {
  console.log('\n');
  console.log(chalk.hex(catppuccin.green).bold('✅ Project initialized successfully!'));
  
  // Display next steps in a styled box
  const nextStepsContent = 
    chalk.hex(catppuccin.yellow).bold('📝 Next steps:\n\n') +
    chalk.hex(catppuccin.text)(`1. cd ${projectName}\n`) +
    chalk.hex(catppuccin.text)(`2. Follow the instructions in the README.md file`);
  
  console.log(
    boxen(nextStepsContent, boxStyles.nextSteps),
  );
  
  console.log('\n');
}

module.exports = {
  displayWelcome,
  _displayWelcome: displayWelcome,
  createSectionHeader,
  _createSectionHeader: createSectionHeader,
  displaySuccess,
  _displaySuccess: displaySuccess,
  displayInfo,
  _displayInfo: displayInfo,
  displayWarning,
  _displayWarning: displayWarning,
  displayProcessing,
  _displayProcessing: displayProcessing,
  displayStructureDescription,
  _displayStructureDescription: displayStructureDescription,
  displayProjectCompletion,
  _displayProjectCompletion: displayProjectCompletion,
}; 