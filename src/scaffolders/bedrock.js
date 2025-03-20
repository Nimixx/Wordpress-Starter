const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');
const boxen = require('boxen');
const {
  createSectionHeader,
  displaySuccess,
  displayInfo,
  displayWarning,
  displayProcessing,
} = require('./common');

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
 * Display Bedrock information box
 */
function displayBedrockInfo() {
  console.log('\n');

  const bedrockBox = boxen(
    chalk.hex(catppuccin.text).bold('Bedrock WordPress Structure\n\n') +
      chalk.hex(catppuccin.text)(
        'Bedrock is a modern WordPress stack that helps you get started with the best tools and project structure for WordPress development. Bedrock includes the following features:\n\n',
      ) +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Improved folder structure for better organization\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Dependency management with Composer\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Environment variables with dotenv\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Enhanced security practices\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Better WordPress configuration for multiple environments\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('WP directory installed in a subdirectory (wp/)\n') +
      chalk.hex(catppuccin.peach)('• ') +
      chalk.hex(catppuccin.text)('Improved WordPress configuration for scalability'),
    {
      padding: 2,
      margin: 0,
      borderStyle: 'round',
      borderColor: catppuccin.mauve,
      float: 'left',
    },
  );

  console.log(bedrockBox);
  console.log('\n');
}

/**
 * Create a Bedrock WordPress folder structure using Composer
 * @param {string} projectPath - Path to the project directory
 */
