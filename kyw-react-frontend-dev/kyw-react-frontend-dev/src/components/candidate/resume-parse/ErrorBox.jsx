import React from "react";
import ReactModal from "react-modal";

// Media & Icons
import { FiX } from "react-icons/fi";

// Styles
const MODAL_STYLES = {
  CLOSE_BTN: {
    border: "2px solid #aaa",
    borderRadius: "50%",
    padding: "5px",
    fontSize: 30,
    cursor: "pointer",
  },
  HEADING: {
    fontSize: "1.3rem",
    color: "#003815"
  },
  LIST_ITEM: {
    fontWeight: 700,
    fontSize: "1.05rem",
  },
  QUES_LINE: {
    marginLeft: 3,
    fontSize: "1.05rem",
  },
  ANS_LINE: {
    fontSize: "0.92rem",
    marginLeft: 3,
    fontWeight: 500,
    color: "rgba(0,0,0,0.7)",
  },
};

ReactModal.setAppElement("#root");
const ErrorBox = ({ isOpen, onClose, errors }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      preventScroll={true}
      shouldFocusAfterRender={true}
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
        content: {
          position: "absolute",
          top: "15%",
          left: "10%",
          right: "10%",
          bottom: "15%",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "0px",
          outline: "none",
          padding: "20px",
        },
      }}
    >
      <div className="d-flex justify-content-end">
        <FiX style={MODAL_STYLES.CLOSE_BTN} onClick={onClose} />
      </div>
      <div className="px-lg-4">
        <p style={MODAL_STYLES.HEADING}>Errors</p>
        <ol>
          {[...errors].map((error, idx) => {
            return (
              <li style={MODAL_STYLES.LIST_ITEM} key={`error_${idx}`}>
                <h6 style={MODAL_STYLES.QUES_LINE}>{error?.ques}</h6>
                <p style={MODAL_STYLES.ANS_LINE}>{error?.ans}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </ReactModal>
  );
};

export default ErrorBox;
