import { render, screen } from '@testing-library/react';
import { SearchForm } from '../index.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('SearchForm', () => {
    it('renders the form', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SearchForm />
                </BrowserRouter>
            </QueryClientProvider>
        );
        expect(screen.getByPlaceholderText('Dish name...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    //TODO: the rest of coverage for userSearchForm
    /*it('submits the form with valid input', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <SearchForm />
                </BrowserRouter>
            </QueryClientProvider>
        );

        const searchInput = screen.getByPlaceholderText('Dish name...');
        const submitButton = screen.getByRole('button', { name: 'Search' });

        await userEvent.type(searchInput, 'pizza');
        fireEvent.click(submitButton);

        // Wait for the SearchResults component to be rendered
        const searchResults = await screen.getByTestId('search-results');

        expect(searchResults).toBeInTheDocument();
    });*/

});
