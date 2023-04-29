import Logo from "./Logo";
import DefaultNavLinks from "./navlinks/DefaultNavLinks";
import UserNavLinks from "./navlinks/UserNavLinks";
import AdminNavLinks from "./navlinks/AdminNavLinks";
import { AppContext } from "../App";
import { useContext } from "react";
import Cart from "./Cart";

function Navbar(){
    const {user} = useContext(AppContext);

    const Links = {
        "unauthorized": DefaultNavLinks,
        "user": UserNavLinks,
        "admin": AdminNavLinks
    }[user.role];

    return (
        <nav className="navbar">
            <Logo/>
            <Links/>
            {user.role === "user" && <Cart/>}
        </nav>
    );
}

export default Navbar;