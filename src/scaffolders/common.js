const chalk = require('chalk');
const boxen = require('boxen');

// Catppuccin Mocha Theme Colors
const catppuccin = {
  background: '#1e1e2e',
  text: '#cdd6f4',
  rosewater: '#f5e0dc',
  flamingo: '#f2cdcd',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe',
};

/**
 * Display a welcome message
 */
function displayWelcome() {
  console.log('\n');
  console.log(chalk.hex(catppuccin.green).bold('✨ Welcome to WordPress Starter! ✨'));
  console.log('\n');

  const welcomeBox = boxen(
    chalk.hex(catppuccin.text)(
      'This tool will help you scaffold a new WordPress project with a modern setup.\n\n',
    ) +
      chalk.hex(catppuccin.sapphire).bold('Features:\n') +
      chalk.hex(catppuccin.text)('• Interactive project setup\n') +
      chalk.hex(catppuccin.text)('• Multiple folder structure options\n') +
      chalk.hex(catppuccin.text)('• Automated WordPress installation\n') +
      chalk.hex(catppuccin.text)('• Environment configuration'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: catppuccin.green,
      float: 'left',
      backgroundColor: catppuccin.background,
    },
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
  console.log(
    chalk.hex(catppuccin.blue)('│  ') +
      chalk.hex(catppuccin.blue).bold(title) +
      chalk.hex(catppuccin.blue)('  │'),
  );
  console.log(chalk.hex(catppuccin.blue)('└' + '─'.repeat(title.length + 8) + '┘'));
  console.log('\n');
}

/**
 * Display a success message
 * @param {string} message - The success message
 */
function displaySuccess(message) {
  console.log(
    '\n' + chalk.hex(catppuccin.green)('✅ ') + chalk.hex(catppuccin.green).bold(message) + '\n',
  );
}

/**
 * Display an info message
 * @param {string} message - The info message
 */
function displayInfo(message) {
  console.log(
    '\n' + chalk.hex(catppuccin.blue)('ℹ️  ') + chalk.hex(catppuccin.text)(message) + '\n',
  );
}

/**
 * Display a warning message
 * @param {string} message - The warning message
 */
function displayWarning(message) {
  console.log(
    '\n' + chalk.hex(catppuccin.yellow)('⚠️  ') + chalk.hex(catppuccin.yellow)(message) + '\n',
  );
}

/**
 * Display a processing/loading message
 * @param {string} message - The processing message
 */
function displayProcessing(message) {
  console.log(
    '\n' + chalk.hex(catppuccin.teal)('⏳ ') + chalk.hex(catppuccin.teal)(message) + '\n',
  );
}

module.exports = {
  displayWelcome,
  createSectionHeader,
  displaySuccess,
  displayInfo,
  displayWarning,
  displayProcessing,
};
