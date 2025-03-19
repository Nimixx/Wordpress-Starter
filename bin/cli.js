#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const { initializeProject } = require('../src/index');

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

// Set up CLI commands
program
  .version('0.1.0')
  .description('A tool for scaffolding WordPress projects')
  .argument('<project-name>', 'Name of the WordPress project to create')
  .action((projectName) => {
    console.log(chalk.green(`\n🚀 Creating a new WordPress project: ${chalk.bold(projectName)}...\n`));
    initializeProject(projectName);
  });

// Parse arguments
program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 