/**
 * Bedrock WordPress structure generator
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { catppuccin } = require('../config/theme');
const Structure = require('../core/Structure');
const { createSectionHeader, displayInfo, displayWarning, displayProcessing } = require('../utils/ui');

class BedrockStructure extends Structure {
  /**
   * Display Bedrock information box
   */
  displayBedrockInfo() {
    this.displayInfo(
      'Bedrock WordPress Structure',
      'Bedrock is a modern WordPress stack that helps you get started with the best tools and project structure for WordPress development. Bedrock includes the following features:\n\n' +
      '• Improved folder structure for better organization\n' +
      '• Dependency management with Composer\n' +
      '• Environment variables with dotenv\n' +
      '• Enhanced security practices\n' +
      '• Better WordPress configuration for multiple environments\n' +
      '• WP directory installed in a subdirectory (wp/)\n' +
      '• Improved WordPress configuration for scalability',
      catppuccin.mauve
    );
  }

  /**
   * Generate the Bedrock WordPress structure
   */
  async generate() {
    // Display Bedrock information
    this.displayBedrockInfo();
    
    try {
      // Check if Composer is installed
      try {
        execSync('composer --version', { stdio: 'ignore' });
        await this.generateWithComposer();
      } catch (error) {
        displayWarning('Composer is not installed or not in PATH. Falling back to manual folder creation.');
        await this.generateManually();
      }
    } catch (error) {
      displayWarning(`Error during structure generation: ${error.message}`);
      await this.generateManually();
    }
  }

  /**
   * Generate structure using Composer
   */
  async generateWithComposer() {
    displayInfo('Using Composer to set up Bedrock');
    
    // Get the original current directory to return to it later
    const originalDir = process.cwd();
    
    try {
      // Use Composer to create a new Bedrock project
      createSectionHeader('Setting up Bedrock');
      displayProcessing('Creating Bedrock project with Composer...');
      execSync(`composer create-project roots/bedrock ${this.projectPath}`, { stdio: 'inherit' });
      
      // Change to the project directory
      process.chdir(this.projectPath);
      
      // Create a README with bedrock structure info (overwrite the one from Bedrock)
      const readmeAdditionalContent = `

## Getting Started

1. Update environment variables in the \`.env\` file:
  - Database variables
  - \`WP_ENV=development\`
  - \`WP_HOME=http://example.com\`
  - \`WP_SITEURL=\${WP_HOME}/wp\`

2. Set your site vhost document root to the \`web\` folder: \`/path/to/${this.projectName}/web/\`

3. Access WordPress admin at \`http://example.com/wp/wp-admin/\`
`;
      this.generateReadme('bedrock', readmeAdditionalContent);
      
      displayInfo('Bedrock has been successfully set up!');
      
      // Ask if the user wants to set up the .env file
      await this.setupEnvFile();
      
    } finally {
      // Change back to the original directory
      process.chdir(originalDir);
    }
  }

  /**
   * Generate structure manually (fallback method)
   */
  async generateManually() {
    createSectionHeader('Creating Manual Bedrock Structure');
    
    // Create README with bedrock structure info
    this.generateReadme('bedrock');
    
    // Create necessary directories for Bedrock structure
    const directories = [
      'web',
      'web/app',
      'web/app/themes',
      'web/app/plugins',
      'web/app/uploads',
      'config',
      'config/environments',
    ];
    
    displayProcessing('Creating directory structure...');
    this.createProjectDirs(directories);
    
    // Create a .env example file
    displayProcessing('Creating configuration files...');
    this.writeProjectFile(
      '.env.example', 
      `DB_NAME=database_name\nDB_USER=database_user\nDB_PASSWORD=database_password\n\nWP_ENV=development\nWP_HOME=http://example.com\nWP_SITEURL=\${WP_HOME}/wp\n`
    );
    
    // Create a basic composer.json file
    const composerContent = JSON.stringify({
      name: `my/${this.projectName}`,
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
    
    this.writeProjectFile('composer.json', composerContent);
    
    displayWarning('Composer wasn\'t used. You\'ll need to manually run composer install to complete the setup.');
    
    // Ask if the user wants to set up the .env file
    await this.setupEnvFile();
  }

  /**
   * Set up the .env file by prompting for database and URL settings
   */
  async setupEnvFile() {
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
      // Ask about Icon packages before completing
      await this.setupIconPackages();
      return;
    }
    
    displayProcessing('Setting up .env file...');
    
    // Check if .env.example exists
    const envExamplePath = path.join(this.projectPath, '.env.example');
    const envPath = path.join(this.projectPath, '.env');
    
    if (!fs.existsSync(envExamplePath)) {
      displayWarning('.env.example file not found. Skipping .env setup.');
      // Ask about Icon packages before completing
      await this.setupIconPackages();
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
    
    // Generate WordPress salts
    displayProcessing('Generating WordPress security keys and salts...');
    
    // Generate random keys and salts
    const generateRandomString = (length = 64) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_[]{}<>~`+=,.;:/?|';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const salts = {
      'AUTH_KEY': generateRandomString(),
      'SECURE_AUTH_KEY': generateRandomString(),
      'LOGGED_IN_KEY': generateRandomString(),
      'NONCE_KEY': generateRandomString(),
      'AUTH_SALT': generateRandomString(),
      'SECURE_AUTH_SALT': generateRandomString(),
      'LOGGED_IN_SALT': generateRandomString(),
      'NONCE_SALT': generateRandomString()
    };
    
    // Check if .env already contains salts section
    const saltKeysRegex = /(AUTH_KEY|SECURE_AUTH_KEY|LOGGED_IN_KEY|NONCE_KEY|AUTH_SALT|SECURE_AUTH_SALT|LOGGED_IN_SALT|NONCE_SALT)=/;
    const hasSalts = saltKeysRegex.test(envContent);
    
    if (hasSalts) {
      // Replace existing salts
      Object.entries(salts).forEach(([key, value]) => {
        const keyRegex = new RegExp(`${key}=.*`, 'g');
        if (keyRegex.test(envContent)) {
          envContent = envContent.replace(keyRegex, `${key}="${value}"`);
        } else {
          // If this key doesn't exist yet, add it to the end
          envContent += `\n${key}="${value}"`;
        }
      });
    } else {
      // Add new salts section if none exists
      let saltsSection = '\n# WordPress Security Keys and Salts\n';
      Object.entries(salts).forEach(([key, value]) => {
        saltsSection += `${key}="${value}"\n`;
      });
      
      envContent += saltsSection;
    }
    
    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    
    // Display configuration summary
    console.log('\n');
    console.log(chalk.hex(catppuccin.mauve).bold('🛢️  Database Configuration:'));
    console.log(chalk.hex(catppuccin.text)('    Database name: ') + chalk.hex(catppuccin.green)(dbCredentials.dbName));
    console.log(chalk.hex(catppuccin.text)('    Database user: ') + chalk.hex(catppuccin.green)(dbCredentials.dbUser));
    console.log(chalk.hex(catppuccin.text)('    Database password: ') + chalk.hex(catppuccin.green)(dbCredentials.dbPassword || '[empty]'));
    console.log(chalk.hex(catppuccin.text)('    Database host: ') + chalk.hex(catppuccin.green)(dbCredentials.dbHost));
    
    console.log('\n');
    console.log(chalk.hex(catppuccin.sapphire).bold('🌐 Site Configuration:'));
    console.log(chalk.hex(catppuccin.text)('    Site URL (WP_HOME): ') + chalk.hex(catppuccin.green)(urlSettings.wpHome));
    console.log(chalk.hex(catppuccin.text)('    Environment: ') + chalk.hex(catppuccin.green)('🛠️ ' + urlSettings.wpEnv.charAt(0).toUpperCase() + urlSettings.wpEnv.slice(1)));
    
    console.log('\n');
    console.log(chalk.hex(catppuccin.red).bold('🔑 Security:'));
    console.log(chalk.hex(catppuccin.text)('    WordPress salts and keys: ') + chalk.hex(catppuccin.green)('Generated successfully'));
    
    console.log('\n');
    console.log(chalk.hex(catppuccin.green).bold('✅ .env file has been configured!'));
    
    // Ask about Icon packages before completing
    await this.setupIconPackages();
  }

  /**
   * Ask the user if they want to add icon packages
   */
  async setupIconPackages() {
    createSectionHeader('Icons Setup');
    
    // Get the original current directory to return to it later
    const originalDir = process.cwd();
    
    try {
      // Ask if they want to add Blade icons
      const addIconsPrompt = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addIcons',
          message: chalk.hex(catppuccin.sapphire)('🎨 ') + chalk.hex(catppuccin.sapphire).bold('Would you like to add Blade icons to your project?'),
          default: true
        }
      ]);
      
      if (!addIconsPrompt.addIcons) {
        displayInfo('Skipping icon packages installation.');
        this.displayCompletion();
        return;
      }
      
      // Ask which icon package(s) to install
      const iconPackagePrompt = await inquirer.prompt([
        {
          type: 'list',
          name: 'iconPackage',
          message: chalk.hex(catppuccin.sapphire)('📦 ') + chalk.hex(catppuccin.sapphire).bold('Select an icon package to install:'),
          choices: [
            { name: '🔷 Lucide Icons', value: 'lucide' },
            { name: '🔶 Heroicons', value: 'heroicons' },
            { name: '💠 Fontawesome', value: 'fontawesome' },
            { name: '🔘 Boxicons', value: 'boxicons' },
            { name: '⚪ None/Skip', value: 'none' }
          ],
          default: 'lucide'
        }
      ]);
      
      if (iconPackagePrompt.iconPackage === 'none') {
        displayInfo('Skipping icon package installation.');
        this.displayCompletion();
        return;
      }
      
      // Change to the project directory to run composer
      process.chdir(this.projectPath);
      
      // Install the selected package
      displayProcessing(`Installing ${this.getIconPackageName(iconPackagePrompt.iconPackage)} icon package...`);
      
      try {
        // Execute composer require for the package
        const command = this.getComposerCommand(iconPackagePrompt.iconPackage);
        execSync(command, { stdio: 'inherit' });
        
        console.log('\n');
        console.log(chalk.hex(catppuccin.green).bold(`✅ ${this.getIconPackageName(iconPackagePrompt.iconPackage)} icons have been installed!`));
        
      } catch (error) {
        displayWarning(`Error installing icon package: ${error.message}`);
      }
      
      // Display project completion
      this.displayCompletion();
      
    } finally {
      // Change back to the original directory
      process.chdir(originalDir);
    }
  }

  /**
   * Get the display name for the selected icon package
   * @param {string} packageKey - The icon package key
   * @returns {string} The display name
   */
  getIconPackageName(packageKey) {
    const packageNames = {
      'lucide': 'Lucide',
      'heroicons': 'Heroicons',
      'fontawesome': 'Font Awesome',
      'boxicons': 'Boxicons'
    };
    
    return packageNames[packageKey] || packageKey;
  }

  /**
   * Get the composer command for the selected icon package
   * @param {string} packageKey - The icon package key
   * @returns {string} The composer command
   */
  getComposerCommand(packageKey) {
    const commands = {
      'lucide': 'composer require mallardduck/blade-lucide-icons',
      'heroicons': 'composer require blade-ui-kit/blade-heroicons',
      'fontawesome': 'composer require owenvoke/blade-fontawesome',
      'boxicons': 'composer require andreiio/blade-boxicons'
    };
    
    return commands[packageKey] || '';
  }
}

module.exports = BedrockStructure; 