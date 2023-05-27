import React from 'react';
import {render, screen, fireEvent, act, waitFor} from '@testing-library/react';
import Cart from "../../components/navbar/Cart";
import {AppContext} from "../../components/App";

describe('Cart component', () => {

    test('renders cart image', () => {
        const orderItems = [];
        render(
            <AppContext.Provider value={{orderItems}}>
                <Cart />
            </AppContext.Provider>
        );

        const cartImage = screen.getByAltText('Cart');
        expect(cartImage).toBeInTheDocument();
    });

    test('renders order form with submit button', () => {
        const orderItems = [];
        render(
            <AppContext.Provider value={{orderItems}}>
                <Cart />
            </AppContext.Provider>
        );
        const submitButton = screen.getByRole('button', { name: 'Submit Order' });
        expect(submitButton).toBeInTheDocument();
    });

    test('renders "No order items" message when orderItems is empty', () => {
        const orderItems = [];
        render(
            <AppContext.Provider value={{orderItems}}>
                <Cart />
            </AppContext.Provider>
        );
        const noOrderItemsMessage = screen.getByText('No order items');
        expect(noOrderItemsMessage).toBeInTheDocument();
    });

    test('renders order items when orderItems is not empty', () => {
        const orderItems = [
            { name: 'Item 1', quantity: 1 },
            { name: 'Item 2', quantity: 2 },
        ];

        render(
            <AppContext.Provider value={{ orderItems }}>
                <Cart />
            </AppContext.Provider>
        );

        const item1Label = screen.getByLabelText('Item 1');
        const item2Label = screen.getByLabelText('Item 2');
        expect(item1Label).toBeInTheDocument();
        expect(item2Label).toBeInTheDocument();
    });

    test('increments quantity when input value changes', () => {
        const orderItems = [{ name: 'Item', quantity: 1 }];
        const setOrderItems = jest.fn();

        render(
            <AppContext.Provider value={{ orderItems, setOrderItems }}>
                <Cart />
            </AppContext.Provider>
        );

        const quantityInput = screen.getByLabelText('Item');
        fireEvent.change(quantityInput, { target: { value: '2' } });

        expect(setOrderItems).toHaveBeenCalledWith([{ name: 'Item', quantity: 2 }]);
    });

    test('calls the makeOrder function and clears orderItems on successful API response', async () => {
        const orderItems = [{ name: 'Item', quantity: 1 }];
        const user = {'email': 'test@example.com', 'password': '1234'};
        const setOrderItems = jest.fn();

        // Mock the fetch function and response
        jest.spyOn(window, "fetch").mockImplementation(() => Promise.resolve({
            ok: true
        }));

        jest.spyOn(window, "alert").mockImplementation(() => {});

        render(
            <AppContext.Provider value={{ orderItems, setOrderItems, user }}>
                <Cart />
            </AppContext.Provider>
        );

        // Simulate submitting the form
        fireEvent.click(screen.getByText('Submit Order'));

        // Assert that the API call was made
        expect(window.fetch).toHaveBeenCalledWith('http://localhost:8080/order/', {
            method: 'POST',
            body: JSON.stringify({'order_items': orderItems}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + btoa(user.email + ":" + user.password)
            },
        });

        await waitFor(() => {
            expect(window.alert).toBeCalledWith("Order created");
            expect(setOrderItems).toBeCalledWith([]);
        })

    });
});
