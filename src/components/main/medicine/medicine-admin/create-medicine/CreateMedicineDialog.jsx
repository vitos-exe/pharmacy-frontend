import CreateMedicineForm from "./CreateMedicineForm";

function CreateMedicineDialog(props){
    return (
        <div className="medicine-create-dialog">
            <div className="medicine-create-dialog-header">
                <h2>Add new medicine</h2>
                <button onClick={props.closeDialog} className="dialog-close">X</button>
            </div>
            <CreateMedicineForm closePopUp={props.closeDialog}/>
        </div>
    );
}

export default CreateMedicineDialog;