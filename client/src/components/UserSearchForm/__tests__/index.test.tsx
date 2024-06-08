import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserSearchForm } from '../index.tsx';
import { BrowserRouter } from 'react-router-dom';
import { availableDietItems } from '@/components/SearchForm/searchFormFilterItems.ts'

// Mock the SearchResults component
jest.mock('@/components/SearchResults', () => ({
    SearchResults: ({ searchParams }: { searchParams: any }) => (
        <div data-testid="search-results">{JSON.stringify(searchParams)}</div>
    ),
}));

describe('UserSearchForm', () => {
    it('renders the form with initial values', async () => {
        render(
            <BrowserRouter>
                <UserSearchForm />
            </BrowserRouter>
        );

        expect(screen.getByPlaceholderText('Dish name...')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();

        // Find the diet filter dropdown
        const dietDropdown = screen.getByRole('combobox', { name: '' });
        expect(dietDropdown).toBeInTheDocument();

        // Open the dropdown menu
        fireEvent.click(dietDropdown);

        // Check if the available diet options are present in the dropdown menu
        availableDietItems.forEach((item) => {
            expect(screen.getByText(item.label)).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        render(
            <BrowserRouter>
                <UserSearchForm />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText('Dish name...');
        const submitButton = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'Pasta' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId('search-results')).toHaveTextContent('Pasta');
        });
    });



});
