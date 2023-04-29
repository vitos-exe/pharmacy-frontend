import { useState } from "react";
import LoginDialog from "./login/LoginDialog";
import SignupDialog from "./signup/SignupDialog";

function DefaultNavLinks(){
    const [loginDialogIsOpened, setLoginDialogIsOpened] = useState(false);
    const [signupDialogIsOpened, setSignupDialogIsOpened] = useState(false);

    function dialogIsNotOpen(){
        return !(loginDialogIsOpened || signupDialogIsOpened);
    }

    return (
        <ul className="nav-links">
            <li onClick={() => dialogIsNotOpen() && setLoginDialogIsOpened(true)}>Log in</li>
            {loginDialogIsOpened && (<LoginDialog closeDialog={() => setLoginDialogIsOpened(false)}/>)}
            <li onClick={() => dialogIsNotOpen() && setSignupDialogIsOpened(true)}>Sign up</li>
            {signupDialogIsOpened && (<SignupDialog closeDialog={() => setSignupDialogIsOpened(false)}/>)}
        </ul>
    );
}

export default DefaultNavLinks;