import React, { useState } from "react";

// Media & Icons
import { BiPlusCircle, BiEdit, BiTrash, BiChevronDown, BiX } from "react-icons/bi";
import JobDescLogo from "../../../media/icons/Job_Description_Logo.png";

// Helpers
import { toastError } from "../../../helpers/Notification";

const DemoJobs = [
  {
    job_id: 52435242,
    job_profile: "Software Engineer",
    work_location: "Pune, India",
    experience: "1-4",
    required_skills: [],
    joining_in: "60",
    open_position: 8,
    job_desc: "Software Engineer Role",
  },
  {
    job_id: 52487452,
    job_profile: "Senior Software Engineer",
    work_location: "Chennai, India",
    experience: "5-8",
    required_skills: [],
    joining_in: "60",
    open_position: 1,
    job_desc: "Senior Software Engineer Role",
  },
  {
    job_id: 52412452,
    job_profile: "Principal Engineer",
    work_location: "Bengaluru, India",
    experience: "10-15",
    required_skills: [],
    joining_in: "90",
    open_position: 1,
    job_desc: "Principal Engineer Role",
  },
];

// Job Role Initial Data
const job_role_initial = {
  job_profile: "",
  experience: "",
  job_desc: "",
  required_skills: [],
  work_location: "",
  joining_in: "",
  open_position: "",
};

