// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import Market, { getToken, fetchProducts } from '../app/pages/Market'; // Import functions from Market.tsx

// jest.mock('../app/pages/Market'); // Mock the entire Market module

// describe('Market Component', () => {
//     const mockNavigation = {
//         navigate: jest.fn(),
//     };

//     const mockRoute = {
//         params: {
//             searchQuery: 'tire',
//         },
//     };

//     const mockProducts = [
//         {
//             itemId: '1',
//             title: 'Sample Product 1',
//             image: { imageUrl: 'https://via.placeholder.com/150' },
//             price: { value: '100' },
//             itemWebUrl: 'https://example.com/product1',
//             rating: 4.5,
//             soldQuantity: 100,
//             shopName: 'Shop 1',
//         },
//         // Add more mock products as needed
//     ];

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('renders without crashing', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

//         const { getByPlaceholderText } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         await waitFor(() => getByPlaceholderText('Search for products'));
//     });

//     it('displays loading indicator while fetching data', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockImplementation(() => new Promise(() => {}));

//         const { getByText } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         expect(getByText('Searching For Your Products...')).toBeTruthy();
//     });

//     it('displays products after fetching data', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

//         const { getByText } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         await waitFor(() => getByText('Sample Product 1'));

//         expect(getByText('Sample Product 1')).toBeTruthy();
//         expect(getByText('Rp 1,450,000')).toBeTruthy(); // Adjust based on your conversion rate
//     });

//     it('handles search input change', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

//         const { getByPlaceholderText } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         const searchInput = getByPlaceholderText('Search for products');

//         fireEvent.changeText(searchInput, 'new search');

//         expect(searchInput.props.value).toBe('new search');
//     });

//     it('handles search button press', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

//         const { getByPlaceholderText, getByRole } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         const searchInput = getByPlaceholderText('Search for products');
//         const searchButton = getByRole('button');

//         fireEvent.changeText(searchInput, 'new search');
//         fireEvent.press(searchButton);

//         await waitFor(() => expect(fetchProducts).toHaveBeenCalledWith('mockToken', 'new search'));
//     });

//     it('displays error message when fetch fails', async () => {
//         (getToken as jest.Mock).mockResolvedValue('mockToken');
//         (fetchProducts as jest.Mock).mockRejectedValue(new Error('Network Error'));

//         const { getByText } = render(<Market route={mockRoute} navigation={mockNavigation} />);

//         await waitFor(() => getByText('There is something wrong with your connection, do you want to reload?'));

//         expect(getByText('There is something wrong with your connection, do you want to reload?')).toBeTruthy();
//     });
// });
