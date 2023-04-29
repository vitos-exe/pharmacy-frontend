import FormGroup from "../../../../FormGroup";
import { useState, useContext } from "react";
import { AppContext } from "../../../../App";
import { MedicineContext } from "../../Medicine";

function CreateMedicineForm(props){
    const {user} = useContext(AppContext);
    const {setMedicine} = useContext(MedicineContext);

    const fields = ['name', 'price', 'quantity', 'description']

    const [formData, setFormData] = useState(
        Object.fromEntries(fields.map(field => [field, null]))
    );

    async function performMedicineCreateSubmit(e){
        e.preventDefault();

        const response = await fetch('http://localhost:8080/medicine/', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json", 
                'Authorization': 'Basic ' + btoa(user.email + ':' + user.password)
            }
        })

        if (response.status === 201){
            alert("Medicine created");
            const json = await response.json();
            setMedicine((prev) => [...prev, json]);
        }
        else{
            alert(response.status + await response.text());
        }

        props.closePopUp();
    }

    return (
        <form className="user-create-dialog-form" onSubmit={performMedicineCreateSubmit}>
            {fields.map((field, i) => <FormGroup changeState={setFormData} field={field} required={true} key={i}/>)}
            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
}

export default CreateMedicineForm;