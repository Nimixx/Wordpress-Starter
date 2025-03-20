/**
 * Theme configuration for the WordPress Starter CLI
 * This file contains color schemes and UI configuration
 */

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

// Structure description data
const structureDescriptions = {
  classic: {
    title: 'Classic WordPress Structure',
    description: [
      '• Traditional WordPress setup with wp-content directory',
      '• Straightforward deployment process',
      '• Familiar structure for WordPress developers',
      '• Easy integration with standard WordPress themes and plugins',
      '• Suitable for simple WordPress sites',
    ],
    color: catppuccin.blue,
  },
  bedrock: {
    title: 'Bedrock WordPress Structure',
    description: [
      '• Modern WordPress stack with improved security and dependency management',
      '• Uses Composer for managing WordPress core and plugins',
      '• Improved directory structure separating web roots from project',
      '• Better environment-specific configuration',
      '• Recommended for larger or team-based WordPress projects',
    ],
    color: catppuccin.mauve,
  },
};

// Box style configuration for UI elements
const boxStyles = {
  default: {
    padding: 2,
    margin: 0,
    borderStyle: 'round',
    borderColor: catppuccin.mauve,
    float: 'left',
  },
  welcome: {
    padding: 1,
    margin: { top: 0, bottom: 1, left: 0, right: 0 },
    borderStyle: 'round',
    borderColor: [
      catppuccin.green,
      catppuccin.teal,
      catppuccin.sapphire,
      catppuccin.blue,
      catppuccin.lavender,
      catppuccin.mauve,
    ],
    float: 'left',
    backgroundColor: catppuccin.background,
  },
  help: {
    padding: 2,
    margin: 0,
    borderStyle: 'round',
    borderColor: catppuccin.lavender,
    float: 'left',
  },
  nextSteps: {
    padding: { top: 1, right: 2, bottom: 1, left: 2 },
    margin: { top: 1, bottom: 1 },
    borderStyle: 'round',
    borderColor: catppuccin.yellow,
    width: 52,
    float: 'left',
  },
};

module.exports = {
  catppuccin,
  structureDescriptions,
  boxStyles,
};
