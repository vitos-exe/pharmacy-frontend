import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {AppContext} from "../../../components/App";
import MedicineEntity from "../../../components/main/medicine/MedicineEntity";
import MedicineInfoDialog from "../../../components/main/medicine/MedicineInfoDialog";
import MedicineEditDialog from "../../../components/main/medicine/medicine-admin/edit-medicine/MedicineEditDialog";
import {BrowserRouter} from "react-router-dom";

describe("MedicineEntity", () => {
    const user = { role: "user" };
    const orderItems = [];
    const setOrderItems = jest.fn();

    test("renders medicine name and price", () => {
        const data = { name: "Medicine A", price: 10 };
        const { getByText } = render(
            <AppContext.Provider value={{ user, orderItems, setOrderItems }}>
                <MedicineEntity data={data} />
            </AppContext.Provider>
        );

        const medicineName = getByText("Medicine A");
        const medicinePrice = getByText("10$");

        expect(medicineName).toBeInTheDocument();
        expect(medicinePrice).toBeInTheDocument();
    });

    test("opens info dialog when clicking more info button", () => {
        const data = { name: "Medicine A", price: 10 };
        const { getByText, getByTestId, container } = render(
            <AppContext.Provider value={{ user, orderItems, setOrderItems }}>
                <MedicineEntity data={data} />
            </AppContext.Provider>
        );

        const moreInfoButton = getByText("More info");
        fireEvent.click(moreInfoButton);

        const infoDialog = container.getElementsByClassName("medicine-info-dialog").item(0);
        expect(infoDialog).toBeInTheDocument();
    });

    test("adds medicine to order when clicking add to order button", () => {
        const data = { name: "Medicine A", price: 10 };
        const { getByText } = render(
            <AppContext.Provider value={{ user, orderItems, setOrderItems }}>
                <MedicineEntity data={data} />
            </AppContext.Provider>
        );

        const addToOrderButton = getByText("Add to order");
        fireEvent.click(addToOrderButton);

        expect(setOrderItems).toHaveBeenCalledWith([
            { name: "Medicine A", quantity: 1 },
        ]);
    });

    test("opens edit dialog when user is admin and clicking edit button", () => {
        const user = { role: "admin" };
        const data = { name: "Medicine A", price: 10 };
        const { getByText, getByTestId, container } = render(
            <AppContext.Provider value={{ user, orderItems, setOrderItems }}>
                <BrowserRouter>
                    <MedicineEntity data={data} />
                </BrowserRouter>
            </AppContext.Provider>
        );

        const editButton = getByText("Edit button");
        fireEvent.click(editButton);

        const editDialog = container.getElementsByClassName("medicine-edit-dialog").item(0);
        expect(editDialog).toBeInTheDocument();
    });
});
