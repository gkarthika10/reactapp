import React, { useState, useEffect } from "react";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { setMyEducationRedux } from "../../../store/resumeSlice";

// Helpers
import { toastError, toastSuccess } from "../../../helpers/Notification";
import ErrorBox from "./ErrorBox";

// Media & Icons
import { BiTrash } from "react-icons/bi";

// education initial obj
const education_initial = {
  institute: "",
  degree: "",
  field_of_study: "",
};

const MyEducation = ({ parsedInfo, stepPlusOne, stepMinusOne }) => {
  const dispatch = useDispatch();
  const { education } = useSelector((state) => state.resume.my_education);

  // states
  const [educationInput, setEducationInput] = useState(education_initial);
  const [educationsInfo, setEducationsInfo] = useState([]);

  // state for errors
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  // populate my-education fields from redux-store (to avoid state wipe-out)
  useEffect(() => {
    try {
      if (education?.length > 0) setEducationsInfo(education);
    } catch (err) {
      console.log(err);
      toastError("Some Error Occured! (Max Depth)");
    }
  }, [education]);

  // handle education input-fields
  const HandleEducationInput = (e) => {
    setEducationInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // handle add-education
  const HandleAddEducation = () => {
    if (
      !educationInput?.institute?.trim() ||
      !educationInput?.degree?.trim() ||
      !educationInput?.field_of_study?.trim()
    ) {
      toastError("Please fill all fields of Education.");
      return;
    }

    const tmp = { ...educationInput };
    setEducationsInfo((prevState) => {
      return [...prevState, tmp];
    });
    setEducationInput(education_initial);
    toastSuccess("Education Added Successfully!");
  };

  // handle delete-education
  const HandleDeleteEducation = (event, education_degree) => {
    const educations = educationsInfo.filter((item) => {
      return item.degree !== education_degree;
    });
    setEducationsInfo(educations);
  };

  // validate my-education data before switching to next step
  const GetErrorsIfAny = () => {
    const errors = [];
    if (educationsInfo?.length < 1)
      errors.push({
        ques: "Education",
        ans: "The section Education is required and atleast your graduation details needed.",
      });
    return errors;
  };

  // handle save-&-continue
  const HandleSaveContinue = (event, navigateStep) => {
    if (event.currentTarget.name === "next_step") {
      const errors = GetErrorsIfAny();
      if (errors.length > 0) {
        setErrors(errors);
        setModalIsOpen(true);
        return;
      }
    }

    dispatch(
      setMyEducationRedux({
        education: educationsInfo,
      })
    );
    navigateStep();
  };

  return (
    <div className="my__education__box">
      {/* Errors Dialog (if any) */}
      <ErrorBox isOpen={modalIsOpen} onClose={() => setModalIsOpen(!modalIsOpen)} errors={errors} />

      <h5 className="step__heading">My Education</h5>
      <div className="row">
        <div className="col-lg-4">
          <div className="sticky-lg-top mt-1 sticky__parsed__resume__box">
            <div className="sticky__parsed__resume">
              <div className="sticky__parsed__heading">
                <h6>My Education</h6>
                <p>Extracted from your Resume. Copy &amp; Paste from here.</p>
              </div>
              {parsedInfo && (
                <div className="sticky__parsed__content">
                  {[...parsedInfo].map((line, idx) => {
                    return <p key={`line__${idx + 1}`}>{line}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="step__content mt-4 ps-xl-4 ps-lg-3">
            <p className="required__line pt-2">
              <span className="required__symbol">*</span> Indicates a required field
            </p>

            <form name="myEducationForm" className="mt-4">
              {/* Education */}
              <p className="block__heading pt-3">Education</p>
              <div className="mb-4">
                <div className="row pb-2">
                  {[...educationsInfo].map((education, idx) => {
                    return (
                      <EducationItem
                        educationInfo={education}
                        idx={idx + 1}
                        key={`education_${idx + 1}`}
                        handleDeleteEducation={HandleDeleteEducation}
                      />
                    );
                  })}
                </div>

                <div className="row pb-2">
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="institute" className="form-label">
                        School or University <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="institute"
                        name="institute"
                        value={educationInput.institute}
                        onChange={HandleEducationInput}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="degree" className="form-label">
                        Degree <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="degree"
                        name="degree"
                        value={educationInput.degree}
                        onChange={HandleEducationInput}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="field_of_study" className="form-label">
                        Field of Study <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="field_of_study"
                        name="field_of_study"
                        value={educationInput.field_of_study}
                        onChange={HandleEducationInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <p className="small text-muted">
                    <span style={{ fontWeight: 500 }}>NOTE:</span> <span>Keep the degree to be unique.</span>
                  </p>
                </div>
                <div className="row mt-2">
                  <button type="button" className="mb-3 add__another__btn" onClick={HandleAddEducation}>
                    Add Education
                  </button>
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

export const EducationItem = ({ educationInfo, idx, handleDeleteEducation, isReview }) => {
  return (
    <div className="multi__resume__item" style={{ marginTop: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Education {idx}</h6>
        {!isReview && (
          <button
            type="button"
            className="btn delete__btn"
            onClick={(e) => {
              handleDeleteEducation(e, educationInfo.degree);
            }}
          >
            <BiTrash className="delete__icon" />
            <span>Delete</span>
          </button>
        )}
      </div>
      <div className="row item__info mt-1 ps-md-3 ps-2">
        <div className="col-md-6 mt-3">
          <h6>School/University</h6>
          <p>{educationInfo?.institute}</p>
        </div>
        <div className="col-md-6 mt-3">
          <h6>Degree</h6>
          <p>{educationInfo?.degree}</p>
        </div>
        <div className="col-12 mt-3">
          <h6>Field of Study</h6>
          <p>{educationInfo?.field_of_study}</p>
        </div>
      </div>
    </div>
  );
};

export default MyEducation;
