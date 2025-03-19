const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
 * Create a classic WordPress folder structure using WP-CLI
 * @param {string} projectPath - Path to the project directory
 */
function createClassicStructure(projectPath) {
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
    
    displaySuccess('WordPress core has been downloaded and configured!');
    
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
  
  displayWarning('WP-CLI wasn\'t used. You\'ll need to manually download WordPress.');
}

module.exports = {
  createClassicStructure
}; 