import React, { useState, useEffect } from "react";

// Redux Stuff
import { useDispatch } from "react-redux";
import { updateCandidateProfile } from "../../../store/profileSlice";

// Media & Icons
import { BiPlusCircle, BiEdit, BiTrash, BiChevronDown } from "react-icons/bi";

// Helpers
import { getMonthString } from "../../../helpers/Utility";
import { toastError } from "../../../helpers/Notification";

// work experience & project initial data
const work_experience_initial = {
  designation: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  role_desc: "",
};
const project_initial = {
  title: "",
  url: "",
  description: "",
};

const WorkExperience = ({ profileInfo }) => {
  const dispatch = useDispatch();
  const { experience, projects } = profileInfo;

  // states for work experiences & projects
  const [workExperiences, setWorkExperiences] = useState([]);
  const [workProjects, setWorkProjects] = useState([]);

  // states for add/update form
  const [workExpForm, setWorkExpForm] = useState({});
  const [projForm, setProjForm] = useState({});

  // parsing work-experiences & projects
  useEffect(() => {
    try {
      const parsed_experiences = JSON.parse(experience);
      setWorkExperiences(parsed_experiences);

      const parsed_projects = JSON.parse(projects);
      setWorkProjects(parsed_projects);
    } catch (err) {
      console.log(err);
    }
  }, [experience, projects]);

  // handle work-experience deletion
  const HandleWorkExperienceDelete = (company_name) => {
    const exps = workExperiences?.filter((exp) => {
      return exp.company !== company_name;
    });

    dispatch(
      updateCandidateProfile({
        experience: JSON.stringify(exps),
      })
    );
  };

  // handle project deletion
  const HandleProjectDelete = (proj_title) => {
    const projs = workExperiences?.filter((proj) => {
      return proj.title !== proj_title;
    });

    dispatch(
      updateCandidateProfile({
        projects: JSON.stringify(projs),
      })
    );
  };

  // handle submit for work-experience form
  const HandleWorkExperienceSubmit = (e, expData) => {
    e.preventDefault();
    try {
      if (Object.keys(workExpForm)?.length > 0) {
        // update work-experience
        let deletePos = -1;
        const tmp = workExperiences?.filter((item, idx) => {
          if (item.company !== expData?.company) {
            deletePos = idx - 1;
            return true;
          }
          return false;
        });
        tmp.splice(deletePos, 0, expData);
        dispatch(
          updateCandidateProfile({
            experience: JSON.stringify(tmp),
          })
        );
        setWorkExpForm({});
      } else {
        // add work-experience
        let tmp = workExperiences?.filter((item) => {
          if (item.company === expData?.company) return true;
          return false;
        });
        if (tmp?.length > 0) {
          toastError("Work Experience Already Added!");
          return false;
        }

        tmp = [expData, ...workExperiences];
        dispatch(
          updateCandidateProfile({
            experience: JSON.stringify(tmp),
          })
        );
        setWorkExpForm({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  // handle submit for project form
  const HandleProjectSubmit = (e, projData) => {
    e.preventDefault();
    try {
      if (Object.keys(projForm)?.length > 0) {
        // update project
        let deletePos = -1;
        const tmp = workProjects?.filter((item, idx) => {
          if (item.title !== projData?.title) {
            deletePos = idx - 1;
            return true;
          }
          return false;
        });
        tmp.splice(deletePos, 0, projData);
        dispatch(
          updateCandidateProfile({
            projects: JSON.stringify(tmp),
          })
        );
        setProjForm({});
      } else {
        // add project
        let tmp = workProjects?.filter((item) => {
          if (item.title === projData?.title) return true;
          return false;
        });
        if (tmp?.length > 0) {
          toastError("Project Already Added!");
          return false;
        }

        tmp = [projData, ...workProjects];
        dispatch(
          updateCandidateProfile({
            projects: JSON.stringify(tmp),
          })
        );
        setProjForm({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get from & to date in user-friendly way
  const getFromTo = (date) => {
    if (date) {
      try {
        const dt = new Date(date);
        return `${getMonthString(date, true)} ${dt.getFullYear()}`;
      } catch (err) {
        console.log(err);
        return "";
      }
    } else return "";
  };

  return (
    <div className="work__experience__box px-lg-4">
      {/* Work Experiences */}
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="d-sm-flex align-items-center justify-content-between px-sm-3">
          <h6 className="profile__section__heading">Work Experience</h6>
          <button
            type="button"
            name="edit_add_btn"
            className="btn text-success"
            data-bs-toggle="offcanvas"
            data-bs-target="#addEditWorkExperienceForm"
            aria-controls="addEditWorkExperienceForm"
            onClick={() => setWorkExpForm({})}
          >
            <BiPlusCircle />
            <span>
              Add<span>Experience</span>
            </span>
          </button>
        </div>

        <div className="container-fluid px-sm-4">
          {[...workExperiences].map((item, idx) => {
            return (
              <div
                className="row mt-4 pt-4 pb-3 px-md-5 px-xs-4 px-2 rounded-3"
                style={{ background: "#DEDDDD" }}
                key={`experience_${idx}_${item?.company}`}
              >
                <div className="col-lg-10">
                  <div className="row">
                    <div className="col-lg-5 col-md-6">
                      <label htmlFor={`candidate_company_${idx}`} className="candidate__info__label">
                        Company
                      </label>
                      <p className="candidate__info__value">{item?.company}</p>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <label htmlFor={`candidate_job_title_${idx}`} className="candidate__info__label">
                        Job Title
                      </label>
                      <p className="candidate__info__value">{item?.designation}</p>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label htmlFor={`candidate_work_location_${idx}`} className="candidate__info__label">
                        Location
                      </label>
                      <p className="candidate__info__value">{item?.location}</p>
                    </div>
                    <div className="col-lg-5 col-md-6">
                      <div className="candidate__info__value">
                        <div className="tooltip__link">
                          <span className="tooltip__text">
                            <span>Role Description</span>
                            <BiChevronDown />
                          </span>
                          <span className="hovercard">
                            <div className="arrow"></div>
                            <div className="tooltiptext">{item?.role_desc}</div>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 col-6">
                      <label htmlFor={`candidate_start_date_${idx}`} className="candidate__info__label">
                        From
                      </label>
                      <p className="candidate__info__value">{getFromTo(item?.startDate)}</p>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 col-6">
                      <label htmlFor={`candidate_end_date_${idx}`} className="candidate__info__label">
                        To
                      </label>
                      <p className="candidate__info__value">{getFromTo(item?.endDate)}</p>
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
                        data-bs-target="#addEditWorkExperienceForm"
                        onClick={() => setWorkExpForm(item)}
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
                        onClick={() => HandleWorkExperienceDelete(item?.company)}
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

      {/* Projects */}
      <div className="row section__bg p-sm-4 py-4 px-3 mt-4">
        <div className="d-sm-flex align-items-center justify-content-between px-sm-3">
          <h6 className="profile__section__heading">Projects</h6>
          <button
            type="button"
            name="edit_add_btn"
            className="btn text-success"
            data-bs-toggle="offcanvas"
            data-bs-target="#addEditProjectForm"
            aria-controls="addEditProjectForm"
            onClick={() => setProjForm({})}
          >
            <BiPlusCircle />
            <span>
              Add<span>Project</span>
            </span>
          </button>
        </div>

        {workProjects?.length > 0 && (
          <div className="container-fluid px-sm-4">
            {[...workProjects].map((item, idx) => {
              return (
                <div
                  className="row mt-4 pt-4 pb-3 px-md-5 px-xs-4 px-2 rounded-3"
                  style={{ background: "#DEDDDD" }}
                  key={`project_${idx}_${item?.title}`}
                >
                  <div className="col-lg-10">
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <label htmlFor={`candidate_project_${idx}`} className="candidate__info__label">
                          Title
                        </label>
                        <p className="candidate__info__value">{item?.title}</p>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <label htmlFor={`candidate_url${idx}`} className="candidate__info__label">
                          URL
                        </label>
                        <a className="candidate__info__value d-block" href={item?.url} target="_blank" rel="noreferrer">
                          {item?.url}
                        </a>
                      </div>
                      <div className="col-12">
                        <label htmlFor={`candidate_description_${idx}`} className="candidate__info__label">
                          Description
                        </label>
                        <p className="candidate__info__value fw-normal">{item?.description}</p>
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
                          data-bs-target="#addEditProjectForm"
                          onClick={() => setProjForm(item)}
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
                          onClick={() => {
                            HandleProjectDelete(item?.title);
                          }}
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
        )}
      </div>

      {/* Work-Experience & Project Add/Edit Form Sidebar */}
      <WorkExperienceForm
        experienceInfo={workExpForm}
        handleSubmit={HandleWorkExperienceSubmit}
        isUpdate={Object.keys(workExpForm)?.length > 0 ? true : false}
      />
      <ProjectForm
        projectInfo={projForm}
        handleSubmit={HandleProjectSubmit}
        isUpdate={Object.keys(projForm)?.length > 0 ? true : false}
      />
    </div>
  );
};

// Work-Experience Add/Update Form Sidebar
const WorkExperienceForm = ({ experienceInfo, handleSubmit, isUpdate }) => {
  const [experienceInput, setExperienceInput] = useState(work_experience_initial);

  // in-case of isUpdate, we get experienceInfo
  useEffect(() => {
    if (Object.keys(experienceInfo)?.length > 0) setExperienceInput(experienceInfo);
  }, [experienceInfo]);

  // handle work experience input changes
  const HandleWorkExperienceChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setExperienceInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // handle work experience input fields (with startDate & endDate)
  const getMonthYear = (date) => {
    if (!date) return;
    let dt = null;
    if (typeof date === "object") dt = date.toISOString().split("-");
    else if (typeof date === "string") dt = new Date(date).toISOString().split("-");
    return dt ? `${dt[0]}-${dt[1]}` : "";
  };

  // validation for work-experience add/update input fields
  const isValidateExperience = () => {
    let result = false;
    const { designation, company, location, startDate, endDate, role_desc } = experienceInput;

    if (
      designation?.trim() &&
      company?.trim() &&
      location?.trim() &&
      role_desc?.trim() &&
      startDate?.trim() &&
      endDate?.trim()
    )
      result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditWorkExperienceForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditWorkExperienceFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setExperienceInput(work_experience_initial)}
        ></button>
        <h5 className="offcanvas-title" id="addEditWorkExperienceFormLabel">
          {isUpdate ? "Update" : "Add"} Work Experience
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditWorkExperienceForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, experienceInput);
            setExperienceInput(work_experience_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="company" className="candidate__info__label mb-1">
                Company <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="company"
                id="company"
                value={experienceInput?.company}
                onChange={HandleWorkExperienceChange}
                readOnly={isUpdate ? true : false}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="designation" className="candidate__info__label mb-1">
                Job Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="designation"
                id="designation"
                value={experienceInput?.designation}
                onChange={HandleWorkExperienceChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="location" className="candidate__info__label mb-1">
                Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="location"
                id="location"
                value={experienceInput?.location}
                onChange={HandleWorkExperienceChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="role_desc" className="candidate__info__label mb-1">
                Role Description <span className="text-danger">*</span>
              </label>
              <textarea
                name="role_desc"
                id="role_desc"
                rows="4"
                className="form-control"
                value={experienceInput?.role_desc}
                onChange={HandleWorkExperienceChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row px-0">
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="startDate" className="form-label d-block">
                    From <span className="required__symbol">*</span>
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    name="startDate"
                    id="startDate"
                    max={getMonthYear(new Date())}
                    value={experienceInput?.startDate}
                    onChange={HandleWorkExperienceChange}
                    required
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label d-block">
                    To <span className="required__symbol">*</span>
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    name="endDate"
                    id="endDate"
                    min={getMonthYear(experienceInput?.startDate)}
                    max={getMonthYear(new Date())}
                    value={experienceInput?.endDate}
                    onChange={HandleWorkExperienceChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn custom__btn mt-2"
              data-bs-dismiss="offcanvas"
              disabled={!isValidateExperience()}
            >
              {isUpdate ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Projects Add/Update Form Sidebar
const ProjectForm = ({ projectInfo, handleSubmit, isUpdate }) => {
  const [projectInput, setProjectInput] = useState(project_initial);

  // in-case of isUpdate, we get projectInfo
  useEffect(() => {
    if (Object.keys(projectInfo)?.length > 0) setProjectInput(projectInfo);
  }, [projectInfo]);

  // handle work experience input changes
  const HandleProjectChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setProjectInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  // validation for work-experience add/update input fields
  const isValidateProject = () => {
    let result = false;
    const { title, description } = projectInput;

    if (title?.trim() && description?.trim()) result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="addEditProjectForm"
      data-bs-scroll="false"
      data-bs-backdrop="false"
      aria-labelledby="addEditProjectFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-sm-5 gap-3 px-2">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => setProjectInput(project_initial)}
        ></button>
        <h5 className="offcanvas-title" id="addEditProjectFormLabel">
          {isUpdate ? "Update" : "Add"} Project
        </h5>
      </div>

      <div className="offcanvas-body">
        <form
          name="addEditProjectForm"
          className="row px-sm-3"
          onSubmit={(e) => {
            handleSubmit(e, projectInput);
            setProjectInput(project_initial);
          }}
        >
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="title" className="candidate__info__label mb-1">
                Project Title <span className="text-danger">*</span>
              </label>
              <textarea
                name="title"
                id="title"
                rows="2"
                className="form-control"
                value={projectInput?.title}
                onChange={HandleProjectChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="url" className="candidate__info__label mb-1">
                URL
              </label>
              <input
                type="url"
                className="form-control"
                name="url"
                id="url"
                value={projectInput?.url}
                onChange={HandleProjectChange}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label htmlFor="description" className="candidate__info__label mb-1">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                rows="11"
                className="form-control"
                value={projectInput?.description}
                onChange={HandleProjectChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="mb-3">
            <button
              type="submit"
              className="btn custom__btn mt-2"
              data-bs-dismiss="offcanvas"
              disabled={!isValidateProject()}
            >
              {isUpdate ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkExperience;