async function createBedrockStructure(projectPath) {
  // Display Bedrock information
  displayBedrockInfo();

  try {
    // Check if Composer is installed
    try {
      execSync('composer --version', { stdio: 'ignore' });
    } catch (error) {
      displayWarning(
        'Composer is not installed or not in PATH. Falling back to manual folder creation.',
      );
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
    displayWarning(
      `Error using Composer: ${error.message}. Falling back to manual folder creation.`,
    );
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
  fs.writeFileSync(
    readmePath,
    `# ${path.basename(projectPath)}\n\nWordPress project created with WordPress Starter using the Bedrock structure.\n\n## Structure\nModern WordPress stack with improved folder structure and security.\n`,
  );

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

  directories.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.hex(catppuccin.green)(`  ✓ Created: ${path.relative(process.cwd(), dir)}`));
  });

  // Create a .env example file
  displayProcessing('Creating configuration files...');
  const envPath = path.join(projectPath, '.env.example');
  fs.writeFileSync(
    envPath,
    `DB_NAME=database_name\nDB_USER=database_user\nDB_PASSWORD=database_password\n\nWP_ENV=development\nWP_HOME=http://example.com\nWP_SITEURL=\${WP_HOME}/wp\n`,
  );
  console.log(chalk.hex(catppuccin.green)('  ✓ Created: .env.example'));

  // Create a basic composer.json file
  const composerPath = path.join(projectPath, 'composer.json');
  const composerContent = JSON.stringify(
    {
      name: `my/${path.basename(projectPath)}`,
      type: 'project',
      description: 'WordPress project with Bedrock structure',
      require: {
        php: '>=7.4',
        'composer/installers': '^2.0',
        'roots/wordpress': '^6.0',
      },
      config: {
        'allow-plugins': {
          'composer/installers': true,
        },
      },
    },
    null,
    2,
  );

  fs.writeFileSync(composerPath, composerContent);
  console.log(chalk.hex(catppuccin.green)('  ✓ Created: composer.json'));

  displayWarning(
    "Composer wasn't used. You'll need to manually run composer install to complete the setup.",
  );

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
      message:
        chalk.hex(catppuccin.sapphire)('🔧 ') +
        chalk
          .hex(catppuccin.sapphire)
          .bold('Would you like to set up the .env file with database credentials?'),
      default: true,
    },
  ]);

  if (!setupEnvPrompt.setupEnv) {
    displayInfo('Skipping .env setup. You can manually configure it later.');
    // Ask about Blade icons before completing
    await setupBladeIcons(projectPath);
    return;
  }

  displayProcessing('Setting up .env file...');

  // Check if .env.example exists
  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');

  if (!fs.existsSync(envExamplePath)) {
    displayWarning('.env.example file not found. Skipping .env setup.');
    // Ask about Blade icons before completing
    await setupBladeIcons(projectPath);
    return;
  }

  // Get database credentials from user
  console.log(chalk.hex(catppuccin.sapphire).bold('\n🛢️  Database Configuration:\n'));

  const dbCredentials = await inquirer.prompt([
    {
      type: 'input',
      name: 'dbName',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database name:',
      default: 'wordpress',
    },
    {
      type: 'input',
      name: 'dbUser',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database user:',
      default: 'root',
    },
    {
      type: 'input',
      name: 'dbPassword',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database password:',
      default: '',
    },
    {
      type: 'input',
      name: 'dbHost',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Database host:',
      default: 'localhost',
    },
  ]);

  // Get site URL settings
  console.log(chalk.hex(catppuccin.sapphire).bold('\n🌐 Site Configuration:\n'));

  const urlSettings = await inquirer.prompt([
    {
      type: 'input',
      name: 'wpHome',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Site URL (WP_HOME):',
      default: 'http://localhost:8000',
    },
    {
      type: 'list',
      name: 'wpEnv',
      message: chalk.hex(catppuccin.sapphire)('    ') + 'Environment:',
      choices: [
        { name: '🛠️  Development', value: 'development' },
        { name: '🔍 Staging', value: 'staging' },
        { name: '🚀 Production', value: 'production' },
      ],
      default: 'development',
    },
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
    envContent = envContent.replace(
      /DB_PASSWORD=.*(\n|$)/g,
      `DB_PASSWORD=${dbCredentials.dbPassword}\nDB_HOST=${dbCredentials.dbHost}`,
    );
  } else {
    envContent = envContent.replace(/DB_HOST=.*/g, `DB_HOST=${dbCredentials.dbHost}`);
  }

  // Update environment and URL settings
  envContent = envContent
    .replace(/WP_ENV=.*/g, `WP_ENV=${urlSettings.wpEnv}`)
    .replace(/WP_HOME=.*/g, `WP_HOME=${urlSettings.wpHome}`);

  // Ensure WP_SITEURL is set correctly
  if (!envContent.includes('WP_SITEURL=')) {
    envContent = envContent.replace(
      /WP_HOME=.*(\n|$)/g,
      `WP_HOME=${urlSettings.wpHome}\nWP_SITEURL=\${WP_HOME}/wp`,
    );
  }

  // Write the .env file
  fs.writeFileSync(envPath, envContent);

  // Display configuration summary
  console.log('\n');
  console.log(chalk.hex(catppuccin.mauve).bold('🛢️  Database Configuration:'));
  console.log(
    chalk.hex(catppuccin.text)('    Database name: ') +
      chalk.hex(catppuccin.green)(dbCredentials.dbName),
  );
  console.log(
    chalk.hex(catppuccin.text)('    Database user: ') +
      chalk.hex(catppuccin.green)(dbCredentials.dbUser),
  );
  console.log(
    chalk.hex(catppuccin.text)('    Database password: ') +
      chalk.hex(catppuccin.green)(dbCredentials.dbPassword || '[empty]'),
  );
  console.log(
    chalk.hex(catppuccin.text)('    Database host: ') +
      chalk.hex(catppuccin.green)(dbCredentials.dbHost),
  );

  console.log('\n');
  console.log(chalk.hex(catppuccin.sapphire).bold('🌐 Site Configuration:'));
  console.log(
    chalk.hex(catppuccin.text)('    Site URL (WP_HOME): ') +
      chalk.hex(catppuccin.green)(urlSettings.wpHome),
  );
  console.log(
    chalk.hex(catppuccin.text)('    Environment: ') +
      chalk.hex(catppuccin.green)(
        '🛠️ ' + urlSettings.wpEnv.charAt(0).toUpperCase() + urlSettings.wpEnv.slice(1),
      ),
  );

  console.log('\n');
  console.log(chalk.hex(catppuccin.green).bold('✅ .env file has been configured!'));

  // Ask about Blade icons before completing
  await setupBladeIcons(projectPath);
}

