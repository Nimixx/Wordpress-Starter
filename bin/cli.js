#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const inquirer = require('inquirer');
const { initializeProject } = require('../src/index');
const { _displayWelcome } = require('../src/utils/ui');
const { catppuccin, structureDescriptions, boxStyles } = require('../src/config/theme');
const structureRegistry = require('../src/structures');

/**
 * Display the header
 */
function displayHeader() {
  console.log('\n');

  // Generate the figlet text
  const figletText = figlet.textSync('WordPress Starter', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default',
  });

  // Split the figlet text into lines
  const lines = figletText.split('\n');

  // Create a gradient effect using catppuccin colors
  const gradientColors = [
    catppuccin.mauve,
    catppuccin.pink,
    catppuccin.sapphire,
    catppuccin.lavender,
    catppuccin.blue,
    catppuccin.sky,
  ];

  // Apply gradient to each line
  lines.forEach((line, index) => {
    // Calculate color for this line
    const colorIndex = index % gradientColors.length;
    console.log(chalk.hex(gradientColors[colorIndex])(line));
  });

  console.log('\n');

  // Display a description box
  console.log(
    boxen(
      chalk.hex(catppuccin.text).bold('A modern WordPress project scaffolding tool\n\n') +
        chalk.hex(catppuccin.text)('Easily setup WordPress projects with custom configurations') +
        chalk.hex(catppuccin.lavender)('\n\nVersion: 0.1.0'),
      boxStyles.default,
    ),
  );

  console.log('\n');
}

/**
 * Display a structure description box
 * @param {string} structure - The structure type ('classic' or 'bedrock')
 */
function displayStructureDescription(structure) {
  const structureInfo = structureDescriptions[structure];

  console.log(
    boxen(
      chalk.hex(structureInfo.color).bold(`${structureInfo.title}\n\n`) +
        chalk.hex(catppuccin.text)(structureInfo.description.join('\n')),
      {
        padding: 2,
        margin: 0,
        borderStyle: 'round',
        borderColor: structureInfo.color,
        width: 70,
        float: 'left',
      },
    ),
  );

  console.log('\n');
}

// Set up CLI commands with optional project name
program
  .version('0.1.0')
  .description('A tool for scaffolding WordPress projects')
  .option('-n, --name <project-name>', 'Name of the WordPress project to create')
  .option(
    '-s, --structure <structure-type>',
    'Folder structure: classic or bedrock',
    structureRegistry.getDefaultName(),
  )
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
          chalk.hex(catppuccin.blue)('  -V, --version                ') +
          chalk.hex(catppuccin.text)('output the version number\n') +
          chalk.hex(catppuccin.blue)('  -n, --name <project-name>    ') +
          chalk.hex(catppuccin.text)('Name of the WordPress project to create\n') +
          chalk.hex(catppuccin.blue)('  -s, --structure <structure>  ') +
          chalk.hex(catppuccin.text)(
            `Folder structure type (${structureRegistry.getNames().join(' or ')})\n`,
          ) +
          chalk.hex(catppuccin.blue)('  -h, --help                   ') +
          chalk.hex(catppuccin.text)('display help for command'),
        boxStyles.help,
      );

      console.log(helpBox);
      console.log('\n');
      return;
    }

    // Prepare the project config
    const projectConfig = {
      structure: options.structure,
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
          message:
            chalk.hex(catppuccin.yellow)('🔍 ') +
            chalk
              .hex(catppuccin.yellow)
              .bold(
                `Confirm creating project "${options.name}" with ${options.structure} structure?`,
              ),
          default: true,
        },
      ]);

      if (confirmPrompt.proceed) {
        console.log(
          chalk
            .hex(catppuccin.green)
            .bold(
              `\n🚀 Creating a new WordPress project: ${chalk.hex(catppuccin.text).bold(options.name)}...\n`,
            ),
        );
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
            message:
              chalk.hex(catppuccin.sapphire)('📂 ') +
              chalk.hex(catppuccin.sapphire).bold('What is the name of your WordPress project?'),
            validate: (input) => {
              if (input.trim().length === 0) {
                return 'Project name cannot be empty';
              }
              return true;
            },
          },
        ]);

        projectName = nameAnswer.projectName;

        while (!shouldContinue) {
          console.log(); // Add a space before questions

          // Now ask for structure
          const structureAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'structure',
              message:
                chalk.hex(catppuccin.sapphire)('🏗️  ') +
                chalk
                  .hex(catppuccin.sapphire)
                  .bold('Which folder structure would you like to use?'),
              choices: [
                {
                  name:
                    chalk.hex(catppuccin.blue).bold('1. Classic WordPress') +
                    chalk.hex(catppuccin.text)(' - Traditional WordPress setup'),
                  value: 'classic',
                },
                {
                  name:
                    chalk.hex(catppuccin.mauve).bold('2. Bedrock') +
                    chalk.hex(catppuccin.text)(' - Modern WordPress stack with improved security'),
                  value: 'bedrock',
                },
              ],
              default: structureRegistry.getDefaultName(),
            },
          ]);

          // Display selected structure description
          displayStructureDescription(structureAnswer.structure);

          // Add confirmation prompt
          const confirmPrompt = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'proceed',
              message:
                chalk.hex(catppuccin.yellow)('🔍 ') +
                chalk
                  .hex(catppuccin.yellow)
                  .bold(
                    `Confirm creating project "${projectName}" with ${structureAnswer.structure} structure?`,
                  ),
              default: true,
            },
          ]);

          if (confirmPrompt.proceed) {
            projectConfig.name = projectName;
            projectConfig.structure = structureAnswer.structure;
            shouldContinue = true;

            console.log(
              chalk
                .hex(catppuccin.green)
                .bold(
                  `\n🚀 Creating a new WordPress project: ${chalk.hex(catppuccin.text).bold(projectName)} with ${chalk.hex(catppuccin.text).bold(structureAnswer.structure)} structure...\n`,
                ),
            );
            await initializeProject(projectConfig);
          } else {
            console.log(
              chalk.hex(catppuccin.yellow)(`\n⏪ Going back to folder structure selection...\n`),
            );
            // Loop continues if not confirmed but keeps same project name
          }
        }
      } catch (error) {
        console.error(
          chalk.hex(catppuccin.red)(`\n❌ Error during project setup: ${error.message}\n`),
        );
      }
    }
  });

// Parse arguments
program.parse(process.argv);
