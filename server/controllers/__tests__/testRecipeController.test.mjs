import fs from 'fs';
import { testRecipeController } from '../testRecipeController.mjs';

jest.mock('fs');

const createReq = () => ({});
const createRes = () => ({
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
});


describe('testRecipeController', () => {
  let errorSpy;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  test('should return recipe data with status 200', async () => {
    const req = createReq();
    const res = createRes();
    const recipeData = { name: 'Pancakes', ingredients: ['flour', 'eggs', 'milk'] };
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, JSON.stringify(recipeData));
    });

    await testRecipeController(req, res);

    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8', expect.any(Function));
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).not.toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(recipeData);
  });

  test('should handle readFile error', async () => {
    const req = createReq();
    const res = createRes();
    const errorMessage = 'File not found';
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(new Error(errorMessage), null);
    });

    await testRecipeController(req, res);

    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8', expect.any(Function));
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching data' });
  });

  test('should handle try-catch error', async () => {
    const req = createReq();
    const res = createRes();
    const error = new Error('Unexpected error');
    fs.readFile.mockImplementation(() => {
      throw error;
    });

    await testRecipeController(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while fetching data' });
  });
});
