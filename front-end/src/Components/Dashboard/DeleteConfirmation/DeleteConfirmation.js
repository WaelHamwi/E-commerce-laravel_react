import "./DeleteConfirmation.css";
import { DeleteHandleContext } from "../../../Context/DeleteHandler";
import { useContext } from "react";
export default function DeletConfirmation() {
    const handleDeleteFromContext=useContext(DeleteHandleContext);
    const setDetleteRecord=handleDeleteFromContext.setDetleteRecord;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Confirm Deletion</h2>
          <span className="close">&times;</span>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete this item?</p>
        </div>
        <div className="modal-footer">
        <button onClick={() => setDetleteRecord(false)} className="btn-cancel">Cancel</button>

          <button onClick={()=>setDetleteRecord(prev=>!prev)} className="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  );
}
