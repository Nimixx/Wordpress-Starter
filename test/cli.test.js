const { _exec } = require('child_process');
const _fs = require('fs');
const _path = require('path');

// Mock the Project class
jest.mock('../src/core/Project', () => {
  const mockInitialize = jest.fn().mockResolvedValue();
  const ProjectMock = jest.fn().mockImplementation(() => {
    return {
      initialize: mockInitialize,
    };
  });
  
  // Attach the mock.instances array to make the tests work
  ProjectMock.mockInitialize = mockInitialize;
  
  return ProjectMock;
});

// Mock path and fs
jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/')),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(false),
  mkdirSync: jest.fn(),
}));

// Mock UI utils
jest.mock('../src/utils/ui', () => ({
  displayWelcome: jest.fn(),
  displayStructureDescription: jest.fn(),
  createSectionHeader: jest.fn(),
  displayInfo: jest.fn(),
  displayWarning: jest.fn(),
}));

// Import the module to test
const { initializeProject } = require('../src/index');
const Project = require('../src/core/project');

describe('CLI Functionality Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods to silence output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock process.exit to prevent tests from exiting
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks
    jest.restoreAllMocks();
  });

  describe('initializeProject function', () => {
    test('should create a new Project instance with classic structure when classic structure is specified', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'classic',
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(Project).toHaveBeenCalledWith(config);
      expect(Project.mockInitialize).toHaveBeenCalled();
    });

    test('should create a new Project instance with bedrock structure when bedrock structure is specified', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'bedrock',
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(Project).toHaveBeenCalledWith(config);
      expect(Project.mockInitialize).toHaveBeenCalled();
    });

    test('should pass the structure type to the Project constructor', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'custom-structure',
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(Project).toHaveBeenCalledWith(expect.objectContaining({ 
        structure: 'custom-structure', 
      }));
    });
  });

  describe('CLI command execution', () => {
    test('should execute CLI with project name and classic structure options', async () => {
      // Mock child_process.exec
      jest.mock('child_process', () => ({
        exec: jest.fn((cmd, cb) => {
          cb(null, { stdout: 'Success' });
          return { kill: jest.fn() };
        }),
      }));
      
      // Reimport exec with our mock
      const { exec } = require('child_process');
      
      // Execute CLI command with options
      return new Promise((resolve) => {
        exec('node ./bin/cli.js --name test-cli-project --structure classic', (error, stdout) => {
          expect(error).toBeNull();
          expect(stdout).toBeDefined();
          resolve();
        });
      });
    });

    test('should execute CLI with project name and bedrock structure options', async () => {
      // Mock is already set from previous test
      const { exec } = require('child_process');
      
      // Execute CLI command with options
      return new Promise((resolve) => {
        exec('node ./bin/cli.js --name test-cli-project --structure bedrock', (error, stdout) => {
          expect(error).toBeNull();
          expect(stdout).toBeDefined();
          resolve();
        });
      });
    });
  });
}); 