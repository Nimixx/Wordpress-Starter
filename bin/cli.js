#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const inquirer = require('inquirer');
const { initializeProject } = require('../src/index');

// Function to display the header
function displayHeader() {
  // Display a colorful header using figlet
  console.log(
    chalk.cyan(
      figlet.textSync('WordPress Starter', { 
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
  );

  // Display a description box
  console.log(
    boxen(
      chalk.white.bold('A modern WordPress project scaffolding tool\n') +
      chalk.white('Easily setup WordPress projects with custom configurations'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
      }
    )
  );
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
      console.log(chalk.bold('Options:'));
      console.log(`  ${chalk.cyan('-V, --version')}                output the version number`);
      console.log(`  ${chalk.cyan('-n, --name <project-name>')}    Name of the WordPress project to create`);
      console.log(`  ${chalk.cyan('-s, --structure <structure>')}  Folder structure type (classic or bedrock)`);
      console.log(`  ${chalk.cyan('-h, --help')}                   display help for command\n`);
      return;
    }

    // Prepare the project config
    const projectConfig = {
      structure: options.structure
    };

    // If project name was provided via command line, use it
    if (options.name) {
      projectConfig.name = options.name;
      console.log(chalk.green(`\n🚀 Creating a new WordPress project: ${chalk.bold(options.name)}...\n`));
      initializeProject(projectConfig);
    } else {
      // Otherwise, prompt the user for project details
      try {
        console.log(); // Add a space before questions

        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is the name of your WordPress project?',
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
            message: '\nWhich folder structure would you like to use?',
            choices: [
              { name: '1. Classic WordPress structure', value: 'classic' },
              { name: '2. Bedrock structure (modern WordPress stack)', value: 'bedrock' }
            ],
            default: 'classic'
          }
        ]);
        
        projectConfig.name = answers.projectName;
        projectConfig.structure = answers.structure;
        
        console.log(chalk.green(`\n🚀 Creating a new WordPress project: ${chalk.bold(answers.projectName)} with ${chalk.bold(answers.structure)} structure...\n`));
        initializeProject(projectConfig);
      } catch (error) {
        console.error(chalk.red('Error during project setup:'), error);
      }
    }
  });

// Parse arguments
program.parse(process.argv);