import React, { useState, useEffect } from "react";
import "../../styles/Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

// React-Bootstrap
import { Modal, Offcanvas } from "react-bootstrap";

// Redux Stuff
import { STATUSES } from "../../App";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../store/authSlice";

const Login = ({
  showLoginModal,
  handleLoginModalClose,
  showLoginSidebar,
  handleLoginSidebarClose,
  handleSignupModalOpen,
  handleSignupSidebarOpen,
  handleResetPasswordModalOpen,
  handleResetPasswordSidebarOpen,
}) => {
  return (
    <>
      {/* For DESKTOP */}
      <Modal className="authModal" show={showLoginModal} onHide={handleLoginModalClose} centered>
        <Modal.Body>
          <h4 className="modal__heading">
            Sign In to <span>Know Your Worth.</span>
          </h4>
          <LoginForm
            deviceType="desktop"
            handleLoginModalClose={handleLoginModalClose}
            handleLoginSidebarClose={handleLoginSidebarClose}
            handleResetPasswordModalOpen={handleResetPasswordModalOpen}
            handleResetPasswordSidebarOpen={handleResetPasswordSidebarOpen}
          />
        </Modal.Body>
        <Modal.Footer>
          <span>Not a member yet?</span>
          <Link
            to="#"
            onClick={() => {
              handleLoginModalClose();
              setTimeout(() => {
                handleSignupModalOpen();
              }, 500);
            }}
          >
            Join Now
          </Link>
        </Modal.Footer>
      </Modal>

      {/* For MOBILE */}
      <Offcanvas className="authModal" show={showLoginSidebar} onHide={handleLoginSidebarClose} placement="bottom">
        <Offcanvas.Header className="pb-0" closeButton>
          <Offcanvas.Title className="invisible">Sign In</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h4 className="modal__heading mobile__heading">
            Sign In to <br />
            <span>Know Your Worth.</span>
          </h4>

          <div className="mt-5 px-1">
            <LoginForm
              deviceType="mobile"
              handleLoginModalClose={handleLoginModalClose}
              handleLoginSidebarClose={handleLoginSidebarClose}
              handleResetPasswordModalOpen={handleResetPasswordModalOpen}
              handleResetPasswordSidebarOpen={handleResetPasswordSidebarOpen}
            />
          </div>

          <div className="offcanvas__footer">
            <span>Not a member yet?</span>
            <Link
              to="#"
              onClick={() => {
                handleLoginSidebarClose();
                setTimeout(() => {
                  handleSignupSidebarOpen();
                }, 500);
              }}
            >
              Join Now
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const LoginForm = ({
  deviceType,
  handleLoginModalClose,
  handleLoginSidebarClose,
  handleResetPasswordModalOpen,
  handleResetPasswordSidebarOpen,
}) => {
  const login_data_initial = { email: "", password: "" };
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);

  const [data, setData] = useState(login_data_initial);
  const [userRole, setUserRole] = useState("C");
  const [rememberMe, setRememberMe] = useState(false);

  const [loginStatus, setLoginStatus] = useState(STATUSES.IDLE);
  useEffect(() => setLoginStatus(status), [status]);

  const HandleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (loginStatus !== STATUSES.LOADING) {
      dispatch(
        loginUser(data, userRole, (redirect_uri) => {
          setData(login_data_initial);

          if (deviceType === "mobile") handleLoginSidebarClose();
          else handleLoginModalClose();

          setTimeout(() => navigate(redirect_uri), 500);
        })
      );
    }
  };

  const HandleRememberMe = (e) => {
    if (rememberMe) setRememberMe(false);
    else setRememberMe(true);
  };

  return (
    <form className="mx-3" name="userLoginForm" onSubmit={HandleSubmit}>
      <div className="input-group mt-4 mb-3 justify-content-center user__role">
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="user_role"
            id="candidateId"
            value="C"
            onChange={(e) => setUserRole(e.target.value)}
            checked={userRole === "C" ? true : false}
          />
          <label className="form-check-label" htmlFor="candidateId">
            Candidate
          </label>
        </div>
        <div className="form-check ms-4">
          <input
            className="form-check-input"
            type="radio"
            name="user_role"
            id="employerId"
            value="E"
            onChange={(e) => setUserRole(e.target.value)}
            checked={userRole === "E" ? true : false}
          />
          <label className="form-check-label" htmlFor="employerId">
            Employer
          </label>
        </div>
      </div>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={data.email}
          onChange={HandleChange}
          placeholder="Email / Username"
          onInvalid={(e) => e.target.setCustomValidity("Your Registered Email is Required!")}
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
          value={data.password}
          onChange={HandleChange}
          placeholder="Password"
          onInvalid={(e) => e.target.setCustomValidity("Your Account Password is Required!")}
          onInput={(e) => e.target.setCustomValidity("")}
          required
        />
      </div>
      <div className="mb-3">
        <button
          type="submit"
          className="btn custom__btn d-flex justify-content-center align-content-center"
          disabled={loginStatus === STATUSES.LOADING ? true : false}
        >
          {loginStatus === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Continue"}
        </button>
      </div>

      <div className="remember__forgot__row mt-md-3 mt-4 d-flex align-items-center">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckChecked"
            onChange={HandleRememberMe}
            checked={rememberMe}
          />
          <label className="form-check-label ms-1" htmlFor="flexCheckChecked">
            Remember Me
          </label>
        </div>

        {deviceType === "mobile" ? (
          <Link
            to="#"
            onClick={() => {
              handleLoginSidebarClose();
              setTimeout(() => {
                handleResetPasswordSidebarOpen();
              }, 500);
            }}
          >
            Forgot Password?
          </Link>
        ) : (
          <Link
            to="#"
            onClick={() => {
              handleLoginModalClose();
              setTimeout(() => {
                handleResetPasswordModalOpen();
              }, 500);
            }}
          >
            Forgot Password?
          </Link>
        )}
      </div>
    </form>
  );
};

export default Login;
