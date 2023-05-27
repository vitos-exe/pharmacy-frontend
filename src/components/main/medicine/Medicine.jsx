import MedicineEntity from "./MedicineEntity";
import { useState, useEffect, useContext, createContext } from "react";
import { AppContext } from "../../App";
import MedicineAdminButtons from "./medicine-admin/MedicineAdminButtons";

export const MedicineContext = createContext();

export function Medicine(){
    const [medicine, setMedicine] = useState([]);
    const {user} = useContext(AppContext);

    useEffect(() => {
        async function fetchMedicine(){
            const json = await fetch("http://localhost:8080/medicine/").then(r => r.json());
            setMedicine(json);
        }
        fetchMedicine();
    });

    return (
        <MedicineContext.Provider value={{medicine, setMedicine}}>
            {user.role === "admin" && <MedicineAdminButtons/>}
            <div className="entities-grid">
                {medicine.map((entry, i) => <MedicineEntity data={entry} key={i}/>)}
            </div>
        </MedicineContext.Provider>
    );
}

