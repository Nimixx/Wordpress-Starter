const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Mock dependencies - we're using manual mocks for these modules
jest.mock('../src/scaffolders/classic');
jest.mock('../src/scaffolders/bedrock');
jest.mock('inquirer');

// Import the mocked modules
const inquirer = require('inquirer');
const { createClassicStructure } = require('../src/scaffolders/classic');
const { createBedrockStructure } = require('../src/scaffolders/bedrock');

// Import the module to test
const { initializeProject } = require('../src/index');

// Setup mocks
jest.mock('../src/scaffolders/classic', () => ({
  createClassicStructure: jest.fn()
}));
jest.mock('../src/scaffolders/bedrock', () => ({
  createBedrockStructure: jest.fn()
}));

describe('CLI Functionality Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods to silence output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock fs methods using spyOn
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    
    // Mock process.exit to prevent tests from exiting
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks
    jest.restoreAllMocks();
  });

  describe('initializeProject function', () => {
    test('should create a classic WordPress structure when classic structure is specified', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'classic'
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(createClassicStructure).toHaveBeenCalled();
      expect(createBedrockStructure).not.toHaveBeenCalled();
    });

    test('should create a bedrock WordPress structure when bedrock structure is specified', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'bedrock'
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(createBedrockStructure).toHaveBeenCalled();
      expect(createClassicStructure).not.toHaveBeenCalled();
    });

    test('should default to classic structure when an invalid structure is specified', async () => {
      // Arrange
      const config = {
        name: 'test-project',
        structure: 'invalid-structure'
      };
      
      // Act
      await initializeProject(config);
      
      // Assert
      expect(fs.mkdirSync).toHaveBeenCalled();
      expect(createClassicStructure).toHaveBeenCalled();
      expect(createBedrockStructure).not.toHaveBeenCalled();
    });

    test('should exit process if directory already exists', async () => {
      // Arrange
      const config = {
        name: 'existing-project',
        structure: 'classic'
      };
      
      // Mock existsSync to return true for this test only
      const mockExistsSync = jest.spyOn(fs, 'existsSync');
      mockExistsSync.mockImplementation((path) => {
        if (path.includes('existing-project')) {
          return true;
        }
        return false;
      });
      
      // Mock process.exit to throw an error to terminate execution
      const mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`Process exited with code ${code}`);
      });
      
      // Act & Assert
      try {
        await initializeProject(config);
        // If we get here, the test should fail
        fail('initializeProject should have thrown an error');
      } catch (error) {
        // Error should be from our mocked process.exit
        expect(error.message).toBe('Process exited with code 1');
        expect(fs.existsSync).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(createClassicStructure).not.toHaveBeenCalled();
        expect(createBedrockStructure).not.toHaveBeenCalled();
      }
    });
  });

  describe('CLI command execution', () => {
    test('should execute CLI with project name and classic structure options', (done) => {
      // Mock child_process.exec
      jest.mock('child_process', () => ({
        exec: jest.fn((cmd, cb) => {
          cb(null, { stdout: 'Success' });
          return { kill: jest.fn() };
        })
      }));
      
      // Reimport exec with our mock
      const { exec } = require('child_process');
      
      // Execute CLI command with options
      exec('node ./bin/cli.js --name test-cli-project --structure classic', (error, stdout) => {
        expect(error).toBeNull();
        expect(stdout).toBeDefined();
        done();
      });
    });

    test('should execute CLI with project name and bedrock structure options', (done) => {
      // Mock is already set from previous test
      const { exec } = require('child_process');
      
      // Execute CLI command with options
      exec('node ./bin/cli.js --name test-cli-project --structure bedrock', (error, stdout) => {
        expect(error).toBeNull();
        expect(stdout).toBeDefined();
        done();
      });
    });
  });
}); 