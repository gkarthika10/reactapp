import React, { useState, useEffect } from "react";
import "../../styles/Auth.css";
import { Link } from "react-router-dom";

// React-Bootstrap
import { Modal, Offcanvas } from "react-bootstrap";

// Helpers
import { toastError } from "../../helpers/Notification";
import { ScaleLoader } from "react-spinners";

// Redux Stuff
import { STATUSES } from "../../App";
import { signupUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Signup = ({
  showSignupModal,
  handleSignupModalClose,
  showSignupSidebar,
  handleSignupSidebarClose,
  handleLoginModalOpen,
  handleLoginSidebarOpen,
}) => {
  return (
    <>
      {/* For DESKTOP */}
      <Modal className="authModal" show={showSignupModal} onHide={handleSignupModalClose} centered>
        <Modal.Body>
          <h4 className="modal__heading">
            Join to <span>Know Your Worth.</span>
          </h4>
          <SignupForm
            deviceType="desktop"
            handleSignupModalClose={handleSignupModalClose}
            handleSignupSidebarClose={handleSignupSidebarClose}
            handleLoginModalOpen={handleLoginModalOpen}
            handleLoginSidebarOpen={handleLoginSidebarOpen}
          />
        </Modal.Body>
        <Modal.Footer>
          <span>Already a Member?</span>
          <Link
            to="#"
            onClick={() => {
              handleSignupModalClose();
              setTimeout(() => {
                handleLoginModalOpen();
              }, 500);
            }}
          >
            Sign In
          </Link>
        </Modal.Footer>
      </Modal>

      {/* For MOBILE */}
      <Offcanvas className="authModal" show={showSignupSidebar} onHide={handleSignupSidebarClose} placement="bottom">
        <Offcanvas.Header className="pb-0" closeButton>
          <Offcanvas.Title className="invisible">Sign Up</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h4 className="modal__heading mobile__heading" style={{ marginTop: -2 }}>
            Join <span>Know Your Worth.</span>
          </h4>

          <div className="mt-3 px-1">
            <SignupForm
              deviceType="mobile"
              handleSignupModalClose={handleSignupModalClose}
              handleSignupSidebarClose={handleSignupSidebarClose}
              handleLoginModalOpen={handleLoginModalOpen}
              handleLoginSidebarOpen={handleLoginSidebarOpen}
            />
          </div>

          <div className="offcanvas__footer">
            <span>Already a Member?</span>
            <Link
              to="#"
              onClick={() => {
                handleSignupSidebarClose();
                setTimeout(() => {
                  handleLoginSidebarOpen();
                }, 500);
              }}
            >
              Sign In
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const SignupForm = ({
  deviceType,
  handleSignupModalClose,
  handleSignupSidebarClose,
  handleLoginModalOpen,
  handleLoginSidebarOpen,
}) => {
  const signup_data_initial = {
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    email: "",
    confirm_password: "",
  };

  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  const [data, setData] = useState(signup_data_initial);

  const [signUpStatus, setSignUpStatus] = useState(STATUSES.IDLE);
  useEffect(() => setSignUpStatus(status), [status]);

  const HandleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    if (data?.password !== data?.confirm_password) {
      toastError("Password & Confirm Password Must Match!");
      return;
    }

    if (signUpStatus !== STATUSES.LOADING) {
      dispatch(
        signupUser(data, "C", () => {
          setData(signup_data_initial);

          if (deviceType === "mobile") {
            handleSignupSidebarClose();
            setTimeout(() => handleLoginSidebarOpen(), 1000);
          } else {
            handleSignupModalClose();
            setTimeout(() => handleLoginModalOpen(), 1000);
          }
        })
      );
    }
  };

  return (
    <form className="mt-2 mx-3" name="userSignupForm" onSubmit={HandleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="first_name"
          name="first_name"
          value={data.first_name}
          onChange={HandleChange}
          placeholder="First Name"
          onInvalid={(e) => e.target.setCustomValidity("First Name is Required!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="last_name"
          name="last_name"
          value={data.last_name}
          onChange={HandleChange}
          placeholder="Last Name"
          onInvalid={(e) => e.target.setCustomValidity("Last Name is Required!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={data.email}
          onChange={HandleChange}
          placeholder="Email Address"
          onInvalid={(e) => e.target.setCustomValidity("Please Enter Valid Email Address!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="tel"
          className="form-control"
          id="phone"
          name="phone"
          value={data.phone}
          onChange={HandleChange}
          placeholder="Contact No."
          onInvalid={(e) => e.target.setCustomValidity("Enter Valid Contact Number!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          minLength={8}
          value={data.password}
          onChange={HandleChange}
          placeholder="Password"
          onInvalid={(e) => e.target.setCustomValidity("Create Minimum 8 Length Password!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          id="confirm_password"
          name="confirm_password"
          minLength={8}
          placeholder="Confirm Password"
          value={data.confirm_password}
          onChange={HandleChange}
          onInvalid={(e) => e.target.setCustomValidity("Must Match With Password!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-2">
        <button
          type="submit"
          className="btn custom__btn d-flex justify-content-center align-content-center"
          disabled={signUpStatus === STATUSES.LOADING ? true : false}
        >
          {signUpStatus === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Submit"}
        </button>
      </div>
      <div className="pt-1">
        <p className="policy__line">
          By joining I agree to receive emails from <span>Know Your Worth</span>.
        </p>
      </div>
    </form>
  );
};

export default Signup;
