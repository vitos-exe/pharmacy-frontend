import LoginForm from "./LoginForm";

function LoginDialog(props){
    return (
        <div className="login-dialog">
            <div className="login-dialog-header">
                <h2>Log in</h2>
                <button onClick={props.closeDialog} className="dialog-close">X</button>
            </div>
            <LoginForm closeDialog={props.closeDialog}/>
        </div>
    );
}

export default LoginDialog;