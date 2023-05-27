import { useContext, useState } from "react";
import { AppContext } from "../../App";
import MedicineInfoDialog from "./MedicineInfoDialog";
import MedicineEditDialog from "./medicine-admin/edit-medicine/MedicineEditDialog";

function MedicineEntity(props){
    const {user, orderItems, setOrderItems} = useContext(AppContext);
    const [infoDialogIsOpen, setInfoDialogIsOpen] = useState(false);
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

    function dialogIsClosed(){
        return !(infoDialogIsOpen || editDialogIsOpen);
    }

    function addOrderItem(){
        if (!(orderItems.filter(item => item.name === props.data.name).length > 0)){
            setOrderItems([...orderItems, {name: props.data.name, quantity: 1}]);
        }
    }

    return (
        <div className="grid-entity">
            <div className="entity-info">
                <div className="main-info-field">{props.data.name}</div>
                <div className="info-field">{props.data.price + '$'}</div>
            </div>
            <div className="entity-buttons">
                <button className="more-info-button" onClick={() => dialogIsClosed() && setInfoDialogIsOpen(true)}>More info</button>
                {
                    (user.role === "user" && 
                    <button className="add-to-order-button" onClick={addOrderItem}>Add to order</button>) ||
                    (user.role === 'admin' &&
                    <button className="edit-button" onClick={() => dialogIsClosed() && setEditDialogIsOpen(true)}>Edit button</button>)
                }
            </div>
            {
                infoDialogIsOpen && 
                <MedicineInfoDialog data={props.data} closeDialog={() => setInfoDialogIsOpen(false)}/>
            }
            {
                editDialogIsOpen &&
                <MedicineEditDialog data={props.data} closeDialog={() => setEditDialogIsOpen(false)}/>
            }
        </div>
    )
}

export default MedicineEntity;