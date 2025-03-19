const chalk = require('chalk');
const boxen = require('boxen');

/**
 * Display a welcome message
 */
function displayWelcome() {
  console.log('\n');
  console.log(chalk.green.bold('✨ Welcome to WordPress Starter! ✨'));
  console.log('\n');
  
  const welcomeBox = boxen(
    chalk.white('This tool will help you scaffold a new WordPress project with a modern setup.\n\n') +
    chalk.cyan.bold('Features:\n') +
    chalk.white('• Interactive project setup\n') +
    chalk.white('• Multiple folder structure options\n') +
    chalk.white('• Automated WordPress installation\n') +
    chalk.white('• Environment configuration'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green',
      float: 'center',
      backgroundColor: '#222'
    }
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
  console.log(chalk.cyan('┌' + '─'.repeat(title.length + 8) + '┐'));
  console.log(chalk.cyan('│  ') + chalk.cyan.bold(title) + chalk.cyan('  │'));
  console.log(chalk.cyan('└' + '─'.repeat(title.length + 8) + '┘'));
  console.log('\n');
}

/**
 * Display a success message
 * @param {string} message - The success message
 */
function displaySuccess(message) {
  console.log('\n' + chalk.green('✅ ') + chalk.green.bold(message) + '\n');
}

/**
 * Display an info message
 * @param {string} message - The info message
 */
function displayInfo(message) {
  console.log('\n' + chalk.blue('ℹ️  ') + chalk.white(message) + '\n');
}

/**
 * Display a warning message
 * @param {string} message - The warning message
 */
function displayWarning(message) {
  console.log('\n' + chalk.yellow('⚠️  ') + chalk.yellow(message) + '\n');
}

/**
 * Display a processing/loading message
 * @param {string} message - The processing message
 */
function displayProcessing(message) {
  console.log('\n' + chalk.cyan('⏳ ') + chalk.cyan(message) + '\n');
}

module.exports = {
  displayWelcome,
  createSectionHeader,
  displaySuccess,
  displayInfo,
  displayWarning,
  displayProcessing
}; 