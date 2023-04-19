import React, { useState, useEffect } from "react";

// Redux Stuff
import { useDispatch } from "react-redux";
import { updateCandidateProfile } from "../../../store/profileSlice";

// Media & Icons
import CandidateProfileImg from "../../../media/avatars/Candidate1.png";
import { BiEdit } from "react-icons/bi";

// Helpers
import { getLocalStorage } from "../../../helpers/LocalStorage";
import { getMonthString } from "../../../helpers/Utility";

// personal information initial data
// const personal_info_initial = {
//   first_name: "",
//   last_name: "",
//   email: "",
//   phone: "",
//   current_employer: "",
//   current_role: "",
//   dob: "",
//   current_address: {},
//   permanent_address: {},
// };
const preference_initial = {
  current_ctc: "",
  expected_role: "",
  total_experience: "",
  relevant_experience: "",
  notice_period: "",
};

// empty address initial data
const current_address_initial = {
  current_street: "",
  current_city: "",
  current_state: "",
  current_zipcode: "",
  current_country: "",
};
const permanent_address_initial = {
  permanent_street: "",
  permanent_city: "",
  permanent_state: "",
  permanent_zipcode: "",
  permanent_country: "",
};

const PersonalInformation = ({ profileInfo }) => {
  const dispatch = useDispatch();

  const { first_name, last_name, phone, email } = getLocalStorage("user") || {};
  const {
    current_role,
    current_employer,
    dob,
    current_address,
    current_ctc,
    expected_role,
    total_experience,
    relevant_experience,
    notice_period,
  } = profileInfo;

  // address info to show at section
  const getAddress = (address, info) => {
    try {
      const addr = address?.split(", ");
      switch (info) {
        case "street":
          return addr[0];
        case "city":
          return addr[1];
        case "state":
          return addr[2];
        case "country":
          return addr[3];
        case "zipcode":
          return addr[4];
        default:
          return "";
      }
    } catch (err) {
      return "";
    }
  };

  // get dob in user-friendly format
  const getDOB = (date) => {
    if (date) {
      try {
        const dt = new Date(date);
        return `${dt.getDate()} ${getMonthString(date)} ${dt.getFullYear()}`;
      } catch (err) {
        console.log(err);
        return "";
      }
    } else return "";
  };

  // handle personal information form submit
  const HandlePersonalInfoSubmit = (e, candidateInfo, addressInfo) => {
    e.preventDefault();

    // get formatted address
    const getAddressFormatted = (address, address_type) => {
      if (!address) return "";
      if (address_type === "current") {
        const aC = address;
        return `${aC?.current_street}, ${aC?.current_city}, ${aC?.current_state}, ${aC?.current_country}, ${aC?.current_zipcode}`;
      } else if (address_type === "permanent") {
        const aP = address;
        return `${aP?.permanent_street}, ${aP?.permanent_city}, ${aP?.permanent_state}, ${aP?.permanent_country}, ${aP?.permanent_zipcode}`;
      }
    };

    const final_obj = {
      ...candidateInfo,
      current_address: getAddressFormatted(addressInfo?.current, "current"),
      permanent_address: getAddressFormatted(addressInfo?.permanent, "permanent"),
    };
    dispatch(updateCandidateProfile(final_obj));
  };

  // handle experience & availability form submit
  const HandleExperienceAvailabilitySubmit = (e, candidateInfo) => {
    e.preventDefault();
    dispatch(updateCandidateProfile(candidateInfo));
  };

  return (
    <div className="personal__info__box px-lg-4">
      {/* Personal Information */}
      <div className="row section__bg p-4">
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="profile__section__heading">Personal Information</h6>
          <button
            type="button"
            name="edit_add_btn"
            className="btn text-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#addEditPersonalInfoForm"
          >
            <BiEdit />
            <span>Edit</span>
          </button>
        </div>

        <div className="row mt-3">
          <div className="col-lg-3">
            <div className="candidate__profile__img">
              <img src={CandidateProfileImg} alt="Candidate Profile" />
            </div>
            <div className="candidate__location text-center mt-4">
              <label htmlFor="candidate_location" className="candidate__info__label">
                Location
              </label>
              <p className="candidate__info__value">
                {getAddress(current_address, "city")} ({getAddress(current_address, "country")})
              </p>
            </div>
          </div>
          <div className="col-lg-9">
            <div className="row">
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_name" className="candidate__info__label">
                  Name
                </label>
                <p className="candidate__info__value">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_current_company" className="candidate__info__label">
                  Current Company
                </label>
                <p className="candidate__info__value">{current_employer}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_designation" className="candidate__info__label">
                  Designation
                </label>
                <p className="candidate__info__value">{current_role}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_email" className="candidate__info__label">
                  Email Address
                </label>
                <p className="candidate__info__value">{email}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_primary_contact" className="candidate__info__label">
                  Primary Contact
                </label>
                <p className="candidate__info__value">{phone}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_dob" className="candidate__info__label">
                  Date of Birth
                </label>
                <p className="candidate__info__value">{getDOB(dob)}</p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_address_street" className="candidate__info__label">
                  Street / House No.
                </label>
                <p className="candidate__info__value">{getAddress(current_address, "street")}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_address_city" className="candidate__info__label">
                  City
                </label>
                <p className="candidate__info__value">{getAddress(current_address, "city")}</p>
              </div>
              <div className="col-md-4 col-6 mt-2">
                <label htmlFor="candidate_address_state" className="candidate__info__label">
                  State
                </label>
                <p className="candidate__info__value">{getAddress(current_address, "state")}</p>
              </div>
              <div className="col-md-4 col-6 col-0"></div>
              <div className="col-md-4 col-6">
                <label htmlFor="candidate_address_country" className="candidate__info__label">
                  Country
                </label>
                <p className="candidate__info__value text-uppercase">{getAddress(current_address, "country")}</p>
              </div>
              <div className="col-md-4 col-6">
                <label htmlFor="candidate_address_zipcode" className="candidate__info__label">
                  Zipcode
                </label>
                <p className="candidate__info__value">{getAddress(current_address, "zipcode")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Personal Information Form Sidebar */}
        {profileInfo && <PersonalInformationForm profileInfo={profileInfo} handleSubmit={HandlePersonalInfoSubmit} />}
      </div>

      {/* Experience & Availability */}
      <div className="row section__bg p-4 mt-4">
        <div className="d-flex align-items-center justify-content-between">
          <h6 className="profile__section__heading">Experience &amp; Availability</h6>
          <button
            type="button"
            name="edit_add_btn"
            className="btn text-primary"
            data-bs-toggle="offcanvas"
            data-bs-target="#addEditExperienceAvailabilityForm"
          >
            <BiEdit />
            <span>Edit</span>
          </button>
        </div>

        <div className="row mt-3 ps-5">
          <div className="col-md-4 col-6 mt-2">
            <label htmlFor="candidate_total_experience" className="candidate__info__label">
              Total Experience
            </label>
            <p className="candidate__info__value">{total_experience} Year(s)</p>
          </div>
          <div className="col-md-4 col-6 mt-2">
            <label htmlFor="candidate_relevant_experience" className="candidate__info__label">
              Relevant Experience
            </label>
            <p className="candidate__info__value">{relevant_experience} Year(s)</p>
          </div>
          <div className="col-md-4 col-6 mt-2">
            <label htmlFor="candidate_expected_role" className="candidate__info__label">
              Expected Role
            </label>
            <p className="candidate__info__value">{expected_role}</p>
          </div>
          <div className="col-md-4 col-6 mt-2">
            <label htmlFor="candidate_notice_period" className="candidate__info__label">
              Notice Period
            </label>
            <p className="candidate__info__value">{notice_period} Days</p>
          </div>
        </div>

        {/* Add/Edit Personal Information Form Sidebar */}
        {profileInfo && (
          <ExperienceAvailabilityForm profileInfo={profileInfo} handleSubmit={HandleExperienceAvailabilitySubmit} />
        )}
      </div>
    </div>
  );
};

