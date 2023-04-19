import React from "react";
import { useNavigate } from "react-router-dom";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { submitCandidateProfile } from "../../../store/resumeSlice";

// Helpers
import { getLocalStorage } from "../../../helpers/LocalStorage";
import { ScaleLoader } from "react-spinners";
import { STATUSES } from "../../../App";

// Media & Icons
import { BiPrinter, BiCheck } from "react-icons/bi";
import { FaRegFilePdf } from "react-icons/fa";

// Review Items
import { WorkExperienceItem, ProjectItem } from "./MyExperience";
import { EducationItem } from "./MyEducation";
import { SkillsItem, CertificationItem, WebsiteItem } from "./SkillsCertification";

const Review = ({ stepMinusOne }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    autofill_resume,
    my_information,
    my_experience,
    my_education,
    skills_certification,
    status: resume_status,
  } = useSelector((state) => state.resume);

  // allow user to print the review page
  const HandlePrintReview = (e) => {
    window.print();
  };

  // handle submit profile button
  const HandleSubmitProfile = () => {
    // get address in comma separated string format
    const getAddressStr = (addr) => {
      const tmpArr = [];
      for (let value in addr) tmpArr.push(addr[value]);
      return tmpArr.join(", ");
    };

    // backend accepted format
    const candidate_obj = {
      resume_url: autofill_resume?.resume_link,
      preferred_work_location: [...my_information?.preferred_worklocation],
      dob: my_information?.dob,
      gender: my_information?.gender,
      current_address: getAddressStr(my_information?.address?.current),
      permanent_address: getAddressStr(my_information?.address?.permanent),
      about: my_information?.about,
      experience: [...my_experience?.work_experience],
      projects: [...my_experience?.projects],
      current_employer: my_experience?.current_employer,
      current_role: my_experience?.current_role,
      expected_role: my_experience?.expected_role,
      relevant_experience: my_experience?.relevant_experience,
      total_experience: my_experience?.total_experience,
      notice_period: my_experience?.notice_period,
      links: { ...my_experience?.social_network_links },
      education: [...my_education?.education],
      skills: [...skills_certification?.skills],
      certifications: [...skills_certification?.certifications],
      accomplishments: skills_certification?.accomplishments,
      websites: [...skills_certification?.websites],
    };

    for (let info in candidate_obj) {
      if (typeof candidate_obj[info] === "object") {
        candidate_obj[info] = JSON.stringify(candidate_obj[info]);
      }
    }

    dispatch(submitCandidateProfile(candidate_obj, () => navigate("/candidate-profile")));
  };

  return (
    <div className="container-lg px-xl-5 review__box">
      <div className="d-flex justify-content-center align-items-center gap-3">
        <h5 className="step__heading mb-2">Review</h5>
        <span className="print__review__link">
          <button type="button" className="btn px-2 py-1 icon__link" onClick={HandlePrintReview}>
            (<BiPrinter size={20} /> <span>Print</span>)
          </button>
        </span>
      </div>
      <hr className="divider" />

      {/* My Information */}
      <MyInformationReview my_information={my_information} />
      <hr className="divider" />

      {/* My Experience */}
      <MyExperienceReview my_experience={my_experience} />
      <hr className="divider" />

      {/* Autofill With Resume */}
      {Object.keys(autofill_resume?.resume_file)?.length > 0 && (
        <>
          <AutofillResumeReview autofill_resume={autofill_resume} />
          <hr className="divider" />
        </>
      )}

      {/* My Education */}
      <MyEducationReview my_education={my_education} />
      <hr className="divider" />

      {/* Skills & Certification */}
      <SkillsCertificationReview skills_certification={skills_certification} />
      <hr className="divider" />

      <div className="mt-5 d-flex justify-content-end">
        <button type="button" className="btn back__btn" onClick={() => stepMinusOne()}>
          Back
        </button>
        <button
          type="button"
          className="btn continue__btn"
          onClick={HandleSubmitProfile}
          disabled={resume_status === STATUSES.LOADING ? true : false}
        >
          {resume_status === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

// Autofill with Resume Review Section
const AutofillResumeReview = ({ autofill_resume }) => {
  return (
    <div className="container-lg px-lg-5">
      <div className="row">
        <p className="block__heading mt-4 pt-3">Resume/CV</p>
      </div>
      <div className="row mt-2 file__accepted__box">
        <div className="col-2">
          <div className="pdf__col">
            <FaRegFilePdf className="pdf__icon" />
          </div>
        </div>
        <div className="col-9">
          <div className="accepted__content">
            <p>{autofill_resume?.resume_file?.name}</p>
            <p>{Math.round(autofill_resume?.resume_file?.size / 1024)} KB</p>
            <p className="d-flex align-items-center">
              <BiCheck className="file__accepted__icon" />
              <span>Successfully Uploaded!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// My-Information Review Seciton
const MyInformationReview = ({ my_information }) => {
  const { first_name, last_name, email, phone } = getLocalStorage("user");
  const { about, preferred_worklocation, address, dob, gender } = my_information;

  // get formatted dob date
  // const getDateFormatted = (date) => {
  //   const dob = new Date(date);
  //   function padTo2Digits(num) {
  //     return num.toString().padStart(2, "0");
  //   }
  //   return [padTo2Digits(dob.getDate()), padTo2Digits(dob.getMonth() + 1), padTo2Digits(dob.getFullYear())].join("/");
  // };

  // get formatted address
  const getAddressFormatted = (address_type) => {
    if (!address) return "";
    if (address_type === "current") {
      const aC = address?.[address_type];
      return `${aC?.current_street}, ${aC?.current_city}, ${aC?.current_state}, ${aC?.current_country}, ${aC?.current_zipcode}`;
    } else if (address_type === "permanent") {
      const aR = address?.[address_type];
      return `${aR?.permanent_street}, ${aR?.permanent_city}, ${aR?.permanent_state}, ${aR?.permanent_country}, ${aR?.permanent_zipcode}`;
    }
  };

  return (
    <div className="my__information__box my-5 px-lg-5">
      <h6 className="step__heading">My Information</h6>

      <div className="row review__content__box mt-5">
        <div className="col-12">
          <p className="review__label">About Yourself</p>
          <p className="review__value">{about}</p>
        </div>
        <div className="col-12">
          <p className="review__label">Preferred Locations</p>
          <p className="review__chip__box">
            {preferred_worklocation?.length > 0 &&
              [...preferred_worklocation].map((location, idx) => {
                return (
                  <span className="chip px-4" key={`${location}_${idx}`}>
                    {location}
                  </span>
                );
              })}
          </p>
        </div>
        <div className="col-6">
          <p className="review__label">Full Legal Name</p>
          <p className="review__value">{`${first_name} ${last_name}`}</p>
        </div>
        <div className="col-6">
          <p className="review__label">Email</p>
          <p className="review__value">{email}</p>
        </div>
        <div className="col-6">
          <p className="review__label">Phone</p>
          <p className="review__value">(+91) {phone}</p>
        </div>
        <div className="col-6">
          <p className="review__label">Date of Birth</p>
          <p className="review__value">{dob}</p>
        </div>
        <div className="col-12">
          <p className="review__label">Gender</p>
          <p className="review__value text-capitalize">{gender}</p>
        </div>
        <div className="col-6">
          <p className="review__label">Current Address</p>
          <p className="review__value">{getAddressFormatted("current")}</p>
        </div>
        <div className="col-6">
          <p className="review__label">Permanent Address</p>
          <p className="review__value">{getAddressFormatted("permanent")}</p>
        </div>
      </div>
    </div>
  );
};

// My-Experience Review Seciton
const MyExperienceReview = ({ my_experience }) => {
  const {
    work_experience,
    projects,
    current_employer,
    current_role,
    expected_role,
    relevant_experience,
    total_experience,
    notice_period,
    social_network_links,
  } = my_experience;

  return (
    <div className="row my__experience__box mt-5 px-lg-5">
      <h6 className="step__heading">My Experience</h6>
      <div className="row review__content__box mt-3">
        <div className="col-12">
          <p className="block__heading mt-4 pt-3">Work Experience</p>
          {work_experience?.length > 0 &&
            [...work_experience].map((experience, idx) => {
              return (
                <WorkExperienceItem
                  experienceInfo={experience}
                  key={`work_experience_${idx + 1}`}
                  idx={idx + 1}
                  isReview={true}
                />
              );
            })}
        </div>

        <hr className="divider mt-4" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-3">Projects</p>
          {projects?.length > 0 &&
            [...projects].map((project, idx) => {
              return <ProjectItem projectInfo={project} key={`project_${idx + 1}`} idx={idx + 1} isReview={true} />;
            })}
        </div>

        <hr className="divider mt-4" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-3">Experience &amp; Availability</p>
          <div className="row">
            <div className="col-sm-6">
              <p className="review__label">Current Employer</p>
              <p className="review__value">{current_employer}</p>
            </div>
            <div className="col-sm-6">
              <p className="review__label">Current Role</p>
              <p className="review__value">{current_role}</p>
            </div>
            <div className="col-sm-6">
              <p className="review__label">Expected Role</p>
              <p className="review__value">{expected_role}</p>
            </div>
            <div className="col-sm-6">
              <p className="review__label">Relevant Experience (in yrs.)</p>
              <p className="review__value">{relevant_experience} Year(s)</p>
            </div>
            <div className="col-sm-6">
              <p className="review__label">Total Experience (in yrs.)</p>
              <p className="review__value">{total_experience} Year(s)</p>
            </div>
            <div className="col-sm-6">
              <p className="review__label">Notice Period (in days)</p>
              <p className="review__value">{notice_period} Days</p>
            </div>
          </div>
        </div>

        <hr className="divider mt-4" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-3">Social Network URLs</p>
          <div className="row">
            <div className="col-md-6">
              <p className="review__label">Linkedin</p>
              <p className="review__value">
                {social_network_links?.linkedin ? social_network_links?.linkedin : "No Response"}
              </p>
            </div>
            <div className="col-md-6">
              <p className="review__label">Twitter</p>
              <p className="review__value">
                {social_network_links?.twitter ? social_network_links?.twitter : "No Response"}
              </p>
            </div>
            <div className="col-md-6">
              <p className="review__label">Github</p>
              <p className="review__value">
                {social_network_links?.github ? social_network_links?.github : "No Response"}
              </p>
            </div>
            <div className="col-md-6">
              <p className="review__label">Facebook</p>
              <p className="review__value">
                {social_network_links?.facebook ? social_network_links?.facebook : "No Response"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// My-Education Review Seciton
const MyEducationReview = ({ my_education }) => {
  const { education } = my_education;

  return (
    <div className="row my__education__box mt-5 px-lg-5">
      <h6 className="step__heading">My Education</h6>

      <div className="row review__content__box mt-2">
        <div className="col-12">
          <p className="block__heading mt-4 pt-3">Education</p>
          {education?.length > 0 &&
            [...education].map((education, idx) => {
              return (
                <EducationItem educationInfo={education} key={`education_${idx + 1}`} idx={idx + 1} isReview={true} />
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Skills-&-Certification Review Section
const SkillsCertificationReview = ({ skills_certification }) => {
  const { skills, certifications, accomplishments, websites } = skills_certification;

  return (
    <div className="row skills__certification__box mt-5 px-lg-5">
      <h6 className="step__heading">Skills &amp; Certification</h6>

      <div className="row review__content__box mt-2">
        <div className="col-12 mb-4">
          <p className="block__heading mt-4 pt-3">Skills</p>
          <p className="review__chip__box">
            {skills?.length > 0 &&
              [...skills].map((skill, idx) => {
                return <SkillsItem key={`skill_${idx + 1}`} skill={skill} isReview={true} />;
              })}
          </p>
        </div>

        <hr className="divider" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-2">Certifications</p>
          {certifications?.length > 0
            ? [...certifications].map((certification, idx) => {
                return (
                  <CertificationItem
                    certificationInfo={certification}
                    key={`certification_${idx + 1}`}
                    idx={idx + 1}
                    isReview={true}
                  />
                );
              })
            : "No Response"}
        </div>

        <hr className="divider mt-4" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-1">Accomplishments</p>
          <p className="review__value mt-4 mb-5">{accomplishments ? accomplishments : "No Response"}</p>
        </div>

        <hr className="divider" />

        <div className="col-12">
          <p className="block__heading mt-4 pt-1">Websites</p>
          {websites?.length > 0
            ? [...websites].map((website, idx) => {
                return <WebsiteItem websiteInfo={website} key={`website_${idx + 1}`} idx={idx + 1} isReview={true} />;
              })
            : "No Response"}
        </div>
      </div>
    </div>
  );
};

export default Review;
