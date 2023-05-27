import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from "../../components/navbar/Navbar";
import {AppContext} from "../../components/App";

// Mocking the context value
const mockContextValue = {
    user: {
        role: 'user',
    },
};

// Mocking the components
jest.mock('../../components/navbar/Logo', () => () => <div data-testid="mock-logo" />);
jest.mock('../../components/navbar/navlinks/DefaultNavLinks', () => () => (
    <div data-testid="mock-default-navlinks" />
));
jest.mock('../../components/navbar/navlinks/UserNavLinks', () => () => (
    <div data-testid="mock-user-navlinks" />
));
jest.mock('../../components/navbar/navlinks/AdminNavLinks', () => () => (
    <div data-testid="mock-admin-navlinks" />
));
jest.mock('../../components/navbar/Cart', () => () => <div data-testid="mock-cart" />);

describe('Navbar', () => {
    beforeEach(() => {
        render(
            <AppContext.Provider value={mockContextValue}>
                <Navbar />
            </AppContext.Provider>
        );
    });

    test('renders logo', () => {
        const logoElement = screen.getByTestId('mock-logo');
        expect(logoElement).toBeInTheDocument();
    });

    test('renders user navlinks when user role is "user"', () => {
        const userNavLinksElement = screen.getByTestId('mock-user-navlinks');
        expect(userNavLinksElement).toBeInTheDocument();
    });

    test('renders admin navlinks when user role is "admin"', () => {
        // Update the user role in the context
        const updatedContextValue = {
            user: {
                role: 'admin',
            },
        };
        render(
            <AppContext.Provider value={updatedContextValue}>
                <Navbar />
            </AppContext.Provider>
        );

        const adminNavLinksElement = screen.getByTestId('mock-admin-navlinks');
        expect(adminNavLinksElement).toBeInTheDocument();
    });

    test('renders default navlinks when user role is neither "user" nor "admin"', () => {
        // Update the user role in the context
        const updatedContextValue = {
            user: {
                role: 'unauthorized',
            },
        };
        render(
            <AppContext.Provider value={updatedContextValue}>
                <Navbar />
            </AppContext.Provider>
        );

        const defaultNavLinksElement = screen.getByTestId('mock-default-navlinks');
        expect(defaultNavLinksElement).toBeInTheDocument();
    });

    test('renders cart when user role is "user"', () => {
        const cartElement = screen.getByTestId('mock-cart');
        expect(cartElement).toBeInTheDocument();
    });
});
