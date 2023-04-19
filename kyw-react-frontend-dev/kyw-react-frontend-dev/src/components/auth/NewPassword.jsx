import React, { useState } from "react";
import "../../styles/Auth.css";
import { useParams, useNavigate } from "react-router-dom";

// Redux Stuff
import { useDispatch } from "react-redux";
import { changePassword } from "../../store/authSlice";

// change password initial
const reset_password_initial = {
  new_password: "",
  confirm_password: "",
};

const NewPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [data, setData] = useState(reset_password_initial);

  // handle change password inputs
  const HandleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handle change password submit
  const HandleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      changePassword(token, data, () => {
        navigate("/");
      })
    );
    setTimeout(() => {
      setData(reset_password_initial);
    }, 1000);
  };

  return (
    <div className="container my-md-5 my-4 authModal">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8 col-12">
          <div className="newPasswordForm__box">
            <h4 className="form__heading">Reset Password</h4>
            <form name="newPasswordForm" onSubmit={HandleSubmit}>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="new_password"
                  name="new_password"
                  minLength={8}
                  value={data.new_password}
                  onChange={HandleChange}
                  placeholder="New Password"
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
                  value={data.confirm_password}
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
                <button type="submit" className="btn custom__btn">
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
