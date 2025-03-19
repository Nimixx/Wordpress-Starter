/**
 * Register all WordPress structure generators
 */

const structureRegistry = require('../core/StructureRegistry');
const ClassicStructure = require('./ClassicStructure');

// Import all structure generators here
const BedrockStructure = require('./BedrockStructure');

// Register all structure generators
structureRegistry.register('classic', ClassicStructure, { isDefault: true });
structureRegistry.register('bedrock', BedrockStructure);

// Export the registry
module.exports = structureRegistry; 