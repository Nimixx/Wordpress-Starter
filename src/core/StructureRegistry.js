/**
 * Registry for WordPress structure generators
 */

class StructureRegistry {
  constructor() {
    this.structures = new Map();
    this.defaultStructure = null;
  }

  /**
   * Register a new structure type
   * @param {string} name - Structure name
   * @param {Class} StructureClass - Structure generator class
   * @param {Object} options - Structure options
   * @param {boolean} options.isDefault - Whether this is the default structure
   */
  register(name, StructureClass, { isDefault = false } = {}) {
    this.structures.set(name, StructureClass);
    
    if (isDefault || !this.defaultStructure) {
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
    if (!this.has(name)) {
      const defaultName = this.getDefaultName();
      console.warn(`Structure "${name}" not found, using "${defaultName}" instead.`);
      name = defaultName;
    }

    const StructureClass = this.get(name);
    return new StructureClass(projectPath);
  }
}

// Create and export the global registry instance
const structureRegistry = new StructureRegistry();

module.exports = structureRegistry; 