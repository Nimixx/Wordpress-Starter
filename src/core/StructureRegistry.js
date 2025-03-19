/**
 * Registry for WordPress structure generators
 */

class StructureRegistry {
  constructor() {
    this.structures = new Map();
    this.defaultStructure = null;
  }

  /**
   * Register a new structure
   * @param {string} name - The name of the structure
   * @param {Structure} StructureClass - The structure class
   * @param {object} options - Registration options
   * @param {boolean} options.isDefault - Whether this structure should be the default
   * @returns {boolean} - Whether registration was successful
   */
  register(name, StructureClass, { isDefault = false } = {}) {
    // eslint-disable-next-line no-param-reassign
    this.structures.set(name, StructureClass);

    if (isDefault || !this.defaultStructure) {
      // eslint-disable-next-line no-param-reassign
      this.defaultStructure = name;
    }
  }

  /**
   * Check if a structure with the given name exists
   * @param {string} name - Structure name
   * @returns {boolean}
   */
  has(name) {
    return this.structures.has(name);
  }

  /**
   * Get a structure generator class by name
   * @param {string} name - Structure name
   * @returns {Class|undefined}
   */
  get(name) {
    return this.structures.get(name);
  }

  /**
   * Get the default structure name
   * @returns {string}
   */
  getDefaultName() {
    return this.defaultStructure;
  }

  /**
   * Get all registered structure names
   * @returns {Array<string>}
   */
  getNames() {
    return Array.from(this.structures.keys());
  }

  /**
   * Create a structure generator instance
   * @param {string} name - Structure name
   * @param {string} projectPath - Project path
   * @returns {Object} Structure generator instance
   */
  create(name, projectPath) {
    let structureName = name;

    if (!this.has(structureName)) {
      const defaultName = this.getDefaultName();
      console.warn(`Structure "${structureName}" not found, using "${defaultName}" instead.`);
      structureName = defaultName;
    }

    const StructureClass = this.get(structureName);
    return new StructureClass(projectPath);
  }
}

// Create and export the global registry instance
const structureRegistry = new StructureRegistry();

module.exports = structureRegistry;
