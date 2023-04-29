import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../../App";

function DemandlistDialog(props){
    const [demandList, setDemandList] = useState([]);
    const {user} = useContext(AppContext);
    
    useEffect(() => {
        async function fetchDemandingMedicine(){
            const json = await fetch("http://localhost:8080/medicine/demand", {headers:{
                'Authorization': 'Basic ' + btoa(user.email + ':' + user.password)
            }}).then(r => r.json())
            setDemandList(json);
        }
        fetchDemandingMedicine();
    });

    function toTableRow(data, i){
        return (
            <tr key={i}>
                <td>{data.name}</td>
                <td>{data.quantity} units</td>
            </tr>
        );
    }

    return (
        <div className="demand-list-dialog">
            <div className="dialog-top"></div>
                <table>
                    <tbody>
                        {demandList.map((entry, i) => toTableRow(entry, i))}
                    </tbody>
                </table>
                <button className="close-button" onClick={props.closeDialog}>Close</button>
        </div>
    );
}

export default DemandlistDialog;