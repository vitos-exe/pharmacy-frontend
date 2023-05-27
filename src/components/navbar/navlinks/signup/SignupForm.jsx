import FormGroup from "../../../utils/FormGroup";
import { useState } from "react";

function SignupForm(props){
    const fields = ['name', 'email', 'address', 'password', 'confirm-password']

    const [formData, setFormData] = useState(
        Object.fromEntries(fields.map(field => [field, null]))
    );

    async function performSignupSubmit(e){
        e.preventDefault();
        
        if (formData['password'] !== formData['confirm-password']){
            alert('Passwords don\'t match');
            return;
        }

        const confirmPassword = 'confirm-password';
        const {[confirmPassword]: _, ...json} = formData;

        const response = await fetch('http://localhost:8080/user/', {
            method: "POST",
            body: JSON.stringify(json),
            headers: {"Content-Type": "application/json"}
        })

        if (response.status === 201){
            alert("User created");
            props.closePopUp();
        }
        else{
            alert(await response.text());
        }
    }

    return (
        <form className="user-create-dialog-form" onSubmit={performSignupSubmit}>
            {fields.map((field, i) => <FormGroup changeState={setFormData} field={field} required={true} key={i}/>)}
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default SignupForm;