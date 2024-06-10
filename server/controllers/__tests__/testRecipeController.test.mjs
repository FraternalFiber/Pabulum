import fs from 'fs';
import path from 'node:path';
import { testRecipeController } from '../testRecipeController.mjs';
// import { jest } from '@jest/globals';

jest.mock('fs');

describe('testRecipeController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return recipe data with status 200', async () => {
    const recipeData = { name: 'Pancakes', ingredients: ['flour', 'eggs', 'milk'] };
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, JSON.stringify(recipeData));
    });

    await testRecipeController(req, res);

    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8', expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(recipeData);
  });

  test('should handle readFile error', async () => {
    const errorMessage = 'File not found';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error(errorMessage), null);
    });

    await testRecipeController(req, res);

    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8', expect.any(Function));
    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  test('should handle try-catch error', async () => {
    const error = new Error('Unexpected error');
    fs.readFile.mockImplementation(() => {
      throw error;
    });

    await testRecipeController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching data' });
  });
});
