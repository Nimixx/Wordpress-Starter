const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Create a Bedrock WordPress folder structure using Composer
 * @param {string} projectPath - Path to the project directory
 */
function createBedrockStructure(projectPath) {
  try {
    // Check if Composer is installed
    try {
      execSync('composer --version', { stdio: 'ignore' });
    } catch (error) {
      console.log(chalk.yellow('Composer is not installed or not in PATH. Falling back to manual folder creation.'));
      createBedrockStructureManually(projectPath);
      return;
    }

    console.log(chalk.cyan('Using Composer to set up Bedrock...'));
    
    // Get the original current directory to return to it later
    const originalDir = process.cwd();
    const projectName = path.basename(projectPath);
    
    try {
      // Use Composer to create a new Bedrock project
      console.log(chalk.cyan('⏳ Creating Bedrock project with Composer...'));
      execSync(`composer create-project roots/bedrock ${projectPath}`, { stdio: 'inherit' });
      
      // Change to the project directory
      process.chdir(projectPath);
      
      // Create a README with bedrock structure info (overwrite the one from Bedrock)
      const readmePath = path.join(projectPath, 'README.md');
      const readmeContent = `# ${projectName}

WordPress project created with WordPress Starter using the Bedrock structure.

## Structure
Modern WordPress stack with improved folder structure and security from Roots Bedrock.

## Getting Started

1. Update environment variables in the \`.env\` file:
  - Database variables
  - \`WP_ENV=development\`
  - \`WP_HOME=http://example.com\`
  - \`WP_SITEURL=\${WP_HOME}/wp\`

2. Set your site vhost document root to the \`web\` folder: \`/path/to/${projectName}/web/\`

3. Access WordPress admin at \`http://example.com/wp/wp-admin/\`
`;
      fs.writeFileSync(readmePath, readmeContent);
      
      console.log(chalk.green('✅ Bedrock has been successfully set up!'));
      
    } finally {
      // Change back to the original directory
      process.chdir(originalDir);
    }
    
  } catch (error) {
    console.log(chalk.yellow(`Error using Composer: ${error.message}`));
    console.log(chalk.yellow('Falling back to manual folder creation...'));
    createBedrockStructureManually(projectPath);
  }
}

/**
 * Fallback method to create Bedrock-like folder structure manually
 * @param {string} projectPath - Path to the project directory
 */
function createBedrockStructureManually(projectPath) {
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
  
  console.log(chalk.yellow('Note: Composer wasn\'t used. You\'ll need to manually run composer install to complete the setup.'));
}

module.exports = {
  createBedrockStructure
}; 