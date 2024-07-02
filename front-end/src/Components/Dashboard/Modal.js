import React from 'react';
import './Modal.css'; 

const Modal = ({ show, handleClose, children }) => {
  return (
    <div className={`modal ${show ? 'display-block' : 'display-none'}`}>
      <section className="modal-main">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        {children}
      </section>
    </div>
  );
};

export default Modal;