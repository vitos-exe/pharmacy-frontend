import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateMedicineForm
    from "../../../../../main/main/medicine/medicine-admin/create-medicine/CreateMedicineForm";
import {AppContext} from "../../../../../main/App";
import {MedicineContext} from "../../../../../main/main/medicine/Medicine";

// Mock the AppContext value
const user = {
    email: "test@example.com",
    password: "password123",
};

const mockSetMedicine = jest.fn();
describe("CreateMedicineForm", () => {
    it("submits the form and creates a medicine", async () => {
        const medicine = [];
        const setMedicine = jest.fn(func => {
          medicine.length = 0;
          medicine.push(...func(medicine));
        });

        jest.spyOn(global, "alert").mockImplementation(() => {});

        const { getByLabelText, getByText } = render(
            <AppContext.Provider value={{user}}>
                <MedicineContext.Provider value={{medicine, setMedicine}}>
                    <CreateMedicineForm closePopUp={() => {}} />
                </MedicineContext.Provider>
            </AppContext.Provider>
        );

        // Fill in form fields
        fireEvent.change(getByLabelText("Name"), { target: { value: "Medicine 1" } });
        fireEvent.change(getByLabelText("Price"), { target: { value: "10" } });
        fireEvent.change(getByLabelText("Quantity"), { target: { value: "5" } });
        fireEvent.change(getByLabelText("Description"), { target: { value: "Test description" } });

        // Mock the fetch function and return a successful response
        global.fetch = jest.fn().mockResolvedValueOnce({
            status: 201,
            json: jest.fn().mockResolvedValueOnce({ id: 1, name: "Medicine 1" }),
        });

        fireEvent.click(getByText("Submit"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/medicine/", {
                method: "POST",
                body: JSON.stringify({
                    name: "Medicine 1",
                    price: "10",
                    quantity: "5",
                    description: "Test description",
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(user.email + ":" + user.password)}`,
                },
            });
            expect(setMedicine).toHaveBeenCalledTimes(1);
            expect(medicine).toEqual([{ id: 1, name: "Medicine 1" }]);
        });
    });

    it("shows an alert with an error message if the form submission fails", async () => {
        const medicine = [];
        const setMedicine = jest.fn(func => {
            medicine.length = 0;
            medicine.push(...func(medicine));
        });

        jest.spyOn(global, "alert").mockImplementation(() => {});

        const { getByLabelText, getByText } = render(
            <AppContext.Provider value={{user}}>
                <MedicineContext.Provider value={{medicine, setMedicine}}>
                    <CreateMedicineForm closePopUp={() => {}} />
                </MedicineContext.Provider>
            </AppContext.Provider>
        );

        // Fill in form fields
        fireEvent.change(getByLabelText("Name"), { target: { value: "Medicine 1" } });
        fireEvent.change(getByLabelText("Price"), { target: { value: "10" } });
        fireEvent.change(getByLabelText("Quantity"), { target: { value: "5" } });
        fireEvent.change(getByLabelText("Description"), { target: { value: "Test description" } });

        // Mock the fetch function and return an error response
        jest.spyOn(global, "fetch").mockResolvedValue({
            status: 400,
            text: jest.fn().mockResolvedValueOnce("Bad Request"),
        });

        fireEvent.click(getByText("Submit"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(alert).toHaveBeenCalledWith("400 Bad Request");
        });
    });
});
