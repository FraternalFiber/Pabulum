import { TRecipeResult } from '@/types/TRecipeResult';

export type MockUseQueryResult = {
    isLoading: boolean;
    isError: boolean;
    data: TRecipeResult[] | null;
    refetch: jest.Mock;
};