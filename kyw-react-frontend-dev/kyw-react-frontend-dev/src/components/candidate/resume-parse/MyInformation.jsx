import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

// Helpers
import { getLocalStorage } from "../../../helpers/LocalStorage";
import { toastError } from "../../../helpers/Notification";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCountries } from "../../../store/commonSlice";
import { setMyInformationRedux } from "../../../store/resumeSlice";

// Media & Icon
import { BiX } from "react-icons/bi";
import ErrorBox from "./ErrorBox";

// Empty Address State Data
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

ReactModal.setAppElement("#root");
const MyInformation = ({ parsedInfo, stepPlusOne, stepMinusOne }) => {
  const dispatch = useDispatch();
  const countries_list = useSelector((state) => state.common.countries);
  const { about, preferred_worklocation, address, dob, gender } = useSelector((state) => state.resume.my_information);

  // states for errors
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  // state for dob
  const [dobInfo, setDobInfo] = useState("");

  // state for preferred location
  const [workLocationInput, setWorkLocationInput] = useState("");
  const [preferredWorkLocations, setPreferredWorkLocations] = useState([]);

  // other states
  const { first_name, last_name, email, phone } = getLocalStorage("user");
  const [aboutInfo, setAboutInfo] = useState("");
  const [genderInfo, setGenderInfo] = useState("");
  const [addressInfo, setAddressInfo] = useState({
    current: current_address_initial,
    permanent: permanent_address_initial,
  });
  const [isPermanentAddressSame, setIsPermanentAddressSame] = useState(false);

  // Fetch Countries List
  useEffect(() => {
    dispatch(fetchAllCountries());
  }, [dispatch]);

  // populate my-information fields from redux-store (to avoid state wipe-out)
  useEffect(() => {
    try {
      if (about) setAboutInfo(about);
      if (preferred_worklocation?.length > 0) setPreferredWorkLocations(preferred_worklocation);
      if (Object.keys(address).length > 0) setAddressInfo({ ...address });
      if (dob) setDobInfo(dob);
      if (gender) setGenderInfo(gender);
    } catch (err) {
      console.log(err);
      toastError("Some Error Occured! (Max Depth)");
    }
  }, [about, preferred_worklocation, address, dob, gender]);

  // handle preferred-work-location input
  const HandleWorkLocationInput = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      // if already exist
      if (preferredWorkLocations.includes(workLocationInput)) {
        toastError("Location Already Added.");
        return;
      }

      if (preferredWorkLocations?.length < 3) {
        if (workLocationInput !== "") {
          const locations = [...preferredWorkLocations, workLocationInput];
          setPreferredWorkLocations(locations);
          setWorkLocationInput("");
        }
      } else {
        toastError("You Can Add At-Max 3 Locations.");
      }
    }
  };

  // delete specific preferred-work-location
  const HandleRemoveWorkLocation = (e) => {
    if (e.target !== e.currentTarget) return;
    const id = e.currentTarget.id;
    const locations = preferredWorkLocations.filter((loc) => {
      return loc !== id;
    });
    setPreferredWorkLocations(locations);
  };

  // handle address field (current + permanent)
  const HandleAddressInput = (e, address_type) => {
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

  // when candidate click on "same as current address" option
  const HandleAddressSame = () => {
    if (isPermanentAddressSame) {
      setIsPermanentAddressSame(false);
      setAddressInfo((prevState) => {
        return {
          ...prevState,
          permanent: permanent_address_initial,
        };
      });
    } else {
      setIsPermanentAddressSame(true);
      const address_data = {
        permanent_street: addressInfo.current.current_street,
        permanent_city: addressInfo.current.current_city,
        permanent_state: addressInfo.current.current_state,
        permanent_zipcode: addressInfo.current.current_zipcode,
        permanent_country: addressInfo.current.current_country,
      };
      setAddressInfo((prevState) => {
        return {
          ...prevState,
          permanent: address_data,
        };
      });
    }
  };

  // validate my-information data before switching to next step
  const GetErrorsIfAny = () => {
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

    const errors = [];
    if (!aboutInfo?.trim())
      errors.push({
        ques: "About Yourself",
        ans: "The field About Yourself is needed and must need a brief overview about you.",
      });
    if (preferredWorkLocations.length < 1)
      errors.push({
        ques: "Preferred Work Location",
        ans: "Atleast one & maximum three Preferred Work Location(s) you can add.",
      });
    if (!dobInfo)
      errors.push({
        ques: "Date of Birth",
        ans: "Date of Birth is required and must have a value.",
      });
    if (!genderInfo)
      errors.push({
        ques: "Gender",
        ans: "Gender is required and must have a selected value.",
      });
    if (!isAddressValidate(addressInfo.current))
      errors.push({
        ques: "Current Address (Street, City, State, Country, Zipcode)",
        ans: "Please fill all fields of Current Address.",
      });
    if (!isAddressValidate(addressInfo.permanent))
      errors.push({
        ques: "Permanent Address (Street, City, State, Country, Zipcode)",
        ans: "Please fill all fields of Permanent Address.",
      });

    return errors;
  };

  // save data in store before switching to any step
  const HandleSaveContinue = (event, navigateStep) => {
    if (event.currentTarget.name === "next_step") {
      const errors = GetErrorsIfAny();
      if (errors.length > 0) {
        setErrors(errors);
        setModalIsOpen(true);
        return;
      }
    }

    // dispatch step details to store
    dispatch(
      setMyInformationRedux({
        about: aboutInfo,
        locations: [...preferredWorkLocations],
        address: { ...addressInfo },
        dob: dobInfo,
        gender: genderInfo,
      })
    );
    navigateStep();
  };

  return (
    <div className="my__information__box">
      {/* Errors Dialog (if any) */}
      <ErrorBox isOpen={modalIsOpen} onClose={() => setModalIsOpen(!modalIsOpen)} errors={errors} />

      <h5 className="step__heading">My Information</h5>
      <div className="row">
        <div className="col-lg-4">
          <div className="sticky-lg-top mt-1 sticky__parsed__resume__box">
            <div className="sticky__parsed__resume">
              <div className="sticky__parsed__heading">
                <h6>My Information</h6>
                <p>Extracted from your Resume. Copy &amp; Paste from here.</p>
              </div>
              {parsedInfo && <div className="sticky__parsed__content">{parsedInfo}</div>}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="step__content mt-4 ps-xl-4 ps-lg-3">
            <p className="required__line pt-2">
              <span className="required__symbol">*</span> Indicates a required field
            </p>

            <form name="myInformationForm" className="mt-4">
              {/* About Yourself */}
              <div className="my-4">
                <div className="pe-lg-4 pb-2">
                  <label htmlFor="about_candidate" className="form-label">
                    About Yourself <span className="required__symbol">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="about_candidate"
                    name="about_candidate"
                    rows="2"
                    value={aboutInfo}
                    onChange={(e) => setAboutInfo(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              <hr className="divider" />

              {/* Preferred Work Location */}
              <p className="block__heading pt-3">Preferred Work Location</p>
              <div className="row pb-3">
                <div className="col-md-8 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="skills" className="form-label">
                      Choose Location (Max. 3) <span className="required__symbol">*</span>
                    </label>
                    <label className="input__chip__label">
                      {[...preferredWorkLocations].map((location, idx) => {
                        return (
                          <span className="chip" key={`${location}_${idx}`}>
                            <span>{location}</span>
                            <button type="button">
                              <BiX className="icon" id={location} onClick={HandleRemoveWorkLocation} />
                            </button>
                          </span>
                        );
                      })}
                      <input
                        type="text"
                        id="preferred_locations"
                        name="preferred_locations"
                        placeholder="Type to Add Locations"
                        value={workLocationInput}
                        onChange={(e) => setWorkLocationInput(e.target.value.toLowerCase())}
                        onKeyDown={HandleWorkLocationInput}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* First Name, Last Name */}
              <p className="block__heading pt-3">Personal Information</p>
              <div className="row pb-3">
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="first_name" className="form-label">
                      First Name <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      name="first_name"
                      value={first_name}
                      title="Some Fields are Read-Only"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="last_name" className="form-label">
                      Last Name <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      name="last_name"
                      value={last_name}
                      title="Some Fields are Read-Only"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      title="Some Fields are Read-Only"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={phone}
                      title="Some Fields are Read-Only"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="dob" className="form-label d-block">
                      Date of Birth <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dobInfo}
                      max={new Date()?.toISOString()?.split("T")[0]}
                      onChange={(e) => setDobInfo(e.target.value)}
                      name="dob"
                      id="dob"
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="gender" className="form-label">
                      Gender <span className="required__symbol">*</span>
                    </label>
                    <select
                      className="form-select"
                      aria-label="gender"
                      value={genderInfo}
                      onChange={(e) => setGenderInfo(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="not to be disclosed">Not to be disclosed</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Address */}
              <p className="block__heading pt-3">Address</p>
              <div className="row pb-3">
                <div className="col-lg-6 col-12">
                  <div className="mb-3">
                    <h5 className="my-2">Current Address</h5>
                    <p className="text-muted small mb-0">Something must be here.</p>
                  </div>

                  <div className="row px-0">
                    <div className="col-12 mb-3 pe-xl-4 mt-sm-1 mt-3">
                      <label htmlFor="current_street" className="form-label">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="current_street"
                        name="current_street"
                        value={addressInfo.current.current_street}
                        onChange={(e) => HandleAddressInput(e, "current")}
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="current_city" className="form-label">
                        City <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="current_city"
                        name="current_city"
                        value={addressInfo.current.current_city}
                        onChange={(e) => HandleAddressInput(e, "current")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="current_state" className="form-label">
                        State <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="current_state"
                        name="current_state"
                        value={addressInfo.current.current_state}
                        onChange={(e) => HandleAddressInput(e, "current")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="current_zipcode" className="form-label">
                        Postal Code <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="current_zipcode"
                        name="current_zipcode"
                        value={addressInfo.current.current_zipcode}
                        onChange={(e) => HandleAddressInput(e, "current")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="current_country" className="form-label">
                        Country <span className="required__symbol">*</span>
                      </label>
                      <select
                        className="form-select"
                        aria-label="Current Country"
                        id="current_country"
                        name="current_country"
                        value={addressInfo.current.current_country}
                        onChange={(e) => HandleAddressInput(e, "current")}
                        required
                      >
                        <option key="no_country" value="" disabled></option>
                        {countries_list?.length > 0 &&
                          [...countries_list].map((country, idx) => {
                            return (
                              <option key={`${idx}_${country.cioc}`} value={country?.name?.common}>
                                {country?.name?.common}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-12">
                  <div className="mb-3">
                    <h5 className="my-2">Permanent Address</h5>
                    <div className="form-check ps-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="same_as_permanent_address"
                        onChange={HandleAddressSame}
                        checked={isPermanentAddressSame}
                      />
                      <label className="form-check-label small ms-2" htmlFor="same_as_permanent_address">
                        Same as current address
                      </label>
                    </div>
                  </div>

                  <div className="row px-0">
                    <div className="col-12 mb-3 pe-xl-4">
                      <label htmlFor="permanent_street" className="form-label">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="permanent_street"
                        name="permanent_street"
                        value={addressInfo.permanent.permanent_street}
                        onChange={(e) => HandleAddressInput(e, "permanent")}
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="permanent_city" className="form-label">
                        City <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="permanent_city"
                        name="permanent_city"
                        value={addressInfo.permanent.permanent_city}
                        onChange={(e) => HandleAddressInput(e, "permanent")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="permanent_state" className="form-label">
                        State <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="permanent_state"
                        name="permanent_state"
                        value={addressInfo.permanent.permanent_state}
                        onChange={(e) => HandleAddressInput(e, "current")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="permanent_zipcode" className="form-label">
                        Postal Code <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="permanent_zipcode"
                        name="permanent_zipcode"
                        value={addressInfo.permanent.permanent_zipcode}
                        onChange={(e) => HandleAddressInput(e, "permanent")}
                        required
                      />
                    </div>

                    <div className="col-lg-12 col-sm-6 mb-3 pe-xl-4">
                      <label htmlFor="permanent_country" className="form-label">
                        Country <span className="required__symbol">*</span>
                      </label>
                      <select
                        className="form-select"
                        aria-label="Permanent Country"
                        id="permanent_country"
                        name="permanent_country"
                        value={addressInfo.permanent.permanent_country}
                        onChange={(e) => HandleAddressInput(e, "permanent")}
                        required
                      >
                        <option key="no_country" value="" disabled></option>
                        {countries_list?.length > 0 &&
                          [...countries_list].map((country, idx) => {
                            return (
                              <option key={`${idx}_${country.cioc}`} value={country?.name?.common}>
                                {country?.name?.common}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-lg-5 mt-3 d-flex justify-content-md-end">
            <button
              type="button"
              name="back_step"
              className="btn back__btn"
              onClick={(e) => HandleSaveContinue(e, stepMinusOne)}
            >
              Back
            </button>
            <button
              type="button"
              name="next_step"
              className="btn continue__btn"
              onClick={(e) => HandleSaveContinue(e, stepPlusOne)}
            >
              Save &#38; Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInformation;
