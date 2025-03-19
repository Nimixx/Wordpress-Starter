/**
 * Classic WordPress structure generator
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const { catppuccin } = require('../config/theme');
const Structure = require('../core/Structure');
const {
  createSectionHeader,
  displayInfo,
  displayWarning,
  displayProcessing,
} = require('../utils/ui');

class ClassicStructure extends Structure {
  /**
   * Display Classic WordPress information box
   */
  displayClassicInfo() {
    this.displayInfo(
      'Classic WordPress Structure',
      'The Classic WordPress setup provides a traditional WordPress installation with standard folder organization. This structure is familiar to most WordPress developers and offers:\n\n' +
        '• Standard WordPress core files\n' +
        '• Traditional wp-content folder structure\n' +
        '• Standard wp-config.php configuration\n' +
        '• Compatibility with most WordPress plugins and themes\n' +
        '• Familiar environment for WordPress developers',
      catppuccin.blue,
    );
  }

  /**
   * Generate the Classic WordPress structure
   */
  async generate() {
    // Display Classic information
    this.displayClassicInfo();

    try {
      // Check if WP-CLI is installed
      try {
        execSync('wp --info', { stdio: 'ignore' });
        await this.generateWithWpCli();
      } catch (error) {
        displayWarning(
          'WP-CLI is not installed or not in PATH. Falling back to manual folder creation.',
        );
        await this.generateManually();
      }
    } catch (error) {
      displayWarning(`Error during structure generation: ${error.message}`);
      await this.generateManually();
    }
  }

  /**
   * Generate structure using WP-CLI
   */
  async generateWithWpCli() {
    createSectionHeader('WordPress Core Installation');
    displayInfo('Using WP-CLI to download and configure WordPress');

    // Change to the project directory
    process.chdir(this.projectPath);

    // Download WordPress core
    displayProcessing('Downloading WordPress core...');
    execSync('wp core download --force', { stdio: 'inherit' });

    // Create wp-config.php (with placeholder values that can be updated later)
    displayProcessing('Creating a basic wp-config.php file...');
    execSync(
      'wp config create --dbname=wordpress_db --dbuser=root --dbpass=root --dbhost=localhost --skip-check',
      { stdio: 'inherit' },
    );

    // Create a README with classic structure info
    const readmeAdditionalContent =
      '\n\n## Configuration\nUpdate the database configuration in wp-config.php before running the site.\n';
    this.generateReadme('classic', readmeAdditionalContent);

    console.log('\n');
    console.log(
      chalk.hex(catppuccin.green).bold('✅ WordPress core has been downloaded and configured!'),
    );

    // Display database configuration reminder
    console.log('\n');
    console.log(chalk.hex(catppuccin.mauve || '#d0a9e4').bold('🛢️  Database Configuration:'));
    console.log(
      chalk.hex(catppuccin.text || '#CDD6F4')(
        '    Edit wp-config.php to set your database credentials:',
      ),
    );
    console.log(
      chalk.hex(catppuccin.text || '#CDD6F4')('    Database name: ') +
        chalk.hex(catppuccin.green)('wordpress_db (update with your own)'),
    );
    console.log(
      chalk.hex(catppuccin.text || '#CDD6F4')('    Database user: ') +
        chalk.hex(catppuccin.green)('root (update with your own)'),
    );
    console.log(
      chalk.hex(catppuccin.text || '#CDD6F4')('    Database password: ') +
        chalk.hex(catppuccin.green)('root (update with your own)'),
    );
    console.log(
      chalk.hex(catppuccin.text || '#CDD6F4')('    Database host: ') +
        chalk.hex(catppuccin.green)('localhost'),
    );

    // Display project completion message
    this.displayCompletion();
  }

  /**
   * Generate structure manually (fallback method)
   */
  async generateManually() {
    createSectionHeader('Creating Manual WordPress Structure');

    // Create README with classic structure info
    this.generateReadme('classic');

    displayProcessing('Creating directory structure...');

    // Create wp-content folder with subfolders
    fs.mkdirSync(path.join(this.projectPath, 'wp-content'), { recursive: true });

    // Create necessary subdirectories
    const directories = ['wp-content/themes', 'wp-content/plugins', 'wp-content/uploads'];

    directories.forEach((dir) => {
      fs.mkdirSync(path.join(this.projectPath, dir), { recursive: true });
    });

    // Create a placeholder index.php file
    displayProcessing('Creating placeholder files...');
    this.writeProjectFile(
      'index.php',
      `<?php\n// Silence is golden.\n// This is a placeholder for the WordPress installation.\n`,
    );

    console.log('\n');
    console.log(
      chalk
        .hex(catppuccin.yellow || '#FFC66D')
        .bold("⚠️ WP-CLI wasn't used. You'll need to manually download WordPress."),
    );

    // Display project completion message
    this.displayCompletion();
  }
}

module.exports = ClassicStructure;
