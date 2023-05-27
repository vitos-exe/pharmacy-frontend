import cart from "../../assets/cart.png"
import { AppContext } from "../App";
import { useContext } from "react";
import {Navigate} from "react-router-dom";

function Cart(){
    const {orderItems, setOrderItems, user} = useContext(AppContext);

    function incrementQuantity(i){
        setOrderItems(orderItems.map((item, j) => {
            if (j === i){
                item.quantity += 1;
            }
            return item;
        }));
    }

    function toMedicineRow(orderItem, i){
        return (
            <div className="medicine-row" key={i}>
                <label htmlFor={orderItem.name}>{orderItem.name}</label>
                <input type="number" id={orderItem.name} name={orderItem.name} 
                    min={0} value={orderItem.quantity} onChange={() => {incrementQuantity(i)}}/>
            </div>
        );
    }

    async function makeOrder(e){
        e.preventDefault();
        const response = await fetch("http://localhost:8080/order/", {
            method: "POST",
            body: JSON.stringify({order_items: orderItems}),
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(user.email + ":" + user.password)
            }
        }).catch((e) => console.log(e));

        if (response.ok){
            alert("Order created");
            setOrderItems([]);

        }
        else if ([401, 403].includes(response.status)){
            alert(await response.text());
        }
    }

    return (
        <div className="cart-div">
            <img className="cart-img" src={cart} alt="Cart" />
            <form className="order-form" onSubmit={makeOrder}>
                <div className="dialog-top"></div>
                {(orderItems.length > 0 && orderItems.map((item, i) => toMedicineRow(item, i))) || 
                    <div className="medicine-row">No order items</div>}
                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
}

export default Cart;