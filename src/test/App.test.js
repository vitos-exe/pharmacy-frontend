import {render} from '@testing-library/react';
import {App} from "../main/App";
import {createMemoryRouter, MemoryRouter} from "react-router-dom";

test("Not found", () => {
    render(
        <MemoryRouter initialEntries={['/wrong']}>
            <App/>
        </MemoryRouter>
    );
})

test("App start", () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App/>
        </MemoryRouter>
    );
})