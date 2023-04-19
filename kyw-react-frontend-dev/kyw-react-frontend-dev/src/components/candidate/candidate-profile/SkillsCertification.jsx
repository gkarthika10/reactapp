import React, { useState, useEffect } from "react";
import Rating from "react-rating";

// Redux Stuff
import { useDispatch } from "react-redux";
import { updateCandidateProfile } from "../../../store/profileSlice";

// Media & Icons
import { BiPlusCircle, BiEdit, BiTrash } from "react-icons/bi";
import StarFullIcon from "../../../media/icons/star-full.png";
import StarEmptyIcon from "../../../media/icons/star-empty.png";

// Helpers
import { getMonthString } from "../../../helpers/Utility";
import { toastError } from "../../../helpers/Notification";

// Skills & Certification Initial Data
const skills_initial = {
  name: "",
  rating: 0,
};
const certification_initial = {
  name: "",
  issuedBy: "",
  issuedDate: "",
  expiryDate: "",
};

const SkillsCertification = ({ profileInfo }) => {
  const dispatch = useDispatch();
  const { skills, accomplishments, certifications } = profileInfo;

  // states
  const [mySkills, setMySkills] = useState([]);
  const [myAccomplishments, setMyAccomplishments] = useState("");
  const [myCertifications, setMyCertifications] = useState([]);

  // few states for add/update form
  const [skillsForm, setSkillsForm] = useState({});
  const [accomplishmentsForm, setAccomplishmentsForm] = useState("");
  const [certificationForm, setCertificationForm] = useState({});

  // parsing skills & certifications
  useEffect(() => {
    try {
      const parsed_skills = JSON.parse(skills);
      if (parsed_skills?.length > 0) setMySkills(parsed_skills);

      setMyAccomplishments(accomplishments);

      const parsed_certifications = JSON.parse(certifications);
      if (parsed_certifications?.length > 0) setMyCertifications(parsed_certifications);
    } catch (err) {
      console.log(err);
    }
  }, [skills, accomplishments, certifications]);

  // handle skills deletion
  const HandleSkillsDelete = (skill_name) => {
    const skills = mySkills?.filter((skill) => {
      return skill.name !== skill_name;
    });

    dispatch(
      updateCandidateProfile({
        skills: JSON.stringify(skills),
      })
    );
  };

  // handle skills Submit
  const HandleSkillsSubmit = (e, skillsData) => {
    e.preventDefault();
    try {
      if (Object.keys(skillsForm)?.length > 0) {
        // update certification
        let deletePos = -1;
        const tmp = mySkills?.filter((item, idx) => {
          if (item.name !== skillsData?.name) {
            deletePos = idx - 1;
            return true;
          }
          return false;
        });
        tmp.splice(deletePos, 0, skillsData);
        dispatch(
          updateCandidateProfile({
            skills: JSON.stringify(tmp),
          })
        );
        setSkillsForm({});
      } else {
        // add certification
        let tmp = mySkills?.filter((item) => {
          if (item.name === skillsData?.name) return true;
          return false;
        });
        if (tmp?.length > 0) {
          toastError("Skill Already Added!");
          return false;
        }

        tmp = [skillsData, ...mySkills];
        dispatch(
          updateCandidateProfile({
            skills: JSON.stringify(tmp),
          })
        );
        setSkillsForm({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handle accomplishments submit
  const HandleAccomplishmentsSubmit = (e, accomplishmentsData) => {
    e.preventDefault();
    console.log(accomplishmentsData);
    if (accomplishmentsData?.length > 0) {
      dispatch(
        updateCandidateProfile({
          accomplishments: accomplishmentsData,
        })
      );
    } else toastError("File Accomplishments Data!");
  };

  // handle certification deletion
  const HandleCertificationDelete = (certification_name) => {
    const certificates = myCertifications?.filter((certi) => {
      return certi?.name !== certification_name;
    });

    dispatch(
      updateCandidateProfile({
        certifications: JSON.stringify(certificates),
      })
    );
  };

  // handle submit for certification form
  const HandleCertificationSubmit = (e, certificateData) => {
    e.preventDefault();
    try {
      if (Object.keys(certificationForm)?.length > 0) {
        // update certification
        let deletePos = -1;
        const tmp = myCertifications?.filter((item, idx) => {
          if (item.name !== certificateData?.name) {
            deletePos = idx - 1;
            return true;
          }
          return false;
        });
        tmp.splice(deletePos, 0, certificateData);
        dispatch(
          updateCandidateProfile({
            certifications: JSON.stringify(tmp),
          })
        );
        setCertificationForm({});
      } else {
        // add certification
        let tmp = myCertifications?.filter((item) => {
          if (item.name === certificateData?.name) return true;
          return false;
        });
        if (tmp?.length > 0) {
          toastError("Certification Already Added!");
          return false;
        }

        tmp = [certificateData, ...myCertifications];
        dispatch(
          updateCandidateProfile({
            certifications: JSON.stringify(tmp),
          })
        );
        setCertificationForm({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get expiry date for certifications
  const getCertificationDate = (date) => {
    if (date) {
      try {
        const dt = new Date(date);
        return `${getMonthString(date, true)} ${dt.getFullYear()}`;
      } catch (err) {
        console.log(err);
        return "";
      }
    } else return "No Expiry";
  };

  return (
    <div className="skills__certification__box px-lg-4">
      {/* Skills */}
      <div className="skills__box">
        <div className="row section__bg p-sm-4 py-4 px-3">
          <div className="d-flex align-items-center justify-content-between px-sm-3">
            <h6 className="profile__section__heading">Skills</h6>
            <button
              type="button"
              name="edit_add_btn"
              className="btn text-success"
              data-bs-toggle="offcanvas"
              data-bs-target="#addEditSkillsForm"
              aria-controls="addEditSkillsForm"
              onClick={() => setSkillsForm({})}
            >
              <BiPlusCircle />
              <span>
                Add<span>Skill</span>
              </span>
            </button>
          </div>

          <div className="container-fluid px-lg-5 px-md-4 mt-sm-4 mt-2">
            {[...mySkills].map((item, idx) => {
              return (
                <div className="row mt-sm-3 mt-4 lh-1" key={`skill_${idx.toString()}`}>
                  <div className="col-sm-5 col-8 order-sm-1 order-1">
                    <p className="skill__name text-capitalize">{item?.name}</p>
                  </div>
                  <div className="col-sm-4 col-12 order-sm-2 order-3">
                    <div className="rating__box">
                      <Rating
                        emptySymbol={<img src={StarEmptyIcon} className="icon" alt="empty_star" />}
                        fullSymbol={<img src={StarFullIcon} className="icon" alt="filled_star" />}
                        fractions={2}
                        initialRating={item?.rating}
                        readonly
                      />
                    </div>
                  </div>
                  <div className="col-sm-3 col-4 order-sm-3 order-2">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="btn"
                        name="edit_add_btn"
                        title="Edit Skill"
                        className="btn text-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#addEditSkillsForm"
                        onClick={() => setSkillsForm(item)}
                      >
                        <BiEdit />
                      </button>
                      <button
                        type="btn"
                        name="edit_add_btn"
                        title="Delete Skill"
                        className="btn text-danger"
                        onClick={() => HandleSkillsDelete(item?.name)}
                      >
                        <BiTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accomplishments */}
      <div className="accomplishments__box mt-4">
        <div className="row section__bg p-sm-4 py-4 px-3">
          <div className="d-flex align-items-center justify-content-between px-sm-3">
            <h6 className="profile__section__heading">Accomplishments</h6>
            <button
              type="button"
              name="edit_add_btn"
              className="btn text-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#addEditAccomplishmentsForm"
              aria-controls="addEditAccomplishmentsForm"
              onClick={() => setAccomplishmentsForm(accomplishments)}
            >
              <BiEdit />
              <span>Edit</span>
            </button>
          </div>

          <div className="container-fluid px-sm-4 mt-3">
            <div className="row rounded-3 p-4 pb-2" style={{ background: "#DEDDDD" }}>
              <p>{myAccomplishments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="certification__box mt-4">
        <div className="row section__bg p-sm-4 py-4 px-3">
          <div className="d-flex align-items-center justify-content-between px-sm-3">
            <h6 className="profile__section__heading">Certifications</h6>
            <button
              type="button"
              name="edit_add_btn"
              className="btn text-success"
              data-bs-toggle="offcanvas"
              data-bs-target="#addEditCertificationForm"
              aria-controls="addEditCertificationForm"
              onClick={() => setCertificationForm({})}
            >
              <BiPlusCircle />
              <span>
                Add<span>Certification</span>
              </span>
            </button>
          </div>

          <div className="container-fluid px-sm-4">
            {[...myCertifications].map((item, idx) => {
              return (
                <div
                  className="row mt-4 pt-4 pb-3 px-md-5 px-xs-4 px-2 rounded-3"
                  style={{ background: "#DEDDDD" }}
                  key={`certification_${idx.toString()}`}
                >
                  <div className="col-lg-10">
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor={`candidate_certification_${idx}`} className="candidate__info__label">
                          Certification Name
                        </label>
                        <p className="candidate__info__value">{item?.name}</p>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor={`candidate_certificate__institution_${idx}`} className="candidate__info__label">
                          Institution
                        </label>
                        <p className="candidate__info__value">{item?.issuedBy}</p>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor={`candidate_expiry_at_${idx}`} className="candidate__info__label">
                          Valid (From - To)
                        </label>
                        <p className="candidate__info__value">
                          {item?.issuedDate && `${getCertificationDate(item?.issuedDate)} - `}
                          {item?.expiryDate ? `${getCertificationDate(item?.expiryDate)}` : "No Expiry"}
                        </p>
                      </div>
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
                          data-bs-target="#addEditCertificationForm"
                          onClick={() => setCertificationForm(item)}
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
                          onClick={() => HandleCertificationDelete(item?.name)}
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
      </div>

      {/* Skills, Accomplishments, Certification Add/Update Form Sidebar */}
      <SkillsForm
        skillsInfo={skillsForm}
        handleSubmit={HandleSkillsSubmit}
        isUpdate={Object.keys(skillsForm)?.length > 0 ? true : false}
      />
      <CertificationForm
        certificationInfo={certificationForm}
        handleSubmit={HandleCertificationSubmit}
        isUpdate={Object.keys(certificationForm)?.length > 0 ? true : false}
      />
      <AccomplishmentsForm accomplishmentsInfo={accomplishmentsForm} handleSubmit={HandleAccomplishmentsSubmit} />
    </div>
  );
};

// Skills Add/Update Form Sidebar
const SkillsForm = ({ skillsInfo, handleSubmit, isUpdate }) => {
  const [skillsInput, setSkillsInput] = useState({});

  // as it's only for update, we get skillsInfo
  useEffect(() => {
    if (Object.keys(skillsInfo)?.length > 0) setSkillsInput(skillsInfo);
  }, [skillsInfo]);

  // handle skills change
  const HandleSkillsChange = (e) => {
    let key = e.target.name;
    key = key?.split("_")[1];
    const value = e.target.value;

    setSkillsInput((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  // validation for skills add/update input fields
  const isValidateSkills = () => {
    let result = false;
    const { name, rating } = skillsInput;

    if (name?.trim() && rating > 0) result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditSkillsForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditSkillsFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setSkillsInput(skills_initial)}
        ></button>
        <h5 className="offcanvas-title" id="addEditSkillsFormLabel">
          {isUpdate ? "Update" : "Add"} Skill
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditSkillsForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, skillsInput);
            setSkillsInput(skills_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="skill_name" className="candidate__info__label mb-1">
                Skill <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="skill_name"
                id="skill_name"
                value={skillsInput?.name}
                onChange={HandleSkillsChange}
                readOnly={isUpdate ? true : false}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="skill_rating" className="candidate__info__label mb-1">
                Rating <span className="text-danger">*</span>
              </label>
              <div className="rating__box">
                <Rating
                  emptySymbol={<img src={StarEmptyIcon} className="icon" alt="empty_star" />}
                  fullSymbol={<img src={StarFullIcon} className="icon" alt="filled_star" />}
                  fractions={2}
                  initialRating={skillsInput?.rating}
                  onChange={(rate) => {
                    setSkillsInput((prevState) => {
                      return { ...prevState, rating: rate };
                    });
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn custom__btn mt-2"
              data-bs-dismiss="offcanvas"
              disabled={!isValidateSkills()}
            >
              {!isUpdate ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Accomplishments Update Form Sidebar
const AccomplishmentsForm = ({ accomplishmentsInfo, handleSubmit }) => {
  const [accomplishmentsInput, setAccomplishmentsInput] = useState("");

  // as it's only for update, we get accomplishmentsInfo
  useEffect(() => {
    if (accomplishmentsInfo?.length > 0) setAccomplishmentsInput(accomplishmentsInfo);
  }, [accomplishmentsInfo]);

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditAccomplishmentsForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditAccomplishmentsFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setAccomplishmentsInput("")}
        ></button>
        <h5 className="offcanvas-title" id="addEditAccomplishmentsFormLabel">
          Update Accomplishments
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditAccomplishmentsForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, accomplishmentsInput);
            setAccomplishmentsInput("");
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="accomplishments" className="candidate__info__label mb-1">
                Accomplishments <span className="text-danger">*</span>
              </label>
              <textarea
                name="accomplishments"
                id="accomplishments"
                rows="15"
                className="form-control"
                value={accomplishmentsInput}
                onChange={(e) => setAccomplishmentsInput(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn custom__btn mt-2" data-bs-dismiss="offcanvas">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Certification Add/Update Form Sidebar
const CertificationForm = ({ certificationInfo, handleSubmit, isUpdate }) => {
  const [certificationInput, setCertificationInput] = useState(certification_initial);

  // in-case of isUpdate, we get certificationInfo
  useEffect(() => {
    if (Object.keys(certificationInfo)?.length > 0) setCertificationInput(certificationInfo);
  }, [certificationInfo]);

  // handle certification input changes
  const HandleCertificationChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setCertificationInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // validation for certification add/update input fields
  const isValidateCertification = () => {
    let result = false;
    const { name, issuedBy } = certificationInput;

    if (name?.trim() && issuedBy?.trim()) result = true;
    return result;
  };

  // const populateDate = (date) => {
  //   let result = "";
  //   if (date) {
  //     try {
  //       result = new Date(date)?.toISOString()?.split("T")[0];
  //     } catch (err) {
  //       console.log(err);
  //       result = "";
  //     }
  //   } else result = "";
  //   return result;
  // };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditCertificationForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditCertificationFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setCertificationInput(certification_initial)}
        ></button>
        <h5 className="offcanvas-title" id="addEditCertificationFormLabel">
          {isUpdate ? "Update" : "Add"} Certification
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditCertificationForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, certificationInput);
            setCertificationInput(certification_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="name" className="candidate__info__label mb-1">
                Certification Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="name"
                id="name"
                value={certificationInput?.name}
                onChange={HandleCertificationChange}
                readOnly={isUpdate ? true : false}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="issuedBy" className="candidate__info__label mb-1">
                Institute <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="issuedBy"
                id="issuedBy"
                value={certificationInput?.issuedBy}
                onChange={HandleCertificationChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="issuedDate" className="candidate__info__label mb-1">
                Issued Date
              </label>
              <input
                type="date"
                className="form-control"
                name="issuedDate"
                id="issuedDate"
                max={new Date()?.toISOString()?.split("T")[0]}
                value={certificationInput?.issuedDate}
                onChange={HandleCertificationChange}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="expiryDate" className="candidate__info__label mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control"
                name="expiryDate"
                id="expiryDate"
                min={certificationInput?.issuedDate}
                value={certificationInput?.expiryDate}
                onChange={HandleCertificationChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn custom__btn mt-2"
              data-bs-dismiss="offcanvas"
              disabled={!isValidateCertification()}
            >
              {isUpdate ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsCertification;