const PersonalInformationForm = ({ profileInfo, handleSubmit }) => {
  const { first_name, last_name, phone, email } = getLocalStorage("user");

  // states
  const [personalInfo, setPersonalInfo] = useState({});
  const [addressInfo, setAddressInfo] = useState({
    current: current_address_initial,
    permanent: permanent_address_initial,
  });

  // once we get profileInfo from parent component, set it for fields to populate
  useEffect(() => {
    setPersonalInfo({ ...profileInfo, phone });

    // for address inputs
    const getAddress = (address, address_type) => {
      try {
        const arr = address?.split(", ");
        return {
          [`${address_type}_street`]: arr[0],
          [`${address_type}_city`]: arr[1],
          [`${address_type}_state`]: arr[2],
          [`${address_type}_country`]: arr[3],
          [`${address_type}_zipcode`]: arr[4],
        };
      } catch (err) {
        return address_type === "current" ? current_address_initial : permanent_address_initial;
      }
    };

    setAddressInfo((prevState) => {
      return { ...prevState, current: getAddress(profileInfo?.current_address, "current") };
    });
    setAddressInfo((prevState) => {
      return { ...prevState, permanent: getAddress(profileInfo?.permanent_address, "permanent") };
    });
  }, [profileInfo, phone]);

  // handle personal information change input
  const HandlePersonalInfoChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setPersonalInfo((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handle address (current + permanent) change input
  const HandleAddressChange = (e, address_type) => {
    const name = e.target.name;
    const value = e.target.value;

    if (address_type === "current") {
      setAddressInfo((prevState) => {
        return {
          ...prevState,
          current: {
            ...prevState.current,
            [name]: value,
          },
        };
      });
    } else if (address_type === "permanent") {
      setAddressInfo((prevState) => {
        return {
          ...prevState,
          permanent: {
            ...prevState.permanent,
            [name]: value,
          },
        };
      });
    }
  };

  // handle validation then only allow to submit
  const isValidate = () => {
    const isAddressValidate = (address) => {
      let isAnyEmpty = false;
      for (let key in address) {
        if (!address[key]?.trim()) {
          isAnyEmpty = true;
          break;
        }
      }
      return isAnyEmpty ? false : true;
    };

    let result = false;
    const { phone, dob, current_employer, current_role } = personalInfo;
    const { current, permanent } = addressInfo;
    if (
      phone?.trim() &&
      dob?.trim() &&
      current_employer?.trim() &&
      current_role?.trim() &&
      isAddressValidate(current) &&
      isAddressValidate(permanent)
    )
      result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal wide__offcanvas"
      tabIndex="-1"
      id="addEditPersonalInfoForm"
      aria-labelledby="addEditPersonalInfoFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-0">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <h5 className="offcanvas-title" id="addEditPersonalInfoFormLabel">
          Update Personal Information
        </h5>
      </div>

      <div className="offcanvas-body py-lg-0 py-2">
        <form
          name="addEditPersonalInfoForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, personalInfo, addressInfo);
          }}
        >
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="full_name" className="candidate__info__label mb-1">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="full_name"
                id="full_name"
                value={`${first_name} ${last_name}`}
                readOnly
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="email" className="candidate__info__label mb-1">
                Email Address <span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" name="email" id="email" value={email} readOnly />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="phone" className="candidate__info__label mb-1">
                Primary Contact <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="phone"
                id="phone"
                value={personalInfo?.phone || ""}
                onChange={HandlePersonalInfoChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="dob" className="candidate__info__label mb-1">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="dob"
                id="dob"
                value={personalInfo?.dob || ""}
                max={new Date()?.toISOString()?.split("T")[0]}
                onChange={HandlePersonalInfoChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="current_employer" className="candidate__info__label mb-1">
                Current Employer <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="current_employer"
                id="current_employer"
                value={personalInfo?.current_employer || ""}
                onChange={HandlePersonalInfoChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="current_role" className="candidate__info__label mb-1">
                Designation <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="current_role"
                id="current_role"
                value={personalInfo?.current_role || ""}
                onChange={HandlePersonalInfoChange}
                required
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="row mt-2">
              <p style={{ fontSize: 15, fontWeight: 500 }}>Current Address</p>
            </div>

            <div className="row gx-3 px-0" style={{ marginTop: -7 }}>
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="current_street" className="candidate__info__label mb-1">
                    Street / House No. <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="current_street"
                    id="current_street"
                    value={addressInfo?.current?.current_street || ""}
                    onChange={(e) => HandleAddressChange(e, "current")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="current_city" className="candidate__info__label mb-1">
                    City <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="current_city"
                    id="current_city"
                    value={addressInfo?.current?.current_city || ""}
                    onChange={(e) => HandleAddressChange(e, "current")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="current_state" className="candidate__info__label mb-1">
                    State <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="current_state"
                    id="current_state"
                    value={addressInfo?.current?.current_state || ""}
                    onChange={(e) => HandleAddressChange(e, "current")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="current_country" className="candidate__info__label mb-1">
                    Country <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="current_country"
                    id="current_country"
                    value={addressInfo?.current?.current_country || ""}
                    onChange={(e) => HandleAddressChange(e, "current")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="current_zipcode" className="candidate__info__label mb-1">
                    Zipcode <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="current_zipcode"
                    id="current_zipcode"
                    value={addressInfo?.current?.current_zipcode || ""}
                    onChange={(e) => HandleAddressChange(e, "current")}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="row mt-2">
              <p style={{ fontSize: 15, fontWeight: 500 }}>Permanent Address</p>
            </div>

            <div className="row gx-3 px-0" style={{ marginTop: -7 }}>
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="permanent_street" className="candidate__info__label mb-1">
                    Street / House No. <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanent_street"
                    id="permanent_street"
                    value={addressInfo?.permanent?.permanent_street || ""}
                    onChange={(e) => HandleAddressChange(e, "permanent")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="permanent_city" className="candidate__info__label mb-1">
                    City <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanent_city"
                    id="permanent_city"
                    value={addressInfo?.permanent?.permanent_city || ""}
                    onChange={(e) => HandleAddressChange(e, "permanent")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="permanent_state" className="candidate__info__label mb-1">
                    State <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanent_state"
                    id="permanent_state"
                    value={addressInfo?.permanent?.permanent_state || ""}
                    onChange={(e) => HandleAddressChange(e, "permanent")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="permanent_country" className="candidate__info__label mb-1">
                    Country <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanent_country"
                    id="permanent_country"
                    value={addressInfo?.permanent?.permanent_country || ""}
                    onChange={(e) => HandleAddressChange(e, "permanent")}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="permanent_zipcode" className="candidate__info__label mb-1">
                    Zipcode <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="permanent_zipcode"
                    id="permanent_zipcode"
                    value={addressInfo?.permanent?.permanent_zipcode || ""}
                    onChange={(e) => HandleAddressChange(e, "permanent")}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn custom__btn" data-bs-dismiss="offcanvas" disabled={!isValidate()}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExperienceAvailabilityForm = ({ profileInfo, handleSubmit }) => {
  // states
  const [preferenceInput, setPreferenceInput] = useState({});

  // once we get profileInfo from parent component, set it for fields to populate
  useEffect(() => {
    setPreferenceInput({ ...profileInfo });
  }, [profileInfo]);

  // handle personal information change input
  const HandleExperienceAvailabilityChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setPreferenceInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handle validation then only allow to submit
  const isValidate = () => {
    let result = false;
    const { expected_role, total_experience, relevant_experience, notice_period } = preferenceInput;
    if (
      expected_role?.trim() &&
      total_experience?.trim() &&
      relevant_experience?.trim() &&
      notice_period?.trim()
    )
      result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditExperienceAvailabilityForm"
      aria-labelledby="addEditExperienceAvailabilityFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-0">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <h5 className="offcanvas-title" id="addEditExperienceAvailabilityFormLabel">
          Update Experience Availability
        </h5>
      </div>

      <div className="offcanvas-body py-lg-0 py-2 mt-3">
        <form
          name="addEditExperienceAvailabilityForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, preferenceInput);
            setPreferenceInput(preference_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="total_experience" className="candidate__info__label mb-1">
                Total Experience (in yrs.) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="total_experience"
                id="total_experience"
                value={preferenceInput?.total_experience || ""}
                onChange={HandleExperienceAvailabilityChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="relevant_experience" className="candidate__info__label mb-1">
                Relevant Experience (in yrs.) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="relevant_experience"
                id="relevant_experience"
                value={preferenceInput?.relevant_experience || ""}
                onChange={HandleExperienceAvailabilityChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="expected_role" className="candidate__info__label mb-1">
                Expected Role <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="expected_role"
                id="expected_role"
                value={preferenceInput?.expected_role || ""}
                onChange={HandleExperienceAvailabilityChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="notice_period" className="candidate__info__label mb-1">
                Notice Period (in days) <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="notice_period"
                id="notice_period"
                value={preferenceInput?.notice_period || ""}
                onChange={HandleExperienceAvailabilityChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn custom__btn mt-2" data-bs-dismiss="offcanvas" disabled={!isValidate()}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
