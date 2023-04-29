import { useEffect, useContext, useState } from "react";
import { AppContext } from "../../App";
import UserOrderEntity from "./UserOrderEntity";

function UserOrders(){
    const {user} = useContext(AppContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const json = await fetch("http://localhost:8080/order/my", {headers: {
                "Authorization": "Basic " + btoa(user.email + ":" + user.password)
            }}).then(r => r.json());
            setOrders(json);
        }
        fetchOrders();
    });

    return (
        <div className="entities-grid">
            {orders.map((order, i) => <UserOrderEntity data={order} key={i}/>)}
        </div>
    );
}

export default UserOrders;