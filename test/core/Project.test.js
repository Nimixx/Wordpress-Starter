/**
 * Tests for the Project class
 */

const path = require('path');

// Mock dependencies before requiring Project
const mockGetDefaultName = jest.fn().mockReturnValue('classic');
const mockCreate = jest.fn().mockReturnValue({
  generate: jest.fn().mockResolvedValue()
});
const mockDisplayWelcome = jest.fn();
const mockDisplayWarning = jest.fn();
const mockExistsSync = jest.fn().mockReturnValue(false);
const mockMkdirSync = jest.fn();

// Mock UI utils
jest.mock('../../src/utils/ui', () => ({
  displayWelcome: mockDisplayWelcome,
  createSectionHeader: jest.fn(),
  displayInfo: jest.fn(),
  displayWarning: mockDisplayWarning
}));

// Mock structure registry
jest.mock('../../src/structures', () => ({
  getDefaultName: mockGetDefaultName,
  create: mockCreate,
  register: jest.fn()
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
  basename: jest.fn().mockReturnValue('test-project')
}));

// Mock fs module
jest.mock('fs', () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync
}));

// Mock process.exit
const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
  // When process.exit is called, throw a custom error to halt execution
  throw new Error('PROCESS_EXIT');
});

// Now require the Project class
const Project = require('../../src/core/project');

describe('Project', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset the return value for fs.existsSync
    mockExistsSync.mockReturnValue(false);
    
    // Clear create mock calls
    mockCreate.mockClear();
  });
  
  test('should initialize with default structure type if not specified', () => {
    const project = new Project({ name: 'test-project' });
    
    expect(project.name).toBe('test-project');
    expect(project.structureType).toBe('classic');
    expect(mockGetDefaultName).toHaveBeenCalled();
  });
  
  test('should use specified structure type if provided', () => {
    const project = new Project({ name: 'test-project', structure: 'bedrock' });
    
    expect(project.name).toBe('test-project');
    expect(project.structureType).toBe('bedrock');
  });
  
  test('should create project directory and structure', async () => {
    const project = new Project({ name: 'test-project', structure: 'classic' });
    
    await project.initialize();
    
    // Should have called displayWelcome
    expect(mockDisplayWelcome).toHaveBeenCalled();
    
    // Should have created the directory
    expect(mockMkdirSync).toHaveBeenCalled();
    
    // Should have created the structure
    expect(mockCreate).toHaveBeenCalledWith('classic', expect.any(String));
  });
  
  test('should exit if project directory already exists', async () => {
    // Mock fs.existsSync to return true (directory exists)
    mockExistsSync.mockReturnValue(true);
    
    const project = new Project({ name: 'existing-project' });
    
    // Since we're expecting process.exit to be called, which we mock to throw an error,
    // we need to catch that error
    try {
      await project.initialize();
      // If we get here, the test fails
      fail('Expected process.exit to be called');
    } catch (error) {
      if (error.message !== 'PROCESS_EXIT') {
        throw error; // Re-throw if it's not our mock exit
      }
      
      // Should have displayed warning
      expect(mockDisplayWarning).toHaveBeenCalledWith(
        expect.stringContaining('already exists')
      );
      
      // Should have exited
      expect(processExitSpy).toHaveBeenCalledWith(1);
      
      // Should not have created structure
      expect(mockCreate).not.toHaveBeenCalled();
    }
  });
  
  test('should handle errors during initialization', async () => {
    // Mock fs.mkdirSync to throw an error
    mockMkdirSync.mockImplementation(() => {
      throw new Error('mkdir failed');
    });
    
    const project = new Project({ name: 'test-project' });
    
    // Since we're expecting process.exit to be called, which we mock to throw an error,
    // we need to catch that error
    try {
      await project.initialize();
      // If we get here, the test fails
      fail('Expected process.exit to be called');
    } catch (error) {
      if (error.message !== 'PROCESS_EXIT') {
        throw error; // Re-throw if it's not our mock exit
      }
      
      // Should have displayed warning
      expect(mockDisplayWarning).toHaveBeenCalledWith(
        expect.stringContaining('Error creating project')
      );
      
      // Should have exited
      expect(processExitSpy).toHaveBeenCalledWith(1);
    }
  });
}); 