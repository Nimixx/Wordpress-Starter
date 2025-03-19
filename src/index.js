/**
 * Main entry point for the WordPress Starter CLI
 */

const Project = require('./core/project');

// Import all structures to register them
require('./structures');

/**
 * Initialize a new WordPress project
 * @param {Object} config - Project configuration
 * @param {string} config.name - Name of the project and root folder
 * @param {string} config.structure - Structure type ('classic' or 'bedrock')
 */
async function initializeProject(config) {
  const project = new Project(config);
  await project.initialize();
}

module.exports = {
  initializeProject,
}; 