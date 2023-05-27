import Navbar from "./navbar/Navbar";
import '../assets/styles/styles.scss'
import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Medicine} from "./main/medicine/Medicine";
import Users from "./main/users/Users";
import UserOrders from "./main/user-orders/UserOrders";
import Error from "./main/errors/NotFound";
import AdminOrders from "./main/admin-orders/AdminOrders";

export const AppContext = createContext();

export function App() {
  const [user, setUser] = useState({
    role: "unauthorized",
    id: null,
    email: null,
    password: null
  });

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedOrderItems = JSON.parse(localStorage.getItem('orderItems'));
    if (storedUser !== null){
      setUser(storedUser);
    }
    if (storedOrderItems !== null){
      setOrderItems(storedOrderItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }, [user, orderItems]);

  const notFound = Error({
    title: "Not found",
    message: "Oops! The page you are looking for could not be found."
  });

  const noAccess = Error({
    title: "No access",
    message: "Oops! Seems like you are unauthorized or you don't have access to this page."
  });

  const ordersComponent = (user.role === "user" && UserOrders) || (user.role === "admin" && AdminOrders) ||  noAccess;
  const usersComponent = user.role === "admin" && Users || noAccess;

  return (
    <AppContext.Provider value={{user, setUser, orderItems, setOrderItems}}>
      <BrowserRouter>
        <header>
          <Navbar/>
        </header>
        <main>
          <Routes>
            <Route index element={<Medicine/>} />
            <Route path="users" element={<usersComponent/>} />
            <Route path="orders" element={<ordersComponent/>} />
            <Route path="*" element={<notFound/>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppContext.Provider>
  );
}