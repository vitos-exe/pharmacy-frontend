import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './main/App';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);