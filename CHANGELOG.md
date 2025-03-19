# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project structure
- Basic CLI interface with colorful styling
- Project creation with name parameter
- Basic README with usage instructions
- Interactive prompts for project configuration using Inquirer
- Command-line option for project name (`--name`) as an alternative to prompts
- Custom-formatted help display with improved readability
- Folder structure selection (Classic or Bedrock)
- Visual spacing between interactive prompts for better readability
- Numbered options for structure selection
- Implementation of different folder structures based on selection
- Integration with WP-CLI for scaffolding classic WordPress installations
- Automatic fallback to manual folder creation if WP-CLI is unavailable
- Integration with Composer for scaffolding Bedrock-based WordPress installations
- Automatic fallback to manual folder creation if Composer is unavailable

### Changed

- Updated CLI to use interactive prompts instead of requiring command-line arguments
- Updated documentation to reflect new interactive usage
- Improved CLI behavior to display prompts immediately without showing help screen first
- Reorganized code structure for better maintainability
- Enhanced project initialization to set up appropriate folder structure based on selection
- Improved classic WordPress setup to use WP-CLI for downloading the latest WordPress core
- Improved Bedrock setup to use Composer for downloading and installing the latest Bedrock version

## [0.1.0] - 2024-03-19

### Added

- Initial release
- Project scaffolding with named directory creation
- Simple welcome message
- Error handling for existing directories
