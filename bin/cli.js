#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const inquirer = require('inquirer');
const { initializeProject } = require('../src/index');
const { displayWelcome } = require('../src/scaffolders/common');

// Function to display the header
function displayHeader() {
  console.log('\n');
  console.log(
    chalk.cyan(
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
      chalk.white.bold('A modern WordPress project scaffolding tool\n\n') +
      chalk.white('Easily setup WordPress projects with custom configurations') + 
      chalk.cyan('\n\nVersion: 0.1.0'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#222',
        float: 'center'
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
      console.log(chalk.bold('\nA tool for scaffolding WordPress projects\n'));
      
      const helpBox = boxen(
        chalk.bold.white('USAGE\n\n') +
        chalk.white('  npx create-wordpress-starter [options]\n\n') +
        chalk.bold.white('OPTIONS\n\n') +
        chalk.cyan('  -V, --version                ') + chalk.white('output the version number\n') +
        chalk.cyan('  -n, --name <project-name>    ') + chalk.white('Name of the WordPress project to create\n') +
        chalk.cyan('  -s, --structure <structure>  ') + chalk.white('Folder structure type (classic or bedrock)\n') +
        chalk.cyan('  -h, --help                   ') + chalk.white('display help for command'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'white',
          float: 'center'
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
      console.log(chalk.green.bold(`\n🚀 Creating a new WordPress project: ${chalk.bold(options.name)}...\n`));
      await initializeProject(projectConfig);
    } else {
      // Otherwise, prompt the user for project details
      try {
        console.log(); // Add a space before questions

        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: chalk.cyan('📂 ') + chalk.cyan.bold('What is the name of your WordPress project?'),
            validate: (input) => {
              if (input.trim().length === 0) {
                return 'Project name cannot be empty';
              }
              return true;
            }
          },
          {
            type: 'list',
            name: 'structure',
            message: chalk.cyan('🏗️  ') + chalk.cyan.bold('Which folder structure would you like to use?'),
            choices: [
              { 
                name: chalk.blue.bold('1. Classic WordPress') + chalk.white(' - Traditional WordPress setup'),
                value: 'classic' 
              },
              { 
                name: chalk.magenta.bold('2. Bedrock') + chalk.white(' - Modern WordPress stack with improved security'),
                value: 'bedrock' 
              }
            ],
            default: 'classic'
          }
        ]);
        
        projectConfig.name = answers.projectName;
        projectConfig.structure = answers.structure;
        
        console.log(chalk.green.bold(`\n🚀 Creating a new WordPress project: ${chalk.bold(answers.projectName)} with ${chalk.bold(answers.structure)} structure...\n`));
        await initializeProject(projectConfig);
      } catch (error) {
        console.error(chalk.red(`\n❌ Error during project setup: ${error.message}\n`));
      }
    }
  });

// Parse arguments
program.parse(process.argv);