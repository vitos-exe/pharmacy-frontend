import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import {AppContext} from "../../../main/App";
import AdminNavLinks from "../../../main/navbar/navlinks/AdminNavLinks";

describe("AdminNavLinks", () => {
    const setUser = jest.fn();

    test("renders navigation links", () => {
        const { getByText } = render(
            <AppContext.Provider value={{setUser}}>
                <Router>
                    <AdminNavLinks />
                </Router>
            </AppContext.Provider>
        );

        const ordersLink = getByText("Orders");
        const usersLink = getByText("Users");
        const editLink = getByText("Edit");
        const logoutLink = getByText("Logout");

        expect(ordersLink).toBeInTheDocument();
        expect(usersLink).toBeInTheDocument();
        expect(editLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
    });

    test("opens edit dialog when clicking edit link", () => {
        const { getByText, getByTestId, container } = render(
            <AppContext.Provider value={{ setUser }}>
                <Router>
                    <AdminNavLinks />
                </Router>
            </AppContext.Provider>
        );

        const editLink = getByText("Edit");
        fireEvent.click(editLink);

        const editDialog = container.getElementsByClassName("user-edit-dialog").item(0);
        expect(editDialog).toBeInTheDocument();
    });

    test("calls setUser with unauthorized user when clicking logout link", () => {
        const { getByText } = render(
            <AppContext.Provider value={{ setUser }}>
                <Router>
                    <AdminNavLinks />
                </Router>
            </AppContext.Provider>
        );

        const logoutLink = getByText("Logout");
        fireEvent.click(logoutLink);

        expect(setUser).toHaveBeenCalledWith({
            role: "unauthorized",
            id: null,
            email: null,
            password: null,
        });
    });
});
