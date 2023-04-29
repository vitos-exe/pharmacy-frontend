import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";

function Users(){
    const [users, setUsers] = useState([]);

    const {user} = useContext(AppContext);

    useEffect(() => {
        async function fetchUsers(){
            const json = await fetch("http://localhost:8080/user/", {headers: {
                "Authorization": "Basic " + btoa(user.email + ":" + user.password)
            }}).then(r => r.json());
            setUsers(json);
        }
        fetchUsers();
    });

    function toTableRow(user, index){
        return (
        <tr key={index}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role[0].toUpperCase() + user.role.slice(1)}</td>
            <td>{user.address}</td>
            <td className="action-column">
                <button className="change-role-button" onClick={() => changeRole(user.id, user.role)}>Change role</button>
                <button className="delete-user-button" onClick={() => deleteUser(user.id)}>Delete user</button>
            </td>
        </tr>)
    }

    function changeRole(index, prevRole){
        fetch("http://localhost:8080/user/" + index, {
            method: "PUT",
            body: JSON.stringify({role: prevRole === "user" ? "admin" : "user"}),
            headers: {
                "Authorization": "Basic " + btoa(user.email + ":" + user.password),
                "Content-Type": "application/json"
            }
        }).catch(e => console.log(e))
    }

    function deleteUser(index){
        fetch("http://localhost:8080/user/" + index, {
            method: "DELETE",
            headers: {"Authorization": "Basic " + btoa(user.email + ":" + user.password)}
        }).catch(e => console.log(e))
    }

    return (
        <table className="entities-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.filter((u) => u.email !== user.email).map((user, i) => toTableRow(user, i + 1))}
            </tbody>
        </table>
    );
}

export default Users;