const JobRoles = () => {
  const HandleJobRoleSubmit = (e, jobRoleInfo) => {
    e.preventDefault();
    console.log(jobRoleInfo);
  };

  return (
    <div className="job__roles__box">
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="row">
          <div className="col-sm-8 col-6">
            <h5 className="console__section__heading mt-1">Job Roles</h5>
          </div>
          <div className="col-sm-4 col-6">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                name="edit_add_btn"
                className="btn text-success"
                data-bs-toggle="offcanvas"
                data-bs-target="#employerConsoleForm"
              >
                <BiPlusCircle />
                <span>Add Job Role</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container-fluid px-xl-5 mt-3">
          {[...DemoJobs].map((job) => {
            return (
              <div
                className="row mt-4 pt-4 pb-2 px-md-5 px-xs-4 px-2 rounded-3"
                style={{ background: "#DEDDDD" }}
                key={job?.job_id?.toString()}
              >
                <div className="col-lg-4 col-sm-6 col-7 mt-md-0 mt-2">
                  <p className="job__role__name">{job?.job_profile}</p>
                  <p className="work__location">{job?.work_location}</p>
                </div>
                <div className="col-lg-3 col-sm-6 col-5 mt-sm-0 mt-2">
                  <p className="job__details">Experience: {job?.experience} Years</p>
                  <div className="tooltip__link">
                    <span className="tooltip__text">
                      <span>Required Skills</span>
                      <BiChevronDown />
                    </span>
                    <span className="hovercard">
                      <div className="arrow"></div>
                      <div className="tooltiptext">
                        React.js, Redux, JavaScript, Python3, Java, SQL, Frontend Development, Robotic Process
                        Automation ...
                      </div>
                    </span>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 col-7 mt-sm-0 mt-2">
                  <p className="job__details">Joining In: {job?.joining_in} Days</p>
                  <p className="job__details">Open Positions: {job?.open_position}</p>
                </div>
                <div className="col-lg-1 col-sm-2 col-2 mt-sm-0 mt-2">
                  <div className="job__desc__box d-flex align-items-center h-75">
                    <img src={JobDescLogo} alt="Job Description" />
                  </div>
                </div>
                <div className="col-lg-1 col-sm-4 col-3 mt-sm-0 mt-2">
                  <div className="d-flex justify-content-sm-end align-items-center gap-2 h-75">
                    <button name="edit_add_btn" className="btn text-primary">
                      <BiEdit />
                    </button>
                    <button name="edit_add_btn" className="btn text-danger">
                      <BiTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Job Role Form Sidebar */}
      <AddEditJobRoleForm handleSubmit={HandleJobRoleSubmit} />
    </div>
  );
};

const AddEditJobRoleForm = ({ handleSubmit }) => {
  const [jobRole, setJobRole] = useState(job_role_initial);
  const [skillInput, setSkillInput] = useState("");

  // handle job role field change
  const HandleJobRoleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setJobRole((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  // handle preferred-work-location input
  const HandleSkillInput = (e) => {
    if (e.key === "Tab") {
      // if already exist
      if (jobRole?.required_skills.includes(skillInput)) {
        toastError("Location Already Added.");
        return;
      }

      if (skillInput !== "") {
        const skills = [...jobRole?.required_skills, skillInput];
        setJobRole((prevState) => {
          return { ...prevState, required_skills: [...skills] };
        });
        setSkillInput("");
      }
    }
  };

  // handle to remove the skill
  const HandleRemoveSkill = (e) => {
    if (e.target !== e.currentTarget) return;
    const id = e.currentTarget.id;
    const skills = jobRole?.required_skills?.filter((skill) => {
      return skill !== id;
    });
    setJobRole((prevState) => {
      return { ...prevState, required_skills: [...skills] };
    });
  };

  // handle validation then only allow to submit
  const isValidate = () => {
    let result = false;
    const { job_profile, experience, job_desc, required_skills, work_location, joining_in, open_position } = jobRole;
    if (
      job_profile.trim() &&
      experience.trim() &&
      job_desc.trim() &&
      required_skills?.length > 0 &&
      work_location.trim() &&
      joining_in.trim() &&
      parseInt(open_position) > 0
    )
      result = true;
    return result;
  };

  return (
    <div
      className="offcanvas offcanvas-end authModal"
      tabIndex="-1"
      id="employerConsoleForm"
      aria-labelledby="employerConsoleFormLabel"
    >
      <div className="offcanvas-header justify-content-start gap-5">
        <button
          type="button"
          className="btn-close text-reset shadow-none"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <h5 className="offcanvas-title" id="employerConsoleFormLabel">
          Add Job Role
        </h5>
      </div>
      <div className="offcanvas-body">
        <form
          name="addEditJobRoleForm"
          className="px-3"
          onSubmit={(e) => {
            handleSubmit(e, jobRole);
            setJobRole(job_role_initial);
          }}
        >
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="job_profile"
              id="job_profile"
              placeholder="Job Profile... *"
              value={jobRole?.job_profile}
              onChange={HandleJobRoleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="experience"
              id="experience"
              placeholder="Experience (in Yrs.)... *"
              value={jobRole?.experience}
              onChange={HandleJobRoleChange}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="job_desc"
              id="job_desc"
              rows="3"
              className="form-control"
              style={{ boxShadow: "none" }}
              placeholder="Job Description... *"
              value={jobRole?.job_desc}
              onChange={HandleJobRoleChange}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="input__chip__label">
              {[...jobRole?.required_skills].map((skill, idx) => {
                return (
                  <span className="chip" key={`${skill}_${idx}`}>
                    <span>{skill}</span>
                    <button type="button">
                      <BiX className="icon" id={skill} onClick={HandleRemoveSkill} />
                    </button>
                  </span>
                );
              })}
              <input
                type="text"
                id="required_skills"
                name="required_skills"
                placeholder="Type Skill &amp; Tab... *"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value.toLowerCase())}
                onKeyDown={HandleSkillInput}
              />
            </label>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="work_location"
              id="work_location"
              placeholder="Work Location... *"
              value={jobRole?.work_location}
              onChange={HandleJobRoleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="joining_in"
              id="joining_in"
              placeholder="Joining Availability (in Days)... *"
              value={jobRole?.joining_in}
              onChange={HandleJobRoleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              name="open_position"
              id="open_position"
              min="1"
              placeholder="Open Positions... *"
              value={jobRole?.open_position}
              onChange={HandleJobRoleChange}
              required
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn custom__btn" data-bs-dismiss="offcanvas" disabled={!isValidate()}>
              Add Job Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobRoles;
