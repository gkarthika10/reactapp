import React, { useState } from "react";
import "../../styles/Auth.css";
import { Link } from "react-router-dom";

// React-Bootstrap
import { Modal, Offcanvas } from "react-bootstrap";

// Helpers
import { ScaleLoader } from "react-spinners";

// Redux Stuff
import { STATUSES } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/authSlice";

const ResetPassword = ({
  showResetPasswordModal,
  showResetPasswordSidebar,
  handleResetPasswordModalClose,
  handleResetPasswordSidebarClose,
  handleLoginModalOpen,
  handleLoginSidebarOpen,
}) => {
  return (
    <>
      {/* For DESKTOP */}
      <Modal className="authModal" show={showResetPasswordModal} onHide={handleResetPasswordModalClose} centered>
        <Modal.Body>
          <h4 className="modal__heading">Reset Password</h4>
          <ResetPasswordForm
            deviceType="desktop"
            handleResetPasswordModalClose={handleResetPasswordModalClose}
            handleResetPasswordSideberClose={handleResetPasswordSidebarClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Link
            to="#"
            onClick={() => {
              handleResetPasswordModalClose();
              setTimeout(() => {
                handleLoginModalOpen();
              }, 500);
            }}
          >
            Back to Sign In
          </Link>
        </Modal.Footer>
      </Modal>

      {/* For MOBILE */}
      <Offcanvas
        className="authModal"
        show={showResetPasswordSidebar}
        onHide={handleResetPasswordSidebarClose}
        placement="bottom"
      >
        <Offcanvas.Header className="pb-0" closeButton>
          <Offcanvas.Title className="invisible">Reset</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h4 className="modal__heading mobile__heading">Reset Password</h4>

          <div className="mt-5 px-1">
            <ResetPasswordForm
              deviceType="mobile"
              handleResetPasswordModalClose={handleResetPasswordModalClose}
              handleResetPasswordSideberClose={handleResetPasswordSidebarClose}
            />
          </div>

          <div className="offcanvas__footer">
            <Link
              to="#"
              onClick={() => {
                handleResetPasswordSidebarClose();
                setTimeout(() => {
                  handleLoginSidebarOpen();
                }, 500);
              }}
            >
              Back to Sign In
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const ResetPasswordForm = ({ deviceType, handleResetPasswordModalClose, handleResetPasswordSidebarClose }) => {
  const dispatch = useDispatch();
  const { status: resetStatus } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const HandleChange = (e) => setEmail(e.target.value);

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (resetStatus !== STATUSES.LOADING) {
      dispatch(
        forgotPassword(email, () => {
          if (deviceType === "mobile") handleResetPasswordSidebarClose();
          else handleResetPasswordModalClose();
        })
      );
    }
  };

  return (
    <form className="mx-3" name="userLoginForm" onSubmit={HandleSubmit}>
      <div className="mt-0">
        <p className="reset__password__desc">
          Please enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <div className="mt-4 mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={email}
          onChange={HandleChange}
          placeholder="Enter your email"
          onInvalid={(e) => e.target.setCustomValidity("Please Enter a Valid Email Address!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-2">
        <button
          type="submit"
          className="btn custom__btn d-flex justify-content-center align-content-center"
          disabled={resetStatus === STATUSES.LOADING ? true : false}
        >
          {resetStatus === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
