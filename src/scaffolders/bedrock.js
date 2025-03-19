const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
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
 * Create a Bedrock WordPress folder structure using Composer
 * @param {string} projectPath - Path to the project directory
 */
async function createBedrockStructure(projectPath) {
  try {
    // Check if Composer is installed
    try {
      execSync('composer --version', { stdio: 'ignore' });
    } catch (error) {
      displayWarning('Composer is not installed or not in PATH. Falling back to manual folder creation.');
      await createBedrockStructureManually(projectPath);
      return;
    }

    displayInfo('Using Composer to set up Bedrock');
    
    // Get the original current directory to return to it later
    const originalDir = process.cwd();
    const projectName = path.basename(projectPath);
    
    try {
      // Use Composer to create a new Bedrock project
      createSectionHeader('Setting up Bedrock');
      displayProcessing('Creating Bedrock project with Composer...');
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
      
      displaySuccess('Bedrock has been successfully set up!');
      
      // Ask if the user wants to set up the .env file
      await setupEnvFile(projectPath);
      
    } finally {
      // Change back to the original directory
      process.chdir(originalDir);
    }
    
  } catch (error) {
    displayWarning(`Error using Composer: ${error.message}. Falling back to manual folder creation.`);
    await createBedrockStructureManually(projectPath);
  }
}

/**
 * Fallback method to create Bedrock-like folder structure manually
 * @param {string} projectPath - Path to the project directory
 */
async function createBedrockStructureManually(projectPath) {
  createSectionHeader('Creating Manual Bedrock Structure');
  
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
  
  displayProcessing('Creating directory structure...');
  
  directories.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.hex(catppuccin.green)(`  ✓ Created: ${path.relative(process.cwd(), dir)}`));
  });
  
  // Create a .env example file
  displayProcessing('Creating configuration files...');
  const envPath = path.join(projectPath, '.env.example');
  fs.writeFileSync(envPath, `DB_NAME=database_name\nDB_USER=database_user\nDB_PASSWORD=database_password\n\nWP_ENV=development\nWP_HOME=http://example.com\nWP_SITEURL=\${WP_HOME}/wp\n`);
  console.log(chalk.hex(catppuccin.green)('  ✓ Created: .env.example'));
  
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
  console.log(chalk.hex(catppuccin.green)('  ✓ Created: composer.json'));
  
  displayWarning('Composer wasn\'t used. You\'ll need to manually run composer install to complete the setup.');
  
  // Ask if the user wants to set up the .env file
  await setupEnvFile(projectPath);
}

/**
 * Set up the .env file by prompting for database and URL settings
 * @param {string} projectPath - Path to the project directory
 */
async function setupEnvFile(projectPath) {
  createSectionHeader('Environment Configuration');
  
  const setupEnvPrompt = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'setupEnv',
      message: chalk.hex(catppuccin.sapphire)('🔧 ') + chalk.hex(catppuccin.sapphire).bold('Would you like to set up the .env file with database credentials?'),
      default: true
    }
  ]);
  
  if (!setupEnvPrompt.setupEnv) {
    displayInfo('Skipping .env setup. You can manually configure it later.');
    return;
  }
  
  displayProcessing('Setting up .env file...');
  
  // Check if .env.example exists
  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');
  
  if (!fs.existsSync(envExamplePath)) {
    displayWarning('.env.example file not found. Skipping .env setup.');
    return;
  }
  
  // Get database credentials from user
  console.log(chalk.hex(catppuccin.sapphire).bold('\n🛢️  Database Configuration:\n'));
  
  const dbCredentials = await inquirer.prompt([
    {
      type: 'input',
      name: 'dbName',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database name:',
      default: 'wordpress'
    },
    {
      type: 'input',
      name: 'dbUser',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database user:',
      default: 'root'
    },
    {
      type: 'input',
      name: 'dbPassword',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database password:',
      default: ''
    },
    {
      type: 'input',
      name: 'dbHost',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database host:',
      default: 'localhost'
    }
  ]);
  
  // Get site URL settings
  console.log(chalk.hex(catppuccin.sapphire).bold('\n🌐 Site Configuration:\n'));
  
  const urlSettings = await inquirer.prompt([
    {
      type: 'input',
      name: 'wpHome',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Site URL (WP_HOME):',
      default: 'http://localhost:8000'
    },
    {
      type: 'list',
      name: 'wpEnv',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Environment:',
      choices: [
        { name: '🛠️  Development', value: 'development' },
        { name: '🔍 Staging', value: 'staging' },
        { name: '🚀 Production', value: 'production' }
      ],
      default: 'development'
    }
  ]);
  
  // Read the .env.example file
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace the placeholders with actual values
  let envContent = envExampleContent
    .replace(/DB_NAME=.*/g, `DB_NAME=${dbCredentials.dbName}`)
    .replace(/DB_USER=.*/g, `DB_USER=${dbCredentials.dbUser}`)
    .replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${dbCredentials.dbPassword}`);
  
  // Add DB_HOST if not already in the template
  if (!envContent.includes('DB_HOST=')) {
    envContent = envContent.replace(/DB_PASSWORD=.*(\n|$)/g, `DB_PASSWORD=${dbCredentials.dbPassword}\nDB_HOST=${dbCredentials.dbHost}`);
  } else {
    envContent = envContent.replace(/DB_HOST=.*/g, `DB_HOST=${dbCredentials.dbHost}`);
  }
  
  // Update environment and URL settings
  envContent = envContent
    .replace(/WP_ENV=.*/g, `WP_ENV=${urlSettings.wpEnv}`)
    .replace(/WP_HOME=.*/g, `WP_HOME=${urlSettings.wpHome}`);
  
  // Ensure WP_SITEURL is set correctly
  if (!envContent.includes('WP_SITEURL=')) {
    envContent = envContent.replace(/WP_HOME=.*(\n|$)/g, `WP_HOME=${urlSettings.wpHome}\nWP_SITEURL=\${WP_HOME}/wp`);
  }
  
  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  
  displaySuccess('.env file has been configured!');
}

module.exports = {
  createBedrockStructure
}; 