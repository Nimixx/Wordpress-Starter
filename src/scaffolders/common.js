const chalk = require('chalk');

/**
 * Display a welcome message
 */
function displayWelcome() {
  console.log(chalk.green.bold('✨ Welcome to WordPress Starter! ✨'));
  console.log(chalk.white('This tool will help you scaffold a new WordPress project.'));
  console.log(chalk.white('Currently in development mode. More features coming soon!'));
  console.log();
  console.log(chalk.cyan('Future features:'));
  console.log(chalk.white('- WordPress core installation'));
  console.log(chalk.white('- Database setup'));
  console.log(chalk.white('- Theme and plugin installation'));
  console.log(chalk.white('- Custom configuration options'));
  console.log();
}

module.exports = {
  displayWelcome
}; 