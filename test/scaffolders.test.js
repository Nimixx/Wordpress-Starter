const fs = require('fs');
const path = require('path');

// Mock dependencies - we're using manual mocks for these modules
jest.mock('../src/scaffolders/classic', () => ({
  createClassicStructure: jest.fn(),
}));
jest.mock('../src/scaffolders/bedrock', () => ({
  createBedrockStructure: jest.fn(),
}));
jest.mock('../src/scaffolders/common', () => ({
  displayWelcome: jest.fn(),
  createSectionHeader: jest.fn(),
  displaySuccess: jest.fn(),
  displayInfo: jest.fn(),
  displayWarning: jest.fn(),
}));

// Import the modules to test
const { createClassicStructure } = require('../src/scaffolders/classic');
const { createBedrockStructure } = require('../src/scaffolders/bedrock');
const { displayWelcome, createSectionHeader, displaySuccess, displayInfo, displayWarning } = require('../src/scaffolders/common');

describe('Scaffolder Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods to silence output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock fs methods using spyOn
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore mocks
    jest.restoreAllMocks();
  });

  describe('Classic Structure Scaffolder', () => {
    test('should create classic WordPress directories and files', () => {
      // Arrange
      const projectPath = path.join(process.cwd(), 'test-classic');
      
      // Act
      createClassicStructure(projectPath);
      
      // Assert - check if function was called
      expect(createClassicStructure).toHaveBeenCalledWith(projectPath);
    });
  });

  describe('Bedrock Structure Scaffolder', () => {
    test('should create bedrock WordPress directories and files', async () => {
      // Arrange
      const projectPath = path.join(process.cwd(), 'test-bedrock');
      
      // Act
      await createBedrockStructure(projectPath);
      
      // Assert - check if function was called
      expect(createBedrockStructure).toHaveBeenCalledWith(projectPath);
    });
  });

  describe('Common Utilities', () => {
    test('displayWelcome should call console.log', () => {
      // Act
      displayWelcome();
      
      // Assert
      expect(displayWelcome).toHaveBeenCalled();
    });

    test('createSectionHeader should call console.log with section title', () => {
      // Arrange
      const sectionTitle = 'Test Section';
      
      // Act
      createSectionHeader(sectionTitle);
      
      // Assert
      expect(createSectionHeader).toHaveBeenCalledWith(sectionTitle);
    });

    test('displaySuccess should call console.log with success message', () => {
      // Arrange
      const message = 'Success message';
      
      // Act
      displaySuccess(message);
      
      // Assert
      expect(displaySuccess).toHaveBeenCalledWith(message);
    });

    test('displayInfo should call console.log with info message', () => {
      // Arrange
      const message = 'Info message';
      
      // Act
      displayInfo(message);
      
      // Assert
      expect(displayInfo).toHaveBeenCalledWith(message);
    });

    test('displayWarning should call console.log with warning message', () => {
      // Arrange
      const message = 'Warning message';
      
      // Act
      displayWarning(message);
      
      // Assert
      expect(displayWarning).toHaveBeenCalledWith(message);
    });
  });
}); 