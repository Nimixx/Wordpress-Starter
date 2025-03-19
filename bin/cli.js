#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const inquirer = require('inquirer');
const { initializeProject } = require('../src/index');
const { displayWelcome } = require('../src/scaffolders/common');

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

// Description data for WordPress structures
const structureDescriptions = {
  classic: {
    title: 'Classic WordPress Structure',
    description: [
      '• Traditional WordPress setup with wp-content directory',
      '• Straightforward deployment process',
      '• Familiar structure for WordPress developers',
      '• Easy integration with standard WordPress themes and plugins',
      '• Suitable for simple WordPress sites'
    ],
    color: catppuccin.blue
  },
  bedrock: {
    title: 'Bedrock WordPress Structure',
    description: [
      '• Modern WordPress stack with improved security and dependency management',
      '• Uses Composer for managing WordPress core and plugins',
      '• Improved directory structure separating web roots from project',
      '• Better environment-specific configuration',
      '• Recommended for larger or team-based WordPress projects'
    ],
    color: catppuccin.mauve
  }
};

// Function to display a structure description box
function displayStructureDescription(structure) {
  const structureInfo = structureDescriptions[structure];
  
  console.log(
    boxen(
      chalk.hex(structureInfo.color).bold(`${structureInfo.title}\n\n`) +
      chalk.hex(catppuccin.text)(structureInfo.description.join('\n')),
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: structureInfo.color,
        backgroundColor: catppuccin.background,
        width: 70,
        float: 'left'
      }
    )
  );
  
  console.log('\n');
}

// Function to display the header
function displayHeader() {
  console.log('\n');
  console.log(
    chalk.hex(catppuccin.mauve)(
      figlet.textSync('WordPress Starter', { 
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );
  console.log('\n');

  // Display a description box
  console.log(
    boxen(
      chalk.hex(catppuccin.text).bold('A modern WordPress project scaffolding tool\n\n') +
      chalk.hex(catppuccin.text)('Easily setup WordPress projects with custom configurations') + 
      chalk.hex(catppuccin.lavender)('\n\nVersion: 0.1.0'),
      {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: catppuccin.mauve,
        backgroundColor: catppuccin.background,
        float: 'left'
      }
    )
  );
  
  console.log('\n');
}

// Set up CLI commands with optional project name
program
  .version('0.1.0')
  .description('A tool for scaffolding WordPress projects')
  .option('-n, --name <project-name>', 'Name of the WordPress project to create')
  .option('-s, --structure <structure-type>', 'Folder structure: classic or bedrock', 'classic')
  .option('-h, --help', 'Display help information')
  .allowUnknownOption(false)
  .action(async (options) => {
    displayHeader();
    
    // Check if help option is specified
    if (options.help) {
      // Display custom formatted help
      console.log(chalk.hex(catppuccin.text).bold('\nA tool for scaffolding WordPress projects\n'));
      
      const helpBox = boxen(
        chalk.hex(catppuccin.text).bold('USAGE\n\n') +
        chalk.hex(catppuccin.text)('  npx create-wordpress-starter [options]\n\n') +
        chalk.hex(catppuccin.text).bold('OPTIONS\n\n') +
        chalk.hex(catppuccin.blue)('  -V, --version                ') + chalk.hex(catppuccin.text)('output the version number\n') +
        chalk.hex(catppuccin.blue)('  -n, --name <project-name>    ') + chalk.hex(catppuccin.text)('Name of the WordPress project to create\n') +
        chalk.hex(catppuccin.blue)('  -s, --structure <structure>  ') + chalk.hex(catppuccin.text)('Folder structure type (classic or bedrock)\n') +
        chalk.hex(catppuccin.blue)('  -h, --help                   ') + chalk.hex(catppuccin.text)('display help for command'),
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 0, right: 0 },
          borderStyle: 'round',
          borderColor: catppuccin.lavender,
          backgroundColor: catppuccin.background,
          float: 'left'
        }
      );
      
      console.log(helpBox);
      console.log('\n');
      return;
    }

    // Prepare the project config
    const projectConfig = {
      structure: options.structure
    };

    // If project name was provided via command line, use it
    if (options.name) {
      projectConfig.name = options.name;
      
      // Show selected structure description
      displayStructureDescription(options.structure);
      
      // Add confirmation if command-line options were provided
      const confirmPrompt = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: chalk.hex(catppuccin.yellow)('🔍 ') + 
                   chalk.hex(catppuccin.yellow).bold(`Confirm creating project "${options.name}" with ${options.structure} structure?`),
          default: true
        }
      ]);
      
      if (confirmPrompt.proceed) {
        console.log(chalk.hex(catppuccin.green).bold(`\n🚀 Creating a new WordPress project: ${chalk.hex(catppuccin.text).bold(options.name)}...\n`));
        await initializeProject(projectConfig);
      } else {
        console.log(chalk.hex(catppuccin.yellow)(`\n⏸️  Project creation cancelled.\n`));
      }
    } else {
      // Otherwise, prompt the user for project details
      try {
        // Store project name to avoid asking for it again when going back
        let projectName = '';
        let shouldContinue = false;
        
        // First get the project name
        const nameAnswer = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: chalk.hex(catppuccin.sapphire)('📂 ') + chalk.hex(catppuccin.sapphire).bold('What is the name of your WordPress project?'),
            validate: (input) => {
              if (input.trim().length === 0) {
                return 'Project name cannot be empty';
              }
              return true;
            }
          }
        ]);
        
        projectName = nameAnswer.projectName;
        
        while (!shouldContinue) {
          console.log(); // Add a space before questions

          // Now ask for structure
          const structureAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'structure',
              message: chalk.hex(catppuccin.sapphire)('🏗️  ') + chalk.hex(catppuccin.sapphire).bold('Which folder structure would you like to use?'),
              choices: [
                { 
                  name: chalk.hex(catppuccin.blue).bold('1. Classic WordPress') + chalk.hex(catppuccin.text)(' - Traditional WordPress setup'),
                  value: 'classic' 
                },
                { 
                  name: chalk.hex(catppuccin.mauve).bold('2. Bedrock') + chalk.hex(catppuccin.text)(' - Modern WordPress stack with improved security'),
                  value: 'bedrock' 
                }
              ],
              default: 'classic'
            }
          ]);
          
          // Display selected structure description
          displayStructureDescription(structureAnswer.structure);
          
          // Add confirmation prompt
          const confirmPrompt = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message: chalk.hex(catppuccin.yellow)('🔍 ') + 
                       chalk.hex(catppuccin.yellow).bold(`Confirm creating project "${projectName}" with ${structureAnswer.structure} structure?`),
              default: true
            }
          ]);
          
          if (confirmPrompt.proceed) {
            projectConfig.name = projectName;
            projectConfig.structure = structureAnswer.structure;
            shouldContinue = true;
            
            console.log(chalk.hex(catppuccin.green).bold(`\n🚀 Creating a new WordPress project: ${chalk.hex(catppuccin.text).bold(projectName)} with ${chalk.hex(catppuccin.text).bold(structureAnswer.structure)} structure...\n`));
            await initializeProject(projectConfig);
          } else {
            console.log(chalk.hex(catppuccin.yellow)(`\n⏪ Going back to folder structure selection...\n`));
            // Loop continues if not confirmed but keeps same project name
          }
        }
      } catch (error) {
        console.error(chalk.hex(catppuccin.red)(`\n❌ Error during project setup: ${error.message}\n`));
      }
    }
  });

// Parse arguments
program.parse(process.argv);