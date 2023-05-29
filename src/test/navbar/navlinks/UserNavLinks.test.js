import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {AppContext} from "../../../main/App";
import UserNavLinks from "../../../main/navbar/navlinks/UserNavLinks";

describe("UserNavLinks", () => {
    test("renders user navigation links correctly", () => {
        const setUser = jest.fn();
        render(
            <BrowserRouter>
                <AppContext.Provider value={{ setUser }}>
                    <UserNavLinks />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Assert that the links are rendered
        expect(screen.getByText("My orders")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test("opens edit dialog when 'Edit' is clicked", () => {
        const setUser = jest.fn();
        render(
            <BrowserRouter>
                <AppContext.Provider value={{ setUser }}>
                    <UserNavLinks />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Click on the 'Edit' link
        fireEvent.click(screen.getByText("Edit"));

        // Assert that the edit dialog is opened
        expect(screen.getByText("Edit account")).toBeInTheDocument();
    });

    test("closes edit dialog when 'closeDialog' is called", () => {
        const setUser = jest.fn();
        render(
            <BrowserRouter>
                <AppContext.Provider value={{ setUser }}>
                    <UserNavLinks />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Open the edit dialog
        fireEvent.click(screen.getByText("Edit"));

        // Close the edit dialog
        fireEvent.click(screen.getByText("X"));

        // Assert that the edit dialog is closed
        expect(screen.queryByTestId("Edit account")).not.toBeInTheDocument();
    });

    test("calls 'setUser' with the correct values when 'Logout' is clicked", () => {
        const setUser = jest.fn();
        render(
            <BrowserRouter>
                <AppContext.Provider value={{ setUser }}>
                    <UserNavLinks />
                </AppContext.Provider>
            </BrowserRouter>
        );

        // Click on the 'Logout' link
        fireEvent.click(screen.getByText("Logout"));

        // Assert that 'setUser' is called with the expected values
        expect(setUser).toHaveBeenCalledWith({
            role: "unauthorized",
            id: null,
            email: null,
            password: null,
        });
    });
});
