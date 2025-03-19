const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const boxen = require('boxen');
const { createSectionHeader, displaySuccess, displayInfo, displayWarning, displayProcessing } = require('./common');

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
  lavender: '#b4befe'
};

/**
 * Display Classic WordPress information box
 */
function displayClassicInfo() {
  console.log('\n');
  
  const classicBox = boxen(
    chalk.hex(catppuccin.text).bold('Classic WordPress Structure\n\n') +
    chalk.hex(catppuccin.text)('The Classic WordPress setup provides a traditional WordPress installation with standard folder organization. This structure is familiar to most WordPress developers and offers:\n\n') +
    chalk.hex(catppuccin.blue)('• ') + chalk.hex(catppuccin.text)('Standard WordPress core files\n') +
    chalk.hex(catppuccin.blue)('• ') + chalk.hex(catppuccin.text)('Traditional wp-content folder structure\n') +
    chalk.hex(catppuccin.blue)('• ') + chalk.hex(catppuccin.text)('Standard wp-config.php configuration\n') +
    chalk.hex(catppuccin.blue)('• ') + chalk.hex(catppuccin.text)('Compatibility with most WordPress plugins and themes\n') +
    chalk.hex(catppuccin.blue)('• ') + chalk.hex(catppuccin.text)('Familiar environment for WordPress developers'),
    {
      padding: 2,
      margin: 0,
      borderStyle: 'round',
      borderColor: catppuccin.blue,
      float: 'left'
    }
  );
  
  console.log(classicBox);
  console.log('\n');
}

/**
 * Display project completion with next steps
 * @param {string} projectPath - Path to the project directory
 */
function displayProjectCompletion(projectPath) {
  const projectName = path.basename(projectPath);
  
  console.log('\n');
  console.log(chalk.hex(catppuccin.green).bold('✅ Project initialized successfully!'));
  
  // Display next steps in a styled box
  const nextStepsContent = 
    chalk.hex(catppuccin.yellow).bold('📝 Next steps:\n\n') +
    chalk.hex(catppuccin.text)(`1. cd ${projectName}\n`) +
    chalk.hex(catppuccin.text)(`2. Follow the instructions in the README.md file`);
  
  console.log(
    boxen(nextStepsContent, {
      padding: { top: 1, right: 2, bottom: 1, left: 2 },
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: catppuccin.yellow,
      width: 52,
      float: 'left'
    })
  );
  
  console.log('\n');
}

/**
 * Create a classic WordPress folder structure using WP-CLI
 * @param {string} projectPath - Path to the project directory
 */
function createClassicStructure(projectPath) {
  // Display Classic information
  displayClassicInfo();
  
  try {
    // Check if WP-CLI is installed
    try {
      execSync('wp --info', { stdio: 'ignore' });
    } catch (error) {
      displayWarning('WP-CLI is not installed or not in PATH. Falling back to manual folder creation.');
      createClassicStructureManually(projectPath);
      return;
    }

    createSectionHeader('WordPress Core Installation');
    displayInfo('Using WP-CLI to download and configure WordPress');
    
    // Change to the project directory
    process.chdir(projectPath);
    
    // Download WordPress core
    displayProcessing('Downloading WordPress core...');
    execSync('wp core download --force', { stdio: 'inherit' });
    
    // Create wp-config.php (with placeholder values that can be updated later)
    displayProcessing('Creating a basic wp-config.php file...');
    execSync('wp config create --dbname=wordpress_db --dbuser=root --dbpass=root --dbhost=localhost --skip-check', 
      { stdio: 'inherit' });
    
    // Create a README with classic structure info
    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(readmePath, `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the classic structure.\n\n## Structure\nStandard WordPress installation with the latest WordPress core.\n\n## Configuration\nUpdate the database configuration in wp-config.php before running the site.\n`);
    
    console.log('\n');
    console.log(chalk.hex(catppuccin.green).bold('✅ WordPress core has been downloaded and configured!'));
    
    // Display database configuration reminder
    console.log('\n');
    console.log(chalk.hex(catppuccin.mauve).bold('🛢️  Database Configuration:'));
    console.log(chalk.hex(catppuccin.text)('    Edit wp-config.php to set your database credentials:'));
    console.log(chalk.hex(catppuccin.text)('    Database name: ') + chalk.hex(catppuccin.green)('wordpress_db (update with your own)'));
    console.log(chalk.hex(catppuccin.text)('    Database user: ') + chalk.hex(catppuccin.green)('root (update with your own)'));
    console.log(chalk.hex(catppuccin.text)('    Database password: ') + chalk.hex(catppuccin.green)('root (update with your own)'));
    console.log(chalk.hex(catppuccin.text)('    Database host: ') + chalk.hex(catppuccin.green)('localhost'));
    
    // Display project completion message
    displayProjectCompletion(projectPath);
    
  } catch (error) {
    displayWarning(`Error using WP-CLI: ${error.message}. Falling back to manual folder creation.`);
    createClassicStructureManually(projectPath);
  }
}

/**
 * Fallback method to create classic WordPress folder structure manually 
 * @param {string} projectPath - Path to the project directory
 */
function createClassicStructureManually(projectPath) {
  createSectionHeader('Creating Manual WordPress Structure');
  
  // Create README with classic structure info
  const readmePath = path.join(projectPath, 'README.md');
  fs.writeFileSync(readmePath, `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the classic structure.\n\n## Structure\nStandard WordPress installation structure.\n`);
  
  displayProcessing('Creating directory structure...');
  
  // Create wp-content folder with subfolders
  const wpContentPath = path.join(projectPath, 'wp-content');
  fs.mkdirSync(wpContentPath);
  console.log(chalk.hex(catppuccin.green)(`  ✓ Created: wp-content`));
  
  // Create necessary subdirectories
  const directories = [
    path.join(wpContentPath, 'themes'),
    path.join(wpContentPath, 'plugins'),
    path.join(wpContentPath, 'uploads'),
  ];
  
  directories.forEach(dir => {
    fs.mkdirSync(dir);
    console.log(chalk.hex(catppuccin.green)(`  ✓ Created: wp-content/${path.basename(dir)}`));
  });
  
  // Create a placeholder index.php file
  displayProcessing('Creating placeholder files...');
  const indexPath = path.join(projectPath, 'index.php');
  fs.writeFileSync(indexPath, `<?php\n// Silence is golden.\n// This is a placeholder for the WordPress installation.\n`);
  console.log(chalk.hex(catppuccin.green)(`  ✓ Created: index.php`));
  
  console.log('\n');
  console.log(chalk.hex(catppuccin.yellow).bold('⚠️ WP-CLI wasn\'t used. You\'ll need to manually download WordPress.'));
  
  // Display project completion message
  displayProjectCompletion(projectPath);
}

module.exports = {
  createClassicStructure
}; 