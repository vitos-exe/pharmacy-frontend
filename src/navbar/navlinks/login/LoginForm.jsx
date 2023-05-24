import FormGroup from "../../../utils/FormGroup";
import { useState } from "react";
import { AppContext } from "../../../App";
import { useContext } from "react";

function LoginForm(props){
    const fields = ['email', 'password'];

    const [formData, setFormData] = useState(
        Object.fromEntries(fields.map(field => [field, null]))
    );

    const {setUser} = useContext(AppContext);

    async function performLoginSubmit(e){
        e.preventDefault();
        
        const response = await fetch('http://localhost:8080/user/me', {headers:{
            'Authorization': 'Basic ' + btoa(formData.email + ':' + formData.password)
        }});

        if (response.status === 200){
            const json = await response.json();
            setUser({
                role: json.role,
                id: json.id,
                email: formData.email,
                password: formData.password,
            });
            props.closeDialog();
        }
        else {
            alert(await response.text());
        }
    }

    return (
        <form className="login-dialog-form" onSubmit={performLoginSubmit}>
            {fields.map((field, i) => <FormGroup changeState={setFormData} field={field} required={true} key={i}/>)}
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default LoginForm;