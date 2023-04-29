import { useState } from "react";
import DemandlistDialog from "./DemandListDialog";
import CreateMedicineDialog from "./create-medicine/CreateMedicineDialog";

function MedicineAdminButtons(){
    const [demandListDialogIsOpen, setdemandListDialogIsOpen] = useState(false);
    const [createMedicineDialogIsOpen, setCreateMedicineDialogIsOpen] = useState(false);

    function dialogIsClosed(){
        return !(demandListDialogIsOpen || createMedicineDialogIsOpen);
    }

    return (
        <div className="medicine-buttons">
            <button className="add-medicine-botton" onClick={() => dialogIsClosed() && setCreateMedicineDialogIsOpen(true)}>Add medicine</button>
            {createMedicineDialogIsOpen && <CreateMedicineDialog closeDialog={() => setCreateMedicineDialogIsOpen(false)}/>}
            <button className="demand-list-botton" onClick={() => dialogIsClosed() && setdemandListDialogIsOpen(true)}>Demand list</button>
            {demandListDialogIsOpen && <DemandlistDialog closeDialog={() => setdemandListDialogIsOpen(false)}/>}
        </div>
    );
}

export default MedicineAdminButtons;