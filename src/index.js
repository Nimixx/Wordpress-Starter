const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Initialize a new WordPress project
 * @param {Object} config - Project configuration
 * @param {string} config.name - Name of the project and root folder
 * @param {string} config.structure - Structure type ('classic' or 'bedrock')
 */
function initializeProject(config) {
  const projectName = config.name;
  const structureType = config.structure || 'classic';
  
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
    
    // Create the folder structure based on the selected type
    createFolderStructure(projectPath, structureType);
    
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
 * Create the folder structure based on type
 * @param {string} projectPath - Path to the project directory
 * @param {string} structureType - Structure type ('classic' or 'bedrock')
 */
function createFolderStructure(projectPath, structureType) {
  console.log(chalk.cyan(`Setting up ${chalk.bold(structureType)} folder structure...`));
  
  if (structureType === 'classic') {
    createClassicStructure(projectPath);
  } else if (structureType === 'bedrock') {
    createBedrockStructure(projectPath);
  } else {
    console.log(chalk.yellow(`Warning: Unknown structure type '${structureType}', using classic structure.`));
    createClassicStructure(projectPath);
  }
}

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

/**
 * Create a Bedrock WordPress folder structure
 * @param {string} projectPath - Path to the project directory
 */
function createBedrockStructure(projectPath) {
  // Create README with bedrock structure info
  const readmePath = path.join(projectPath, 'README.md');
  fs.writeFileSync(readmePath, `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the Bedrock structure.\n\n## Structure\nModern WordPress stack with improved folder structure and security.\n`);
  
  // Create necessary directories for Bedrock structure
  const directories = [
    path.join(projectPath, 'web'),
    path.join(projectPath, 'web', 'app'),
    path.join(projectPath, 'web', 'app', 'themes'),
    path.join(projectPath, 'web', 'app', 'plugins'),
    path.join(projectPath, 'web', 'app', 'uploads'),
    path.join(projectPath, 'config'),
    path.join(projectPath, 'config', 'environments'),
  ];
  
  directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.green(`✅ Created directory: ${path.relative(process.cwd(), dir)}`));
  });
  
  // Create a .env example file
  const envPath = path.join(projectPath, '.env.example');
  fs.writeFileSync(envPath, `DB_NAME=database_name\nDB_USER=database_user\nDB_PASSWORD=database_password\n\nWP_ENV=development\nWP_HOME=http://example.com\nWP_SITEURL=\${WP_HOME}/wp\n`);
  
  // Create a basic composer.json file
  const composerPath = path.join(projectPath, 'composer.json');
  const composerContent = JSON.stringify({
    name: `my/${path.basename(projectPath)}`,
    type: "project",
    description: "WordPress project with Bedrock structure",
    require: {
      "php": ">=7.4",
      "composer/installers": "^2.0",
      "roots/wordpress": "^6.0"
    },
    config: {
      "allow-plugins": {
        "composer/installers": true
      }
    }
  }, null, 2);
  
  fs.writeFileSync(composerPath, composerContent);
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