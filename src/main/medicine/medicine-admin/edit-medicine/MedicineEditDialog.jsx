import MedicineEditForm from "./MedicineEditForm";

function MedicineEditDialog(props){
    return (
        <div className="medicine-edit-dialog">
            <div className="medicine-edit-dialog-header">
                <h2>Edit medicine</h2>
                <button onClick={props.closeDialog} className="dialog-close">X</button>
            </div>
            <MedicineEditForm data={props.data} closeDialog={props.closeDialog}/>
        </div>
    );
}

export default MedicineEditDialog;