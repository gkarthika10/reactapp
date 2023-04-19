import React, { useState, useEffect } from "react";

// Helpers
import { toastSuccess, toastError } from "../../../helpers/Notification";
import ErrorBox from "./ErrorBox";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { setMyExperienceRedux } from "../../../store/resumeSlice";

// Media & Icons
import { BiTrash } from "react-icons/bi";

// work-experience & project initial obj
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

const MyExperience = ({ parsedInfo, stepPlusOne, stepMinusOne }) => {
  const dispatch = useDispatch();
  const {
    work_experience,
    projects,
    expected_role,
    current_employer,
    current_role,
    relevant_experience,
    total_experience,
    notice_period,
    social_network_links,
  } = useSelector((state) => state.resume.my_experience);

  // state for errors
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState([]);

  // states for (current_employer, current_role, expected_role, relevant_exp, total_exp, notice_period, social_network_links)
  const [expInfo, setExpInfo] = useState({
    current_employer: "",
    current_role: "",
    expected_role: "",
    relevant_experience: "",
    total_experience: "",
    notice_period: "",
  });
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    linkedin: parsedInfo?.data?.LINKEDIN,
    twitter: "",
    github: parsedInfo?.data?.GITHUB,
    facebook: "",
  });

  // states for work-experience(s)
  const [workExperienceInput, setWorkExperienceInput] = useState(work_experience_initial);
  const [workExperiences, setWorkExperiences] = useState([]);

  // states for project(s)
  const [projectInput, setProjectInput] = useState(project_initial);
  const [workProjects, setWorkProjects] = useState([]);

  // populate my-experience fields from redux-store (to avoid state wipe-out)
  useEffect(() => {
    // function to check values of all keys are empty in object
    const checkIsEmpty = (obj) => {
      const isNullish = Object.values(obj).every((value) => {
        if (value === "") return true;
        return false;
      });
      return isNullish;
    };

    try {
      setExpInfo({
        current_employer,
        current_role,
        expected_role,
        relevant_experience,
        total_experience,
        notice_period,
      });
      if (work_experience?.length > 0) setWorkExperiences(work_experience);
      if (projects?.length > 0) setWorkProjects(projects);
      if (!checkIsEmpty(social_network_links)) setSocialMediaLinks(social_network_links);
    } catch (err) {
      console.log(err);
      toastError("Some Error Occured! (Max Depth)");
    }
  }, [
    work_experience,
    projects,
    current_employer,
    current_role,
    expected_role,
    relevant_experience,
    total_experience,
    notice_period,
    social_network_links,
  ]);

  // handle expinfo input fields
  const HandleExpInfoInput = (e) => {
    setExpInfo((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
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
  const HandleWorkExperienceInput = (e) => {
    setWorkExperienceInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // handle add-work-experience
  const HandleAddExperience = () => {
    if (
      !workExperienceInput?.designation?.trim() ||
      !workExperienceInput?.company?.trim() ||
      !workExperienceInput?.location?.trim() ||
      !workExperienceInput?.startDate?.trim() ||
      !workExperienceInput?.endDate?.trim() ||
      !workExperienceInput?.role_desc?.trim()
    ) {
      toastError("Please fill all fields of Work Experience.");
      return;
    }

    const tmp = { ...workExperienceInput };
    setWorkExperiences((prevState) => {
      return [...prevState, tmp];
    });
    setWorkExperienceInput(work_experience_initial);
    toastSuccess("Work Experience Added!");
  };

  // handle delete-work-experience
  const HandleDeleteExperience = (event, company_name) => {
    const experiences = workExperiences.filter((item) => {
      return item.company !== company_name;
    });
    setWorkExperiences(experiences);
  };

  // handle project input-fields
  const HandleProjectInput = (e) => {
    setProjectInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // handle add project
  const HandleAddProject = () => {
    if (!projectInput?.title?.trim() || !projectInput?.description?.trim()) {
      toastError("Project Title & Description are required.");
      return;
    }

    const tmp = { ...projectInput };
    setWorkProjects((prevState) => {
      return [...prevState, tmp];
    });
    setProjectInput(project_initial);
    toastSuccess("Project Added Successfully!");
  };

  // handle delete project
  const HandleDeleteProject = (event, project_title) => {
    const projects = workProjects.filter((item) => {
      return item.title !== project_title;
    });
    setWorkProjects(projects);
  };

  // handle social-media-links
  const HandleSocialLinks = (e) => {
    setSocialMediaLinks((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // validate my-experience data before switching to next step
  const GetErrorsIfAny = () => {
    const errors = [];
    if (workExperiences?.length < 1)
      errors.push({
        ques: "Work Experience",
        ans: "The section Work Experience is required and atleast one experience is needed.",
      });
    if (workProjects?.length < 1)
      errors.push({
        ques: "Projects",
        ans: "The section Projects is required and atleast one project is needed.",
      });
    if (!expInfo?.current_employer?.trim())
      errors.push({
        ques: "Current Employer",
        ans: "The field Current Employer needed is required so that we won't show your profile to your current employer.",
      });
    if (!expInfo?.current_role?.trim())
      errors.push({
        ques: "Current Role",
        ans: "The field Current Role needed is required and must have a value.",
      });
    if (!expInfo?.expected_role?.trim())
      errors.push({
        ques: "Expected Role",
        ans: "The field Expected Role needed is required and must have a value.",
      });
    if (!expInfo?.total_experience?.trim() || isNaN(expInfo?.total_experience?.trim())) {
      errors.push({
        ques: "Total Experience",
        ans: "The field Total Experience neerded is required and must have a numeric value in years.",
      });
    }
    if (!expInfo?.relevant_experience?.trim() || isNaN(expInfo?.relevant_experience?.trim())) {
      errors.push({
        ques: "Relevant Experience",
        ans: "The field Relevant Experience needed is required and must have a numeric value in years.",
      });
    }
    if (!expInfo?.notice_period?.trim() || isNaN(expInfo?.notice_period?.trim())) {
      errors.push({
        ques: "Notice Period",
        ans: "The field Notice Period needed is required and must have a numeric value in days.",
      });
    }

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

    dispatch(
      setMyExperienceRedux({
        work_experience: workExperiences,
        projects: workProjects,
        current_employer: expInfo?.current_employer,
        current_role: expInfo?.current_role,
        expected_role: expInfo?.expected_role,
        relevant_experience: expInfo?.relevant_experience,
        total_experience: expInfo?.total_experience,
        notice_period: expInfo?.notice_period,
        social_network_links: { ...socialMediaLinks },
      })
    );
    navigateStep();
  };

  return (
    <div className="my__experience__box">
      {/* Errors Dialog (if any) */}
      <ErrorBox isOpen={modalIsOpen} onClose={() => setModalIsOpen(!modalIsOpen)} errors={errors} />

      <h5 className="step__heading">My Experience</h5>
      <div className="row">
        <div className="col-lg-4">
          <div className="sticky-lg-top mt-1 sticky__parsed__resume__box">
            <div className="sticky__parsed__resume">
              <div className="sticky__parsed__heading">
                <h6>My Experience</h6>
                <p>Extracted from your Resume. Copy &amp; Paste from here.</p>
              </div>
              {parsedInfo && (
                <div className="sticky__parsed__content">
                  {[...parsedInfo["WORK EXPERIENCE"]].map((line, idx) => {
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

            <form name="myExperienceForm" className="mt-4">
              {/* Work Experience */}
              <p className="block__heading pt-3">Work Experience</p>
              <div className="mb-4">
                <div className="row pb-2">
                  {[...workExperiences].map((experience, idx) => {
                    return (
                      <WorkExperienceItem
                        experienceInfo={experience}
                        idx={idx + 1}
                        key={`work_experience_${idx + 1}`}
                        handleDeleteExperience={HandleDeleteExperience}
                      />
                    );
                  })}
                </div>
                <div className="row pb-2 mt-3">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-1 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor={`designation`} className="form-label">
                        Job Title <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`designation`}
                        name={`designation`}
                        value={workExperienceInput.designation}
                        onChange={HandleWorkExperienceInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-2 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor={`company`} className="form-label">
                        Company <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`company`}
                        name={`company`}
                        value={workExperienceInput.company}
                        onChange={HandleWorkExperienceInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-2 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor={`location`} className="form-label">
                        Location <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={workExperienceInput.location}
                        onChange={HandleWorkExperienceInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-2 mt-3">
                    <div className="d-flex">
                      <div className="pe-3">
                        <label htmlFor="startDate" className="form-label d-block">
                          From <span className="required__symbol">*</span>
                        </label>
                        <input
                          type="month"
                          className="form-control"
                          name="startDate"
                          id="startDate"
                          max={getMonthYear(new Date())}
                          value={workExperienceInput.startDate}
                          onChange={HandleWorkExperienceInput}
                          required
                        />
                      </div>
                      <div className="pe-lg-0">
                        <label htmlFor="endDate" className="form-label d-block">
                          To <span className="required__symbol">*</span>
                        </label>
                        <input
                          type="month"
                          className="form-control"
                          name="endDate"
                          id="endDate"
                          min={getMonthYear(workExperienceInput.startDate)}
                          max={getMonthYear(new Date())}
                          value={workExperienceInput.endDate}
                          onChange={HandleWorkExperienceInput}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="pe-lg-4 mt-md-2 mt-3">
                    <label htmlFor="role_desc" className="form-label">
                      Role Description <span className="required__symbol">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="role_desc"
                      name="role_desc"
                      rows="2"
                      value={workExperienceInput.role_desc}
                      onChange={HandleWorkExperienceInput}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-2">
                  <p className="small text-muted">
                    <span style={{ fontWeight: 500 }}>NOTE:</span> <span>Keep the company name to be unique.</span>
                  </p>
                </div>
                <div className="row mt-2 pb-2">
                  <button type="button" className="mb-3 add__another__btn" onClick={HandleAddExperience}>
                    Add Experience
                  </button>
                </div>
              </div>

              <hr className="divider" />

              {/* Projects */}
              <p className="block__heading pt-3">Projects</p>
              <div className="mb-4">
                <div className="row pb-2">
                  {[...workProjects].map((project, idx) => {
                    return (
                      <ProjectItem
                        projectInfo={project}
                        idx={idx + 1}
                        key={`project_${idx + 1}`}
                        handleDeleteProject={HandleDeleteProject}
                      />
                    );
                  })}
                </div>
                <div className="row pb-2 mt-3">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-1 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor="title" className="form-label">
                        Project Title <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={projectInput.title}
                        onChange={HandleProjectInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row pb-2">
                  <div className="col-xl-6 col-lg-8 col-md-6 mt-md-2 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor="url" className="form-label">
                        Project URL
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="url"
                        name="url"
                        value={projectInput.url}
                        onChange={HandleProjectInput}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="pe-lg-4 mt-md-2 mt-3">
                    <label htmlFor="description" className="form-label">
                      Project Description <span className="required__symbol">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="2"
                      value={projectInput.description}
                      onChange={HandleProjectInput}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="row mt-3">
                  <p className="small text-muted">
                    <span style={{ fontWeight: 500 }}>NOTE:</span> <span>Keep the project title to be unique.</span>
                  </p>
                </div>
                <div className="row mt-2">
                  <button type="button" className="mb-3 add__another__btn" onClick={HandleAddProject}>
                    Add Project
                  </button>
                </div>
              </div>

              <hr className="divider" />

              {/* Experience & Availability */}
              <p className="block__heading pt-3">Experience &amp; Availability</p>
              <div className="row pb-3">
                <div className="col-sm-6 mt-md-2 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="current_employer" className="form-label">
                      Current Employer <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="current_employer"
                      name="current_employer"
                      value={expInfo.current_employer}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-2 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="current_role" className="form-label">
                      Current Role <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="current_role"
                      name="current_role"
                      value={expInfo.current_role}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="expected_role" className="form-label">
                      Expected Role <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="expected_role"
                      name="expected_role"
                      value={expInfo.expected_role}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="relevant_experience" className="form-label">
                      Relevant Experience (in yrs.) <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="relevant_experience"
                      name="relevant_experience"
                      value={expInfo.relevant_experience}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="total_experience" className="form-label">
                      Total Experience (in yrs.) <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="total_experience"
                      name="total_experience"
                      value={expInfo.total_experience}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="notice_period" className="form-label">
                      Notice Period (in days) <span className="required__symbol">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="notice_period"
                      name="notice_period"
                      value={expInfo.notice_period}
                      onChange={HandleExpInfoInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Social Network URLs */}
              <p className="block__heading pt-3">Social Network URLs</p>
              <div className="row">
                <div className="col-sm-6 mt-md-2 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="linkedin" className="form-label">
                      Linkedin
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="linkedin"
                      name="linkedin"
                      value={socialMediaLinks.linkedin}
                      onChange={HandleSocialLinks}
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-2 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="github" className="form-label">
                      Github
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="github"
                      name="github"
                      value={socialMediaLinks.github}
                      onChange={HandleSocialLinks}
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="twitter" className="form-label">
                      Twitter
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="twitter"
                      name="twitter"
                      value={socialMediaLinks.twitter}
                      onChange={HandleSocialLinks}
                    />
                  </div>
                </div>
                <div className="col-sm-6 mt-md-4 mt-3">
                  <div className="pe-xl-4">
                    <label htmlFor="facebook" className="form-label">
                      Facebook
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="facebook"
                      name="facebook"
                      value={socialMediaLinks.facebook}
                      onChange={HandleSocialLinks}
                    />
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

export const WorkExperienceItem = ({ experienceInfo, idx, handleDeleteExperience, isReview }) => {
  return (
    <div className="multi__resume__item" style={{ marginTop: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Work Experience {idx}</h6>
        {!isReview && (
          <button
            type="button"
            className="btn delete__btn"
            onClick={(e) => {
              handleDeleteExperience(e, experienceInfo.company);
            }}
          >
            <BiTrash className="delete__icon" />
            <span>Delete</span>
          </button>
        )}
      </div>
      <div className="row item__info mt-1 ps-md-3 ps-2">
        <div className="col-md-6 mt-3">
          <h6>Job Title</h6>
          <p>{experienceInfo?.designation}</p>
        </div>
        <div className="col-md-6 mt-3">
          <h6>Company</h6>
          <p>{experienceInfo?.company}</p>
        </div>
        <div className="col-md-6 mt-3">
          <h6>Location</h6>
          <p>{experienceInfo?.location}</p>
        </div>
        <div className="col-md-6 mt-3">
          <h6>From - To</h6>
          <p>
            {experienceInfo?.startDate} to {experienceInfo?.endDate}
          </p>
        </div>
        <div className="col-12 mt-3">
          <h6>Role Description</h6>
          <p>{experienceInfo?.role_desc}</p>
        </div>
      </div>
    </div>
  );
};

export const ProjectItem = ({ projectInfo, idx, handleDeleteProject, isReview }) => {
  return (
    <div className="multi__resume__item" style={{ marginTop: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Project {idx}</h6>
        {!isReview && (
          <button
            type="button"
            className="btn delete__btn"
            onClick={(e) => {
              handleDeleteProject(e, projectInfo.title);
            }}
          >
            <BiTrash className="delete__icon" />
            <span>Delete</span>
          </button>
        )}
      </div>
      <div className="row item__info mt-1 ps-md-3 ps-2">
        <div className="col-md-6 mt-3">
          <h6>Project Title</h6>
          <p>{projectInfo?.title}</p>
        </div>
        {projectInfo?.url && (
          <div className="col-md-6 mt-3">
            <h6>Project URL</h6>
            <div>
              <p className="custom__link__url" onClick={() => window.open(projectInfo?.url)}>
                {projectInfo?.url}
              </p>
            </div>
          </div>
        )}
        <div className="col-12 mt-3">
          <h6>Project Description</h6>
          <p>{projectInfo?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MyExperience;
