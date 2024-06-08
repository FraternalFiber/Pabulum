import { MockUseQueryResult } from '@/types/TMockUseQueryResult';

export const useRecipesMock: MockUseQueryResult = {
    isLoading: false,
    isError: false,
    data: null,
    refetch: jest.fn(),
};