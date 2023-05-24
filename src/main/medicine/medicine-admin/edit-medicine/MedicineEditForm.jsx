import FormGroup from "../../../../utils/FormGroup";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../../../App";
import { Link } from "react-router-dom";

function MedicineEditForm(props){
    const fields = ['name', 'price', 'quantity', 'description'];

    const {user} = useContext(AppContext);

    const [formData, setFormData] = useState(
        Object.fromEntries(fields.map(field => [field, null]))
    );

    async function performMedicineEdit(e){
        e.preventDefault();
        const fileteredFormData = Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== null && value !== ''));
        const response = await fetch('http://localhost:8080/medicine/' + props.data.id, {
            method: "PUT",
            body: JSON.stringify(fileteredFormData),
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Basic ' + btoa(user.email + ':' + user.password)
            }
        })

        if (response.status === 200){
            alert("Medicine updated");
        }
        else{
            alert(await response.text());
        }

        props.closeDialog();
    }

    function deleteMedicine(e){
        e.preventDefault();
        fetch("http://localhost:8080/medicine/" + props.data.id, {
            method: "DELETE",
            headers: {"Authorization": "Basic " +  btoa(user.email + ":" + user.password)}
        }).catch(e => console.log(e));
    }

    return (
        <form className="medicine-edit-dialog-form" onSubmit={performMedicineEdit}>
            {fields.map((field, i) => <FormGroup changeState={setFormData} field={field} required={false} key={i}/>)}
            <Link to="/" className="btn-delete" onClick={deleteMedicine}>Delete</Link>
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default MedicineEditForm;