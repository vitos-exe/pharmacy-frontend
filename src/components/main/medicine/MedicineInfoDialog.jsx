function MedicineInfoDialog(props){
    return (
        <div className="medicine-info-dialog">
            <div className="dialog-top"></div>
            <h2 className="main-info-name">{props.data.name}</h2>
            <p className="info-field">Price: ${props.data.price}</p>
            <p className="info-field">Quantity: {props.data.quantity}</p>
            <p className="info-field">Description: {props.data.description}</p>
            <button className="close-button" onClick={props.closeDialog}>Close</button>
         </div>
    );
}

export default MedicineInfoDialog;