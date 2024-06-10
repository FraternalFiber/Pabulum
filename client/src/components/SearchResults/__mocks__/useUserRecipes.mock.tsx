import { MockUseQueryResult } from '@/types/TMockUseQueryResult';

export const useUserRecipesMock: MockUseQueryResult = {
    isLoading: false,
    isError: false,
    data: null,
    refetch: jest.fn(),
};