/**
 * Ask the user if they want to add Blade icons and which ones
 * @param {string} projectPath - Path to the project directory
 */
async function setupBladeIcons(projectPath) {
  createSectionHeader('Icons Setup');

  // Get the original current directory to return to it later
  const originalDir = process.cwd();

  try {
    // Ask if they want to add Blade icons
    const addIconsPrompt = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addIcons',
        message:
          chalk.hex(catppuccin.sapphire)('🎨 ') +
          chalk.hex(catppuccin.sapphire).bold('Would you like to add Blade icons to your project?'),
        default: true,
      },
    ]);

    if (!addIconsPrompt.addIcons) {
      displayInfo('Skipping icon packages installation.');
      // Call Alpine.js setup before completing
      await setupAlpineJs(projectPath);
      return;
    }

    // Ask which icon package(s) to install
    const iconPackagePrompt = await inquirer.prompt([
      {
        type: 'list',
        name: 'iconPackage',
        message:
          chalk.hex(catppuccin.sapphire)('📦 ') +
          chalk.hex(catppuccin.sapphire).bold('Select an icon package to install:'),
        choices: [
          { name: '🔷 Lucide Icons', value: 'lucide' },
          { name: '🔶 Heroicons', value: 'heroicons' },
          { name: '💠 Fontawesome', value: 'fontawesome' },
          { name: '🔘 Boxicons', value: 'boxicons' },
          { name: '⚪ None/Skip', value: 'none' },
        ],
        default: 'lucide',
      },
    ]);

    if (iconPackagePrompt.iconPackage === 'none') {
      displayInfo('Skipping icon package installation.');
      // Call Alpine.js setup before completing
      await setupAlpineJs(projectPath);
      return;
    }

    // Change to the project directory to run composer
    process.chdir(projectPath);

    // Install the selected package
    displayProcessing(
      `Installing ${getIconPackageName(iconPackagePrompt.iconPackage)} icon package...`,
    );

    try {
      // Execute composer require for the package
      const command = getComposerCommand(iconPackagePrompt.iconPackage);
      execSync(command, { stdio: 'inherit' });

      console.log('\n');
      console.log(
        chalk
          .hex(catppuccin.green)
          .bold(
            `✅ ${getIconPackageName(iconPackagePrompt.iconPackage)} icons have been installed!`,
          ),
      );
    } catch (error) {
      displayWarning(`Error installing icon package: ${error.message}`);
    }

    // Call Alpine.js setup before completing
    await setupAlpineJs(projectPath);
  } finally {
    // Change back to the original directory
    process.chdir(originalDir);
  }
}

/**
 * Ask the user if they want to add Alpine.js to their project
 * @param {string} projectPath - Path to the project directory
 */
