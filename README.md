# WordPress Starter

A CLI tool for scaffolding WordPress projects with a nice UI interface.

## Installation

You can use this package directly with npx:

```bash
npx create-wordpress-starter
```

Or install it globally:

```bash
npm install -g create-wordpress-starter
create-wordpress-starter
```

## Usage

To create a new WordPress project, run the command and follow the interactive prompts:

```bash
npx create-wordpress-starter
```

You can also specify the project name and structure directly with command line options:

```bash
# With project name only (defaults to classic structure)
npx create-wordpress-starter --name my-wordpress-site

# With project name and specific structure
npx create-wordpress-starter --name my-wordpress-site --structure bedrock
```

This will create a new directory with your specified name in the current location and set up the WordPress project.

## Available Folder Structures

The CLI supports different folder structures for your WordPress projects:

1. **Classic WordPress Structure**
   - Traditional WordPress installation structure
   - Automatically downloads the latest WordPress core using WP-CLI
   - Creates a basic wp-config.php file with placeholder database values
   - Falls back to creating only the directory structure if WP-CLI is not available

2. **Bedrock Structure**
   - Modern WordPress stack with improved security and organization
   - Uses a more structured approach with separated web and app directories
   - Includes configuration files and environment separation
   - Ready for modern development workflows

## Prerequisites

- **For Classic Structure with WordPress Core**: [WP-CLI](https://wp-cli.org/) should be installed and accessible in your PATH
- **For Bedrock Structure**: [Composer](https://getcomposer.org/) is recommended for dependency management (not installed automatically)

## Features

- Beautiful command-line interface
- Interactive prompts for project configuration
- Multiple folder structure options
- WP-CLI integration for WordPress core downloads
- Simple project initialization
- Visual feedback during project creation
- More features coming soon!

## Development

To run the project locally:

```bash
# Clone the repository
git clone [repository-url]
cd create-wordpress-starter

# Install dependencies
npm install

# Run the CLI
npm start
```

## License

MIT 