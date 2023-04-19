import React, { useState, useEffect } from "react";

// Redux Stuff
import { useDispatch } from "react-redux";
import { updateCandidateProfile } from "../../../store/profileSlice";

// Media & Icons
import { BiPlusCircle, BiEdit, BiTrash } from "react-icons/bi";

// Helpers
import { toastError } from "../../../helpers/Notification";

// education initial obj
const education_initial = {
  institute: "",
  degree: "",
  field_of_study: "",
};

const Education = ({ profileInfo }) => {
  const dispatch = useDispatch();
  const { education } = profileInfo;

  // states
  const [educations, setEducations] = useState([]);

  // few states for add/update form
  const [eduForm, setEduForm] = useState({});

  // parsing educations
  useEffect(() => {
    try {
      const parsed_educations = JSON.parse(education);
      if (parsed_educations?.length > 0) setEducations(parsed_educations);
    } catch (err) {
      console.log(err);
    }
  }, [education]);

  // handle education deletion
  const HandleEducationDelete = (degree) => {
    const edus = educations?.filter((edu) => {
      return edu.degree !== degree;
    });

    dispatch(
      updateCandidateProfile({
        education: JSON.stringify(edus),
      })
    );
  };

  // handle submit for education form
  const HandleEducationSubmit = (e, eduData) => {
    e.preventDefault();
    try {
      if (Object.keys(eduForm)?.length > 0) {
        // update education
        let deletePos = 0;
        const tmp = educations?.filter((item, idx) => {
          if (item.degree !== eduData?.degree) {
            deletePos = idx - 1;
            return true;
          }
          return false;
        });
        tmp.splice(deletePos, 0, eduData);
        dispatch(
          updateCandidateProfile({
            education: JSON.stringify(tmp),
          })
        );
        setEduForm({});
      } else {
        // add education
        let tmp = educations?.filter((item) => {
          if (item.degree === eduData?.degree) return true;
          return false;
        });
        if (tmp?.length > 0) {
          toastError("Education Already Added!");
          return false;
        }

        tmp = [eduData, ...educations];
        dispatch(
          updateCandidateProfile({
            education: JSON.stringify(tmp),
          })
        );
        setEduForm({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="education__box px-lg-4">
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="d-sm-flex align-items-center justify-content-between px-sm-3">
          <h6 className="profile__section__heading">Education</h6>
          <button
            type="button"
            name="edit_add_btn"
            className="btn text-success"
            data-bs-toggle="offcanvas"
            data-bs-target="#addEditEducationForm"
            aria-controls="addEditEducationForm"
            onClick={() => setEduForm({})}
          >
            <BiPlusCircle />
            <span>
              Add<span>Education</span>
            </span>
          </button>
        </div>

        <div className="container-fluid px-sm-4">
          {[...educations].map((item, idx) => {
            return (
              <div
                className="row mt-4 pt-4 pb-3 px-md-5 px-xs-4 px-2 rounded-3"
                style={{ background: "#DEDDDD" }}
                key={`education_${idx}`}
              >
                <div className="col-lg-4 pe-lg-4">
                  <label htmlFor={`candidate_institution_${idx}`} className="candidate__info__label">
                    Institution
                  </label>
                  <p className="candidate__info__value">{item?.institute}</p>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-md-6 ps-xl-2">
                      <label htmlFor={`candidate_degree_${idx}`} className="candidate__info__label">
                        Degree
                      </label>
                      <p className="candidate__info__value">{item?.degree}</p>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor={`candidate_field_of_study_${idx}`} className="candidate__info__label">
                        Field of Study
                      </label>
                      <p className="candidate__info__value">{item?.field_of_study}</p>
                    </div>
                    {/* <div className="col-md-6">
                      <label htmlFor={`candidate_batch_${idx}`} className="candidate__info__label">
                        Batch
                      </label>
                      <p className="candidate__info__value">2018-2022</p>
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="row">
                    <div className="col-lg-12 col-6">
                      <button
                        type="button"
                        name="edit_add_btn"
                        className="btn text-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#addEditEducationForm"
                        onClick={() => setEduForm(item)}
                      >
                        <BiEdit />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="col-lg-12 col-6">
                      <button
                        type="button"
                        name="edit_add_btn"
                        className="btn text-danger mt-2"
                        onClick={() => HandleEducationDelete(item?.degree)}
                      >
                        <BiTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Education Add/Update Form Sidebar */}
      <EducationForm
        educationInfo={eduForm}
        handleSubmit={HandleEducationSubmit}
        isUpdate={Object.keys(eduForm)?.length > 0 ? true : false}
      />
    </div>
  );
};

// education form
const EducationForm = ({ educationInfo, handleSubmit, isUpdate }) => {
  const [educationInput, setEducationInput] = useState(education_initial);

  // in-case of isUpdate, we get educationInfo
  useEffect(() => {
    if (Object.keys(educationInfo)?.length > 0) setEducationInput(educationInfo);
  }, [educationInfo]);

  // handle work experience input changes
  const HandleEducationChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setEducationInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // validation for work-experience add/update input fields
  const isValidateEducation = () => {
    let result = false;
    const { institute, degree, field_of_study } = educationInput;

    if (institute?.trim() && degree?.trim() && field_of_study?.trim()) result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditEducationForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditEducationFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setEducationInput(education_initial)}
        ></button>
        <h5 className="offcanvas-title" id="addEditEducationFormLabel">
          {isUpdate ? "Update" : "Add"} Education
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditEducationForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, educationInput);
            setEducationInput(education_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="degree" className="candidate__info__label mb-1">
                Degree <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="degree"
                id="degree"
                value={educationInput?.degree}
                onChange={HandleEducationChange}
                readOnly={isUpdate ? true : false}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="institute" className="candidate__info__label mb-1">
                Institute <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="institute"
                id="institute"
                value={educationInput?.institute}
                onChange={HandleEducationChange}
                required
              />
            </div>
          </div>

          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="field_of_study" className="candidate__info__label mb-1">
                Field of Study <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="field_of_study"
                id="field_of_study"
                value={educationInput?.field_of_study}
                onChange={HandleEducationChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn custom__btn mt-2"
              data-bs-dismiss="offcanvas"
              disabled={!isValidateEducation()}
            >
              {isUpdate ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Education;
