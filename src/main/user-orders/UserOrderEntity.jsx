import { useState } from "react";
import OrderInfoDialog from "../OrderInfoDialog";

function UserOrderEntity(props){
    function getFormattedDate(date){
        date = new Date(date);
        return [date.getFullYear(), date.getMonth(), date.getDate()].join("-");
    }

    const [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false);

    return (
        <div className="grid-entity">
            <div className="entity-info">
                <div className="main-info-field">Order {props.data.id}</div>
                <div className="info-field">{getFormattedDate(props.data.create_time)}</div>
                <div className="info-field">{props.data.status[0].toUpperCase()+ props.data.status.slice(1)}</div>
            </div>
            <div className="entity-buttons">
                <button className="order-details-button" onClick={() => setInfoDialogIsOpen(true)}>More info</button>
            </div>
            {infoDialogIsOpen && <OrderInfoDialog data={props.data} closeDialog={() => setInfoDialogIsOpen(false)}/>}
        </div>
    );
}

export default UserOrderEntity;