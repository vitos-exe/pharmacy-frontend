import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DefaultNavLinks from "../../../components/navbar/navlinks/DefaultNavLinks";
import LoginDialog from "../../../components/navbar/navlinks/login/LoginDialog";
import SignupDialog from "../../../components/navbar/navlinks/signup/SignupDialog";
import {AppContext} from "../../../components/App";
describe("DefaultNavLinks", () => {
    test("renders log in and sign up links", () => {
        const { getByText } = render(<DefaultNavLinks />);
        const loginLink = getByText("Log in");
        const signupLink = getByText("Sign up");

        expect(loginLink).toBeInTheDocument();
        expect(signupLink).toBeInTheDocument();
    });

    test("opens login dialog when clicking log in link", () => {
        const setUser = jest.fn();
        const { getByText } = render(
            <AppContext.Provider value={{setUser}}>
                <DefaultNavLinks/>
            </AppContext.Provider>
        );
        const loginLink = getByText("Log in");

        fireEvent.click(loginLink);

        const loginDialog = getByText("Log into your account");
        expect(loginDialog).toBeInTheDocument();
    });

    test("opens signup dialog when clicking sign up link", () => {
        const setUser = jest.fn();
        const { getByText } = render(
            <AppContext.Provider value={{setUser}}>
                <DefaultNavLinks/>
            </AppContext.Provider>
        );
        const signupLink = getByText("Sign up");

        fireEvent.click(signupLink);

        const signupDialog = getByText("Create new account");
        expect(signupDialog).toBeInTheDocument();
    });

    test("closes login dialog when closeDialog is called", () => {
        const setUser = jest.fn();
        const { getByText, queryByText } = render(
            <AppContext.Provider value={{setUser}}>
                <DefaultNavLinks/>
            </AppContext.Provider>
        );
        const loginLink = getByText("Log in");

        fireEvent.click(loginLink);

        const loginDialog = getByText("Log into your account");
        expect(loginDialog).toBeInTheDocument();

        const closeButton = getByText("X"); // Assuming a close button is rendered in the dialog
        fireEvent.click(closeButton);

        expect(queryByText("Log into your account")).toBeNull();
    });

    test("closes signup dialog when closeDialog is called", () => {
        const setUser = jest.fn();
        const { getByText, queryByText } = render(
            <AppContext.Provider value={{setUser}}>
                <DefaultNavLinks/>
            </AppContext.Provider>
        );
        const signupLink = getByText("Sign up");

        fireEvent.click(signupLink);

        const signupDialog = getByText("Create new account");
        expect(signupDialog).toBeInTheDocument();

        const closeButton = getByText("X"); // Assuming a close button is rendered in the dialog
        fireEvent.click(closeButton);

        expect(queryByText("Create new account")).toBeNull();
    });

    test("prevent two dialogs from being opened at the same time", () => {
        const setUser = jest.fn();
        const { getByText, queryByText } = render(
            <AppContext.Provider value={{setUser}}>
                <DefaultNavLinks/>
            </AppContext.Provider>
        );

        const signupLink = getByText("Sign up");
        fireEvent.click(signupLink);

        expect(getByText("Create new account")).toBeInTheDocument();

        const loginLink = getByText("Log in");
        fireEvent.click(loginLink);

        expect(queryByText("Log into your account")).toBeNull();
    })
});
