import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import OrderInfoDialog from "../OrderInfoDialog";

function AdminOrders(){
    const [orders, setOrders] = useState([]);
    const [infoDialogData, setInfoDialogData] = useState(null);
    const [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false);
    const {user} = useContext(AppContext);

    useEffect(() => {
        async function fetchOrders(){
            const json = await fetch("http://localhost:8080/order/", {headers: {
                "Authorization": "Basic " + btoa(user.email + ":" + user.password)
            }}).then(r => r.json());
            setOrders(json);
        }
        fetchOrders();
    });

    function toTableRow(order, index){
        return (
        <tr key={index}>
            <td>{order.id}</td>
            <td>{formatTime(new Date(order.create_time))}</td>
            <td>{order.status[0].toUpperCase() + order.status.slice(1)}</td>
            <td className="action-column">
                <button className="change-status-button" onClick={() => changeStatus(index, order.status)}>Change status</button>
                <button className="order-details-button" onClick={() => {
                    if (!infoDialogData) {
                        setInfoDialogData(order);
                    }
                }}>More info</button>
                {/*{!infoDialogIsOpen && <OrderInfoDialog data={order} closeDialog={() => setInfoDialogIsOpen(false)}/>}*/}
            </td>
        </tr>)
    }

    function changeStatus(i, prevStatus){
        fetch("http://localhost:8080/order/" + i, {
            method: "PUT",
            body: JSON.stringify({
                status: prevStatus === 'pending' ? 'delivered' : 'pending'
            }),
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(user.email + ":" + user.password)
            }
        }).catch(e => console.log(e));
    }

    function formatTime(date){
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    return (
        <>
            <table className="entities-table">
                <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.sort((a, b) => a.id - b.id).map((order, i) => toTableRow(order, order.id))}
                </tbody>
            </table>
            {infoDialogData && <OrderInfoDialog data={infoDialogData} closeDialog={() => setInfoDialogData(null)}/>}
        </>
    );
}

export default AdminOrders;