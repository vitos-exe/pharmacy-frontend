import FormGroup from "../../../utils/FormGroup";
import { useState } from "react";
import { AppContext } from "../../../App";
import { useContext } from "react";
import { Link } from "react-router-dom";

function EditForm(props){
    const fields = ['name', 'email', 'address', 'password', 'confirm-password']

    const [formData, setFormData] = useState(
        Object.fromEntries(fields.map(field => [field, null]))
    );

    const {user, setUser} = useContext(AppContext);

    async function performAccountEdit(e){
        e.preventDefault();

        const filteredFormData = Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== null && value !== ''));

        if ('password' in filteredFormData &&
            'confirm-password' in filteredFormData &&
            filteredFormData['password'] !== filteredFormData['confirm-password'])
        {
            alert('Passwords don\'t match');
            return;
        }

        if (('password' in filteredFormData) ^ ('confirm-password' in filteredFormData)){
            alert("Enter both passwords");
            return; 
        }

        const confirmPassword = 'confirm-password';
        const {[confirmPassword]: _, ...json} = filteredFormData;

        const response = await fetch('http://localhost:8080/user/' + user.id, {
            method: "PUT",
            body: JSON.stringify(json),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Basic ' + btoa(user.email + ':' + user.password)
            }
        })

        if (response.status === 200){
            alert("User updated");
            if (filteredFormData["email"] !== null){
                setUser({...user, email: filteredFormData["email"]});
            }
            if (filteredFormData["password"] !== null){
                setUser({...user, password: filteredFormData["password"]});
            }
            props.closeDialog();
        }
        else{
            alert(await response.text());
        }

    }

    function deleteAccount(e){
        e.preventDefault();
        fetch("http://localhost:8080/user/" + user.id, {
            method: "DELETE",
            headers: {"Authorization": "Basic " +  btoa(user.email + ":" + user.password)}
        }).catch(e => console.log(e));
        setUser({
            role: "unauthorized",
            id: null,
            email: null,
            password: null
        });
    }

    return (
        <form className="user-edit-dialog-form" onSubmit={performAccountEdit}>
            {fields.map((field, i) => <FormGroup changeState={setFormData} field={field} required={false} key={i}/>)}
            <Link to="/" className="btn-delete" onClick={deleteAccount}>Delete</Link>
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default EditForm;