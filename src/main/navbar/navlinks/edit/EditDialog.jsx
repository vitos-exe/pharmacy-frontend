import EditForm from "./EditForm";

function EditDialog(props){
    return (
        <div className="user-edit-dialog">
            <div className="user-edit-dialog-header">
                <h2>Edit account</h2>
                <button onClick={props.closeDialog} className="dialog-close">X</button>
            </div>
            <EditForm closeDialog={props.closeDialog}/>
        </div>
    );
}

export default EditDialog;