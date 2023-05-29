import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import UserOrders from "../../../main/main/user-orders/UserOrders";
import {AppContext} from "../../../main/App";

describe('UserOrders', () => {
    it('renders the component and fetches orders', async () => {
        const user = {'email': 'test@example.com', 'password': '1234'};

        // Mock the fetch response
        const mockOrders = [
            {id: 1, name: "Ibuprofen", quantity: 10, status: "Pending"},
            {id: 2, name: "Nurofen", quantity: 20, status: "Delivered"}
        ];

        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockOrders)
        });

        render(
            <AppContext.Provider value={{user}}>
                <UserOrders/>
            </AppContext.Provider>
        );

        await waitFor(() => {
            // Assertions
            expect(screen.getByText('Order 1')).toBeInTheDocument();
            expect(screen.getByText('Order 2')).toBeInTheDocument();
            expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/order/my', {
                headers: {
                    Authorization: 'Basic ' + btoa('test@example.com:1234')
                }
            });
        });
    });
});
