import { Link } from "react-router-dom";
import { AppContext } from "../../App";
import { useContext, useState } from "react";
import EditDialog from "./edit/EditDialog";

function AdminNavLinks(){  
    const [editDialogIsOpened, setEditDialogIsOpened] = useState(false);
    const {setUser} = useContext(AppContext);

    function logout(){
        setUser({
            role: "unauthorized",
            id: null,
            email: null,
            password: null,
        })
    }

    return (
        <ul className="nav-links">
            <li><Link to="orders">Orders</Link></li>
            <li><Link to="users">Users</Link></li>
            <li onClick={() => setEditDialogIsOpened(true)}>Edit</li>
            {editDialogIsOpened && (<EditDialog closeDialog={() => setEditDialogIsOpened(false)}/>)}
            <li><Link to="" onClick={logout}>Logout</Link></li>
        </ul>
    );
}

export default AdminNavLinks;