import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import AdminOrders from "../../../components/main/admin-orders/AdminOrders";
import {AppContext} from "../../../components/App";
import userEvent from "@testing-library/user-event";

describe("AdminOrders", () => {
    beforeEach(() => {
        jest.spyOn(global.console, 'error').mockImplementation(() => {});

        global.fetch = jest.fn().mockResolvedValue({
            json: () =>
                Promise.resolve([
                    {
                        id: 1,
                        create_time: "2023-05-26T10:00:00.000Z",
                        status: "pending",
                        order_items: [
                            {name: "Ibuprofen", quantity: 10}
                        ]
                    },
                    {
                        id: 2,
                        create_time: "2023-05-27T14:30:00.000Z",
                        status: "delivered",
                        order_items: [
                            {name: "Nurofen", quantity: 20}
                        ]
                    },
                ]),
        });
    });
    test("renders table with order information", async () => {
        const user = {'email': 'test@example.com', 'password': '1234'};

        // Render the component
        render(
            <AppContext.Provider value={{user}}>
                <AdminOrders/>
            </AppContext.Provider>
        );

        // Verify that the table headers are rendered
        expect(screen.getByText("Order ID")).toBeInTheDocument();
        expect(screen.getByText("Time")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();

        // Verify that the table rows are rendered with correct data
        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("2023-05-26 12:00:00")).toBeInTheDocument();
            expect(screen.getByText("Pending")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
            expect(screen.getByText("2023-05-27 16:30:00")).toBeInTheDocument();
            expect(screen.getByText("Delivered")).toBeInTheDocument();
        });
    });

    test("changes order status on button click", async () => {
        const user = {'email': 'test@example.com', 'password': '1234'};

        // Render the component
        render(
            <AppContext.Provider value={{user}}>
                <AdminOrders/>
            </AppContext.Provider>
        );

        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(),
        });

        await waitFor(() => {
            const changeStatusButton = screen.getAllByText("Change status")[0];
            fireEvent.click(changeStatusButton);

            // Verify that the fetch function is called with the correct URL and payload
            expect(fetch).toHaveBeenCalledWith("http://localhost:8080/order/1", {
                method: "PUT",
                body: JSON.stringify({ status: "delivered" }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: expect.any(String),
                }
            });
        });
    });

    test("opens order info dialog on button click", async () => {
        const user = {'email': 'test@example.com', 'password': '1234'};

        const {getAllByText}  = render(
            <AppContext.Provider value={{user}}>
                <AdminOrders/>
            </AppContext.Provider>
        );

        await waitFor(() => {
            const moreInfoButton = getAllByText("More info")[0];
            expect(moreInfoButton).toBeInTheDocument();
            userEvent.click(moreInfoButton);

            // Verify that the order info dialog is rendered
            expect(screen.getByText("Ibuprofen")).toBeInTheDocument();
            expect(screen.getByText("10 units")).toBeInTheDocument();

            // Close the dialog
            fireEvent.click(screen.getAllByText("Close")[0]);

            // Verify that the dialog is closed
            expect(screen.queryByText("Order Information")).not.toBeInTheDocument();
        });

    });
});
