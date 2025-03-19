const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
      console.log(chalk.yellow('WP-CLI is not installed or not in PATH. Falling back to manual folder creation.'));
      createClassicStructureManually(projectPath);
      return;
    }

    console.log(chalk.cyan('Using WP-CLI to download and configure WordPress...'));
    
    // Change to the project directory
    process.chdir(projectPath);
    
    // Download WordPress core
    console.log(chalk.cyan('⏳ Downloading WordPress core...'));
    execSync('wp core download --force', { stdio: 'inherit' });
    
    // Create wp-config.php (with placeholder values that can be updated later)
    console.log(chalk.cyan('⏳ Creating a basic wp-config.php file...'));
    execSync('wp config create --dbname=wordpress_db --dbuser=root --dbpass=root --dbhost=localhost --skip-check', 
      { stdio: 'inherit' });
    
    // Create a README with classic structure info
    const readmePath = path.join(projectPath, 'README.md');
    fs.writeFileSync(readmePath, `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the classic structure.\n\n## Structure\nStandard WordPress installation with the latest WordPress core.\n\n## Configuration\nUpdate the database configuration in wp-config.php before running the site.\n`);
    
    console.log(chalk.green('✅ WordPress core has been downloaded and configured!'));
    
  } catch (error) {
    console.log(chalk.yellow(`Error using WP-CLI: ${error.message}`));
    console.log(chalk.yellow('Falling back to manual folder creation...'));
    createClassicStructureManually(projectPath);
  }
}

/**
 * Fallback method to create classic WordPress folder structure manually 
 * @param {string} projectPath - Path to the project directory
 */
function createClassicStructureManually(projectPath) {
  // Create README with classic structure info
  const readmePath = path.join(projectPath, 'README.md');
  fs.writeFileSync(readmePath, `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the classic structure.\n\n## Structure\nStandard WordPress installation structure.\n`);
  
  // Create wp-content folder with subfolders
  const wpContentPath = path.join(projectPath, 'wp-content');
  fs.mkdirSync(wpContentPath);
  
  // Create necessary subdirectories
  const directories = [
    path.join(wpContentPath, 'themes'),
    path.join(wpContentPath, 'plugins'),
    path.join(wpContentPath, 'uploads'),
  ];
  
  directories.forEach(dir => {
    fs.mkdirSync(dir);
    console.log(chalk.green(`✅ Created directory: ${path.relative(process.cwd(), dir)}`));
  });
  
  // Create a placeholder index.php file
  const indexPath = path.join(projectPath, 'index.php');
  fs.writeFileSync(indexPath, `<?php\n// Silence is golden.\n// This is a placeholder for the WordPress installation.\n`);
  
  console.log(chalk.yellow('Note: WP-CLI wasn\'t used. You\'ll need to manually download WordPress.'));
}

module.exports = {
  createClassicStructure
}; 