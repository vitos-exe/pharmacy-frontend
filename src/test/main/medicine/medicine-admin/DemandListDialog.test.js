import React from "react";
import { render, waitFor } from "@testing-library/react";
import DemandListDialog from "../../../../main/main/medicine/medicine-admin/DemandListDialog";
import {AppContext} from "../../../../main/App";

const user = {
    email: "test@example.com",
    password: "password123",
};

describe("DemandlistDialog", () => {
    it("fetches and renders the demanding medicine list", async () => {
        const mockDemandList = [
            {
                name: "Medicine 1",
                quantity: 5,
            },
            {
                name: "Medicine 2",
                quantity: 10,
            },
        ];

        jest.spyOn(global, "fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValueOnce(mockDemandList),
        });

        const { getByText } = render(
            <AppContext.Provider value={{user}}>
                <DemandListDialog closeDialog={() => {}} />
            </AppContext.Provider>
        );

        await waitFor(() => {
            mockDemandList.forEach((entry) => {
                expect(getByText(entry.name)).toBeInTheDocument();
                expect(getByText(`${entry.quantity} units`)).toBeInTheDocument();
            });
        });

        expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/medicine/demand", {
            headers: {
                Authorization: `Basic ${btoa(user.email + ":" + user.password)}`,
            },
        });
    });
});