async function setupAlpineJs(projectPath) {
  createSectionHeader('Alpine.js Setup');

  // Get the original current directory to return to it later
  const originalDir = process.cwd();

  try {
    // Ask if they want to add Alpine.js
    const addAlpinePrompt = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addAlpine',
        message:
          chalk.hex(catppuccin.mauve)('🏔️ ') +
          chalk.hex(catppuccin.mauve).bold('Would you like to add Alpine.js to your project?'),
        default: true,
      },
    ]);

    if (!addAlpinePrompt.addAlpine) {
      displayInfo('Skipping Alpine.js installation.');
      displayProjectCompletion(projectPath);
      return;
    }

    // Change to the project directory to run npm
    process.chdir(projectPath);

    // Check if package.json exists, if not, create it
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      displayProcessing('Initializing npm project...');
      execSync('npm init -y', { stdio: 'inherit' });
    }

    // Install Alpine.js
    displayProcessing('Installing Alpine.js...');

    try {
      execSync('npm install alpinejs --save', { stdio: 'inherit' });

      // Check if there's a theme directory
      const themesPath = path.join(projectPath, 'web', 'app', 'themes');
      if (fs.existsSync(themesPath)) {
        // Get a list of theme directories (excluding hidden files)
        const themeDirectories = fs
          .readdirSync(themesPath)
          .filter(
            (item) =>
              !item.startsWith('.') && fs.statSync(path.join(themesPath, item)).isDirectory(),
          );

        if (themeDirectories.length > 0) {
          // Use the first theme found
          const themeName = themeDirectories[0];
          const themeJsDir = path.join(themesPath, themeName, 'resources', 'js');

          // Create js directory if it doesn't exist
          if (!fs.existsSync(themeJsDir)) {
            fs.mkdirSync(themeJsDir, { recursive: true });
          }

          // Create or update app.js with Alpine.js import
          const appJsPath = path.join(themeJsDir, 'app.js');
          let appJsContent = '';

          if (fs.existsSync(appJsPath)) {
            // Read existing content
            appJsContent = fs.readFileSync(appJsPath, 'utf8');

            // Add Alpine.js import if it doesn't exist
            if (!appJsContent.includes('alpinejs')) {
              appJsContent = `import Alpine from 'alpinejs';\nwindow.Alpine = Alpine;\nAlpine.start();\n\n${appJsContent}`;
            }
          } else {
            // Create new app.js with Alpine.js initialization
            appJsContent = `// Import Alpine.js
import Alpine from 'alpinejs';

// Make Alpine available globally
window.Alpine = Alpine;

// Initialize Alpine
Alpine.start();
`;
          }

          // Write the updated content
          fs.writeFileSync(appJsPath, appJsContent);

          console.log('\n');
          console.log(
            chalk
              .hex(catppuccin.green)
              .bold(`✅ Alpine.js has been installed and initialized in ${themeName} theme!`),
          );
        } else {
          // No theme found, just notify about installation
          console.log('\n');
          console.log(chalk.hex(catppuccin.green).bold('✅ Alpine.js has been installed!'));
          console.log(
            chalk
              .hex(catppuccin.yellow)
              .bold(
                '⚠️ No theme directory found. You will need to initialize Alpine.js manually in your JavaScript files.',
              ),
          );
        }
      } else {
        // No themes directory, just notify about installation
        console.log('\n');
        console.log(chalk.hex(catppuccin.green).bold('✅ Alpine.js has been installed!'));
        console.log(
          chalk
            .hex(catppuccin.yellow)
            .bold(
              '⚠️ No theme directory found. You will need to initialize Alpine.js manually in your JavaScript files.',
            ),
        );
      }
    } catch (error) {
      displayWarning(`Error installing Alpine.js: ${error.message}`);
    }

    // Display project completion
    displayProjectCompletion(projectPath);
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
function getIconPackageName(packageKey) {
  const packageNames = {
    lucide: 'Lucide',
    heroicons: 'Heroicons',
    fontawesome: 'Font Awesome',
    boxicons: 'Boxicons',
  };

  return packageNames[packageKey] || packageKey;
}

/**
 * Get the composer command for the selected icon package
 * @param {string} packageKey - The icon package key
 * @returns {string} The composer command
 */
function getComposerCommand(packageKey) {
  const commands = {
    lucide: 'composer require mallardduck/blade-lucide-icons',
    heroicons: 'composer require blade-ui-kit/blade-heroicons',
    fontawesome: 'composer require owenvoke/blade-fontawesome',
    boxicons: 'composer require andreiio/blade-boxicons',
  };

  return commands[packageKey] || '';
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
      float: 'left',
    }),
  );

  console.log('\n');
}

module.exports = {
  createBedrockStructure,
  setupAlpineJs,
  setupBladeIcons,
};
