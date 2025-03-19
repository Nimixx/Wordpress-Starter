/**
 * Tests for the StructureRegistry
 */

const structureRegistry = require('../../src/core/StructureRegistry');

// Create mock structure classes
class MockClassicStructure {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.type = 'classic';
  }

  generate() {
    return Promise.resolve('classic generated');
  }
}

class MockBedrockStructure {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.type = 'bedrock';
  }

  generate() {
    return Promise.resolve('bedrock generated');
  }
}

describe('StructureRegistry', () => {
  beforeEach(() => {
    // Reset the registry before each test
    structureRegistry.structures = new Map();
    structureRegistry.defaultStructure = null;
  });

  test('should register a structure correctly', () => {
    structureRegistry.register('test', MockClassicStructure);

    expect(structureRegistry.has('test')).toBe(true);
    expect(structureRegistry.get('test')).toBe(MockClassicStructure);
  });

  test('should set the first registered structure as default if not specified', () => {
    structureRegistry.register('test1', MockClassicStructure);
    structureRegistry.register('test2', MockBedrockStructure);

    expect(structureRegistry.getDefaultName()).toBe('test1');
  });

  test('should set the specified structure as default', () => {
    structureRegistry.register('test1', MockClassicStructure);
    structureRegistry.register('test2', MockBedrockStructure, { isDefault: true });

    expect(structureRegistry.getDefaultName()).toBe('test2');
  });

  test('should return all registered structure names', () => {
    structureRegistry.register('classic', MockClassicStructure);
    structureRegistry.register('bedrock', MockBedrockStructure);

    const names = structureRegistry.getNames();

    expect(names).toContain('classic');
    expect(names).toContain('bedrock');
    expect(names).toHaveLength(2);
  });

  test('should create an instance of a registered structure', () => {
    structureRegistry.register('classic', MockClassicStructure);

    const instance = structureRegistry.create('classic', '/test/path');

    expect(instance).toBeInstanceOf(MockClassicStructure);
    expect(instance.projectPath).toBe('/test/path');
  });

  test('should fall back to default structure if requested one is not found', () => {
    // Mock console.warn to prevent logging during test
    const originalWarn = console.warn;
    console.warn = jest.fn();

    structureRegistry.register('classic', MockClassicStructure, { isDefault: true });

    const instance = structureRegistry.create('nonexistent', '/test/path');

    expect(instance).toBeInstanceOf(MockClassicStructure);
    expect(console.warn).toHaveBeenCalled();

    // Restore console.warn
    console.warn = originalWarn;
  });
});
