// // __tests__/Search.test.js
// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { Search } from '@/pages/Search/index.tsx';
// import { Menu } from '@/components/Menu';
// import { Main } from '@/components/Main';
// import { SearchForm } from '@/components/SearchForm';
// import { Heading } from '@/components/Heading';
// import {expect} from '@jest/globals';
// import '@testing-library/jest-dom'
//
// // Mock the imported components
// jest.mock('@/components/Menu');
// jest.mock('@/components/Main');
// jest.mock('@/components/SearchForm');
// jest.mock('@/components/Heading');
//
// describe('Search Component', () => {
//   beforeEach(() => {
//     Menu.mockImplementation(() => <div>Menu Component</div>);
//     Main.mockImplementation(({ children }) => <div>{children}</div>);
//     SearchForm.mockImplementation(() => <div>SearchForm Component</div>);
//     Heading.mockImplementation(({ content }) => <div>{content}</div>);
//   });
//
//   it('should render the Search component correctly', () => {
//     const { getByText } = render(<Search />);
//
//     // Check if components are rendered
//     expect(getByText('Menu Component')).toBeInTheDocument();
//     expect(getByText('Find your favourite recipes')).toBeInTheDocument();
//     expect(getByText('SearchForm Component')).toBeInTheDocument();
//   });
//
//   it('should set document.title to "Search recipes - Pabulum"', () => {
//     render(<Search />);
//     expect(document.title).toBe('Search recipes - Pabulum');
//   });
// });
