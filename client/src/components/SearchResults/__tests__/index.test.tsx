import { render, screen } from '@testing-library/react';
import { SearchResults } from '../index.tsx';
import { BrowserRouter } from 'react-router-dom';
import { useRecipesMock } from '../__mocks__/useRecipes.mock.tsx';
import { useUserRecipesMock } from '../__mocks__/useUserRecipes.mock.tsx';

jest.mock('@/services/useRecipes.ts', () => ({
    useRecipes: () => useRecipesMock,
}));

jest.mock('@/services/useUserRecipes.ts', () => ({
    useUserRecipes: () => useUserRecipesMock,
}));

describe('SearchResults', () => {
    const mockSearchParams = { q: 'test' };
    const mockRecipes = [
        { id: 1, title: 'Recipe 1', image: 'image1.jpg' },
        { id: 2, title: 'Recipe 2', image: 'image2.jpg' },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render error alert when isError is true', () => {
        useRecipesMock.isError = true;
        useUserRecipesMock.isError = true;

        render(
            <BrowserRouter>
                <SearchResults searchParams={mockSearchParams} dataSource="online" />
            </BrowserRouter>
        );

        expect(screen.getByText("Sorry, we couldn't load your recipes.")).toBeInTheDocument();
    });

    it('should render LoadingSkeletons when isLoading is true', () => {
        useRecipesMock.isLoading = true;
        useUserRecipesMock.isLoading = true;

        render(
            <BrowserRouter>
                <SearchResults searchParams={mockSearchParams} dataSource="online" />
            </BrowserRouter>
        );

        expect(screen.getByTestId('loading-skeletons')).toBeInTheDocument();
    });

    it('should render RecipeResultCard components when recipes are available', () => {
        useRecipesMock.data = mockRecipes;
        useUserRecipesMock.data = mockRecipes;

        useRecipesMock.isLoading = false;
        useUserRecipesMock.isLoading = false;
        useRecipesMock.isError = false;
        useUserRecipesMock.isError = false;

        render(
            <BrowserRouter>
                <SearchResults searchParams={mockSearchParams} dataSource="online" />
            </BrowserRouter>
        );

        const recipeCards = screen.getAllByTestId('recipe-result-card');
        expect(recipeCards).toHaveLength(mockRecipes.length);
    });

    it('should render alert no recipes are available', () => {
        useRecipesMock.data = [];
        useUserRecipesMock.data = [];

        render(
            <BrowserRouter>
                <SearchResults searchParams={mockSearchParams} dataSource="user" />
            </BrowserRouter>
        );

        expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });
});
