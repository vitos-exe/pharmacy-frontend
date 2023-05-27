import {render, fireEvent, waitFor, act} from "@testing-library/react";
import Users from "../../../components/main/users/Users";
import {AppContext} from "../../../components/App";
// Mock the AppContext value
const user = {
    email: "test@example.com",
    password: "1234",
};

describe("Users", () => {
    it("fetches and renders users", async () => {
        const mockUsers = [
            {
                id: 1,
                name: "User 1",
                email: "user1@example.com",
                role: "user",
                address: "123 Street",
            },
            {
                id: 2,
                name: "User 2",
                email: "user2@example.com",
                role: "admin",
                address: "456 Street",
            },
        ];

        // Mock the fetch function and return mockUsers
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockUsers),
        });

        const { getByText } = render(
            <AppContext.Provider value={{user}}>
                <Users/>
            </AppContext.Provider>
        );

        await waitFor(() => {
            mockUsers.forEach((user) => {
                expect(getByText(user.name)).toBeInTheDocument();
                expect(getByText(user.email)).toBeInTheDocument();
                expect(getByText(user.role[0].toUpperCase() + user.role.slice(1))).toBeInTheDocument();
                expect(getByText(user.address)).toBeInTheDocument();
            });
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:8080/user/",
            {
                headers: {
                    Authorization: `Basic ${btoa(
                        user.email + ":" + user.password
                    )}`,
                },
            }
        );
    });

    it("changes user role on button click", async () => {
        const mockUsers = [
            {
                id: 1,
                name: "User 1",
                email: "user1@example.com",
                role: "user",
                address: "123 Street",
            },
        ];

        jest.spyOn(global, "fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockUsers)
        });

        const { getByText } = render(
            <AppContext.Provider value={{user}}>
                <Users/>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByText(mockUsers[0].name)).toBeInTheDocument();
        });

        // Mock the fetch function and return a successful response
        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true
        });

        await act(() => fireEvent.click(getByText("Change role")));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/user/${mockUsers[0].id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        role: mockUsers[0].role === "user" ? "admin" : "user",
                    }),
                    headers: {
                        Authorization: `Basic ${btoa(
                            user.email + ":" + user.password
                        )}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        });
    });

    it("deletes user on button click", async () => {
        const mockUsers = [
            {
                id: 1,
                name: "User 1",
                email: "user1@example.com",
                role: "user",
                address: "123 Street",
            },
        ];

        jest.spyOn(global, "fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockUsers),
        });

        const { getByText } = render(
            <AppContext.Provider value={{user}}>
                <Users/>
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByText(mockUsers[0].name)).toBeInTheDocument();
        });

        // Mock the fetch function and return a successful response
        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
        });


        await act(() => fireEvent.click(getByText("Delete user")));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `http://localhost:8080/user/${mockUsers[0].id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Basic ${btoa(
                            user.email + ":" + user.password
                        )}`,
                    },
                }
            );
        });
    });
});

