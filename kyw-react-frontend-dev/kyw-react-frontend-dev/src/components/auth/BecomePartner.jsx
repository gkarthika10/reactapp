import React, { useState, useEffect } from "react";
import "../../styles/Home.css";
import "../../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { CompaniesBanner } from "../../pages/Home";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCountries } from "../../store/commonSlice";
import { signupUser } from "../../store/authSlice";

// Media & Icons
import FileIcon from "../../media/icons/file.png";
import EmailIcon from "../../media/icons/email.png";
import GetPaidIcon from "../../media/icons/get-paid.png";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";
import { toastError } from "../../helpers/Notification";
import { ScaleLoader } from "react-spinners";
import { STATUSES } from "../../App";

// register employer initial
const register_employer_initial = {
  company_name: "",
  company_website: "",
  company_type: "Service Based",
  company_number_of_employees: "",
  office_city: "",
  office_country: "India",
  office_zipcode: "",
  representative_first_name: "",
  representative_last_name: "",
  representative_contact: "",
  representative_email: "",
  password: "",
  confirm_password: "",
};

const BecomePartner = ({ handleLoginModalOpen }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const countries_list = useSelector((state) => state.common.countries);
  const { status: register_status } = useSelector((state) => state.auth);

  const [data, setData] = useState({ ...register_employer_initial });

  // get countries & maintain
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);
  useEffect(() => {
    setCountries(countries_list);
  }, [countries_list]);

  // if user logged in then restrict him to visit this page
  // this page should only be visited to logged out user
  useEffect(() => {
    if (isAuthenticated()?.userType === "C") navigate("/resume-parse");
    else if (isAuthenticated()?.userType === "E") navigate("/role-based-auctions");
  }, [navigate]);

  // handling onChange for form input fields
  const HandleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handling submission of form
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (data?.password !== data?.confirm_password) {
      toastError("Password & Confirm Password Must Match!");
      return;
    }

    const dataToBeSubmit = {
      name: data?.company_name?.trim(),
      website: data?.company_website?.trim(),
      billing_address: `${data?.office_city?.trim()}, ${data?.office_country?.trim()}, ${data?.office_zipcode?.trim()}`,
      type: data?.company_type?.trim(),
      number_of_employees: data?.company_number_of_employees,
      first_name: data?.representative_first_name?.trim(),
      last_name: data?.representative_last_name?.trim(),
      mobile_phone: data?.representative_contact,
      email: data?.representative_email?.trim(),
      password: data?.password,
    };

    for (let key in dataToBeSubmit) {
      if (dataToBeSubmit[key] === "") {
        toastError("Provide Valid Information!");
        return false;
      }
    }

    console.log(dataToBeSubmit);
    dispatch(
      signupUser(dataToBeSubmit, "E", () => {
        setData(register_employer_initial);
        handleLoginModalOpen();
      })
    );
  };

  return (
    <div className="become__partner__box">
      {/* Become Partner Banner */}
      <div className="partner__banner__box">
        <div className="partner__inner__box">
          <h2 className="partner__heading">Work Your Way</h2>
          <p className="partner__slogan">Looking For The Best Employees? We Have Them...</p>
          <button className="btn custom__btn w-auto px-5" onClick={() => window.scrollTo(0, 500)}>
            Become Partner
          </button>
        </div>
      </div>
      {/* Growing A Business Means Having The Right People In Your Team 
            Looking For The Best Employees? We Have Them... */}

      {/* Registration Form */}
      <div className="container py-5 registration__form__box">
        <div className="row">
          <h3 className="modal__heading">
            Join <span>Know Your Worth.</span>
          </h3>
          <p className="subheading mb-4">All fields are mandatory</p>
        </div>
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <form name="registerEmployerForm" onSubmit={HandleSubmit}>
              {/* Employer Information */}
              <div className="row">
                <h6 className="mt-1 mb-3">Employer Information.</h6>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      name="company_name"
                      placeholder="Company Name"
                      value={data.company_name}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Company Name is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="url"
                      className="form-control"
                      id="company_website"
                      name="company_website"
                      placeholder="Website URL"
                      value={data.company_website}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Please Enter Valid URL!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <select
                      className="form-select"
                      onChange={HandleChange}
                      aria-label="Company Type"
                      id="company_type"
                      name="company_type"
                      value={data.company_type}
                    >
                      <option defaultValue={"Company Type"} disabled>
                        Company Type
                      </option>
                      <option value="Service Based">Service Based</option>
                      <option value="Product Based">Product Based</option>
                      <option value="IT">IT</option>
                      <option value="Banking">Banking</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="company_number_of_employees"
                      name="company_number_of_employees"
                      placeholder="Company Size (Approx.)"
                      min="1"
                      value={data.company_number_of_employees}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Approx. Size of Company is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="row">
                <h6 className="my-3">Headquarter Address.</h6>
                <div className="col-md-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="office_city"
                      name="office_city"
                      placeholder="City"
                      value={data.office_city}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("City of Headquarter Office is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <select
                      className="form-select"
                      aria-label="Office Country"
                      id="office_country"
                      name="office_country"
                      value={data.office_country}
                      onChange={HandleChange}
                      required
                    >
                      <option defaultValue={"Select Country"} disabled key={"Select Country"}>
                        Select Country
                      </option>
                      {[...countries].map((country, idx) => {
                        return (
                          <option key={`country_${country?.cioc}_${idx}`} value={country?.name?.common}>
                            {country?.name?.common}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="office_zipcode"
                      name="office_zipcode"
                      placeholder="Postal Code"
                      value={data.office_zipcode}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Postal Code of Headquarter Office is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Representative Contact */}
              <div className="row">
                <h6 className="my-3">Representative Contact.</h6>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="representative_first_name"
                      name="representative_first_name"
                      placeholder="First Name"
                      value={data.representative_first_name}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Representative's First Name is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="representative_last_name"
                      name="representative_last_name"
                      placeholder="Last Name"
                      value={data.representative_last_name}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Representative's Last Name is Required!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      id="representative_contact"
                      name="representative_contact"
                      placeholder="Contact No."
                      value={data.representative_contact}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Please Enter Valid Contact Number!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="representative_email"
                      name="representative_email"
                      placeholder="Email Address"
                      value={data.representative_email}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Please Enter a Valid Email Address!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="row">
                <h6 className="my-3">Create Password.</h6>
                <div className="col-md-6">
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      minLength={8}
                      value={data.password}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Create Minimum 8 Length Strong Password!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      minLength={8}
                      value={data.confirm_password}
                      onChange={HandleChange}
                      onInvalid={(e) => e.target.setCustomValidity("Must Match With Password!")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn custom__btn d-flex justify-content-center align-content-center"
                      disabled={register_status === STATUSES.LOADING ? true : false}
                    >
                      {register_status === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="how__it__works py-5 px-4">
        <div className="container-lg">
          <div className="row">
            <h5 className="howItWorks__heading mb-4">How it Works</h5>
          </div>
          <div className="row mt-3">
            <div className="col-lg-4 col-md-6 mt-lg-0 mt-md-3 mt-2">
              <div className="howItWorks__item">
                <img src={FileIcon} alt="How-It-Works-Item" />
                <h5>1. Create a Gig</h5>
                <p>Sign up for free, set up your Gig, and offer your work to our global audience.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mt-lg-0 mt-md-3 mt-2">
              <div className="howItWorks__item">
                <img src={EmailIcon} alt="How-It-Works-Item" />
                <h5>2. Deliver Great Work</h5>
                <p>Get notified when you get an order and use our system to discuss details with customers.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mt-lg-0 mt-md-3 mt-2">
              <div className="howItWorks__item">
                <img src={GetPaidIcon} alt="How-It-Works-Item" />
                <h5>3. Get Paid</h5>
                <p>Get paid on time, every time. Payment is transferred to you upon order completion.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Banner */}
      <div className="company_box">
        <CompaniesBanner />
      </div>
    </div>
  );
};

export default BecomePartner;
