const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Initialize a new WordPress project
 * @param {string} projectName - Name of the project and root folder
 */
function initializeProject(projectName) {
  // Display welcome message
  displayWelcome();
  
  // Create project directory
  console.log(chalk.cyan(`Creating project directory: ${chalk.bold(projectName)}`));
  
  try {
    const projectPath = path.join(process.cwd(), projectName);
    
    // Check if directory already exists
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`Error: Directory '${projectName}' already exists.`));
      process.exit(1);
    }
    
    // Create the directory
    fs.mkdirSync(projectPath);
    console.log(chalk.green(`✅ Created directory: ${projectName}`));
    
    // Create placeholder file to show it worked
    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(readmePath, `# ${projectName}\n\nWordPress project created with WordPress Starter.\n`);
    
    console.log(chalk.green(`\n✅ Project initialized successfully!`));
    console.log(chalk.cyan(`\nNext steps:`));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  # Start building your WordPress project`));
  } catch (error) {
    console.log(chalk.red(`Error creating project: ${error.message}`));
    process.exit(1);
  }
}

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
  initializeProject,
  displayWelcome
}; 