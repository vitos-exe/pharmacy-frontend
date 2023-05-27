import SignupForm from "./SignupForm";

function SignupDialog(props){
    return (
        <div className="user-create-dialog">
            <div className="user-create-dialog-header">
                <h2>Create new account</h2>
                <button onClick={props.closeDialog} className="dialog-close">X</button>
            </div>
            <SignupForm closePopUp={props.closeDialog}/>
        </div>
    );
}

export default SignupDialog;