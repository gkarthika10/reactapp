import React, { useState } from "react";
import "../../styles/Auth.css";
import { useParams, useNavigate } from "react-router-dom";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { registerTeamMember } from "../../store/authSlice";

// Helpers
import { toastError } from "../../helpers/Notification";
import { STATUSES } from "../../App";
import { ScaleLoader } from "react-spinners";

// change password initial
const register_member_initial = {
  first_name: "",
  last_name: "",
  mobile_phone: "",
  password: "",
  confirm_password: "",
};

const RegisterTeamMember = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const dispatch = useDispatch();
  const { status: registerStatus } = useSelector((state) => state.auth);

  const [memberInfo, setMemberInfo] = useState(register_member_initial);

  // handle register team member inputs change
  const HandleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setMemberInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // validate register team member inputs
  const isValidate = () => {
    let result = false;
    const { first_name, last_name, mobile_phone, password, confirm_password } = memberInfo;

    if (first_name?.trim() && last_name?.trim() && mobile_phone?.trim() && password?.trim() && confirm_password?.trim())
      result = true;
    return result;
  };

  // handle register team member submit
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (!isValidate()) {
      toastError("Please provide valid details!");
      return;
    } else if (memberInfo?.password !== memberInfo?.confirm_password) {
      toastError("Password not Matched!");
      return;
    }

    dispatch(
      registerTeamMember(token, memberInfo, () => {
        navigate("/");
      })
    );
    setTimeout(() => {
      if (registerStatus === STATUSES.IDLE) setMemberInfo(register_member_initial);
    }, 1000);
  };

  return (
    <div className="container my-md-5 my-4 authModal">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8 col-12">
          <div className="registerTeamMember__box">
            <h4 className="form__heading">Register Team Member</h4>
            <form name="registerTeamMember" onSubmit={HandleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="first_name"
                  name="first_name"
                  value={memberInfo.first_name}
                  onChange={HandleChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={memberInfo.last_name}
                  onChange={HandleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="mobile_phone"
                  name="mobile_phone"
                  minLength={10}
                  value={memberInfo.mobile_phone}
                  onChange={HandleChange}
                  placeholder="Phone"
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
                  value={memberInfo.password}
                  onChange={HandleChange}
                  placeholder="Password"
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
                  value={memberInfo.confirm_password}
                  onChange={HandleChange}
                  placeholder="Confirm Password"
                  required
                />
              </div>
              <div className="mb-3">
                <p className="password__hint__line">
                  8 characters or longer. Combine upper and lowercase letters and numbers.
                </p>
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn custom__btn d-flex justify-content-center align-content-center"
                  disabled={registerStatus === STATUSES.LOADING ? true : false}
                >
                  {registerStatus === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeamMember;
