import React, { useState, useEffect } from "react";
import Rating from "react-rating";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { setSkillsCertificationRedux } from "../../../store/resumeSlice";

// Helpers
import { toastSuccess, toastError } from "../../../helpers/Notification";

// Media & Icons
import { BiTrash, BiX } from "react-icons/bi";
import { BsFillStarFill } from "react-icons/bs";
import StarFullIcon from "../../../media/icons/star-full.png";
import StarEmptyIcon from "../../../media/icons/star-empty.png";

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

const SkillsCertification = ({ parsedInfo, stepPlusOne, stepMinusOne }) => {
  const dispatch = useDispatch();
  const { skills, certifications, websites, accomplishments } = useSelector(
    (state) => state.resume.skills_certification
  );

  // states for skills
  const [skillsInput, setSkillsInput] = useState(skills_initial);
  const [skillsInfo, setSkillsInfo] = useState([]);

  // states for certifications
  const [certificationInput, setCertificationInput] = useState(certification_initial);
  const [certificationsInfo, setCertificationsInfo] = useState([]);

  // states for accomplishments
  const [accomplishmentsInfo, setAccomplishmentsInfo] = useState("");

  // states for websites
  const [websiteInput, setWebsiteInput] = useState("");
  const [websitesInfo, setWebsitesInfo] = useState([]);

  // populate skills & certification fields from redux-store (to avoid state wipe-out)
  useEffect(() => {
    try {
      if (skills?.length > 0) setSkillsInfo(skills);
      if (certifications?.length > 0) setCertificationsInfo(certifications);
      if (accomplishments !== "") setAccomplishmentsInfo(accomplishments);
      if (websites?.length > 0) setWebsitesInfo(websites);
    } catch (err) {
      console.log(err);
      toastError("Some Error Occured! (Max Depth)");
    }
  }, [skills, certifications, websites, accomplishments]);

  // handle skills input fields
  const HandleSkillsInput = (e) => {
    setSkillsInput((prevState) => {
      return { ...prevState, name: e.target.value };
    });
  };
  const HandleSkillsInputRating = (rate) => {
    setSkillsInput((prevState) => {
      return { ...prevState, rating: rate };
    });
  };

  // handle when user click on recommended skill then populate in input field
  const HandlePopulateSkill = (skill_name) => {
    setSkillsInput({
      name: skill_name,
      rating: 0,
    });
  };

  // handle add skills
  const HandleAddSkills = () => {
    const tmp = { ...skillsInput };
    const skill_names = skillsInfo.map((skill) => {
      return skill.name;
    });

    // validations
    if (skillsInfo?.length >= 10) {
      toastError("You Can Add Atmost 10 Skills!");
      return;
    } else if (tmp.name.trim() === "" || tmp.rating === 0) {
      toastError("Please fill Skill Name & Rating!");
      return;
    } else if (skill_names.includes(tmp.name)) {
      toastError("Skill Already Added!");
      return;
    }

    setSkillsInfo((prevState) => {
      return [...prevState, tmp];
    });
    setSkillsInput(skills_initial);
  };

  // handle delete skills
  const HandleDeleteSkills = (event, skill_name) => {
    const skills = skillsInfo.filter((item) => {
      return item.name !== skill_name;
    });
    setSkillsInfo(skills);
  };

  // handle certification input fields
  const HandleCertificationInput = (e) => {
    setCertificationInput((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // handle add-certification
  const HandleAddCertification = () => {
    if (!certificationInput?.name?.trim() || !certificationInput?.issuedBy?.trim()) {
      toastError("Certification Name & Issued Institute are required.");
      return;
    }

    const tmp = { ...certificationInput };
    setCertificationsInfo((prevState) => {
      return [...prevState, tmp];
    });
    setCertificationInput(certification_initial);
    toastSuccess("Certification Added Successfully!");
  };

  // handle delete certification
  const HandleDeleteCertification = (event, certification_name) => {
    const certifications = certificationsInfo.filter((item) => {
      return item.name !== certification_name;
    });
    setCertificationsInfo(certifications);
  };

  // handle accomplishments input field
  const HandleAccomplishmentsInput = (e) => {
    setAccomplishmentsInfo(e.target.value);
  };

  // handle websites input field
  const HandleWebsiteInput = (e) => {
    setWebsiteInput(e.target.value);
  };

  // handle add website
  const HandleAddWebsite = () => {
    let tmp = websiteInput;
    if (tmp.trim() === "") {
      toastError("Please fill Website URL Field!");
      return;
    }

    if (!tmp.startsWith("https://") && !tmp.startsWith("http://")) tmp = "https://" + tmp;
    if (websitesInfo.includes(tmp)) {
      toastError("Website Already Already Added!");
      return;
    }

    setWebsitesInfo((prevState) => {
      return [...prevState, tmp];
    });
    setWebsiteInput("");
    toastSuccess("Website Added Successfully!");
  };

  // handle delete website
  const HandleDeleteWebsite = (event, website_url) => {
    const websites = websitesInfo.filter((item) => {
      return item !== website_url;
    });
    setWebsitesInfo(websites);
  };

  // handle save & continue
  const HandleSaveContinue = (event, navigateStep) => {
    if (skillsInfo?.length < 5 || skillsInfo?.length > 10) {
      toastError("Atleast 5 & Atmost 10 Skills needed!");
      return;
    }

    dispatch(
      setSkillsCertificationRedux({
        skills: [...skillsInfo],
        certifications: [...certificationsInfo],
        accomplishments: accomplishmentsInfo,
        websites: [...websitesInfo],
      })
    );
    navigateStep();
  };

  return (
    <div className="skills__certification__box">
      <h5 className="step__heading">Skills &amp; Certification</h5>
      <div className="row">
        <div className="col-lg-4">
          <div className="sticky-lg-top mt-1 sticky__parsed__resume__box">
            <div className="sticky__parsed__resume">
              <div className="sticky__parsed__heading">
                <h6>Skills &amp; Certification</h6>
                <p>Extracted from your Resume. Copy &amp; Paste from here.</p>
              </div>
              <div className="sticky__parsed__content">
                <p style={{ fontWeight: 500 }}>
                  Recommended Skills - <span className="text-muted">(click to add)</span>
                </p>
                {parsedInfo?.Skills?.length > 0 && (
                  <div className="skills__chip__box">
                    {[...parsedInfo?.Skills].map((skill, idx) => {
                      return (
                        <span
                          className="chip pe-3 py-1"
                          key={`skill_${idx + 1}`}
                          onClick={() => HandlePopulateSkill(skill)}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="step__content mt-4 ps-xl-4 ps-lg-3">
            <p className="required__line pt-2">
              <span className="required__symbol">*</span> Indicates a required field
            </p>

            <form name="myEducationForm" className="mt-4">
              {/* Skills */}
              <p className="block__heading pt-3">Skills</p>
              <p className="text-muted small">Add your TOP 10 Skills &amp; Rate yourself.</p>
              <div className="my-4">
                <div className="row">
                  {skillsInfo?.length > 0 && (
                    <div className="skills__chip__box pb-2">
                      {[...skillsInfo].map((skill, idx) => {
                        return (
                          <SkillsItem key={`skill_${idx + 1}`} skill={skill} handleDeleteSkills={HandleDeleteSkills} />
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="row pb-3">
                  <div className="col-sm-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="skill" className="form-label">
                        Type to Add Skill <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="skill"
                        name="skill"
                        value={skillsInput.name}
                        onChange={HandleSkillsInput}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-5 offset-lg-1 col-sm-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="rating" className="form-label">
                        How confident you are? <span className="required__symbol">*</span>
                      </label>
                      <div className="rating__box">
                        <Rating
                          emptySymbol={<img src={StarEmptyIcon} className="icon" alt="empty_star" />}
                          fullSymbol={<img src={StarFullIcon} className="icon" alt="filled_star" />}
                          fractions={2}
                          initialRating={skillsInput.rating}
                          onChange={(rate) => HandleSkillsInputRating(rate)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <button type="button" className="btn add__another__btn" onClick={HandleAddSkills}>
                    Add Skill
                  </button>
                </div>
              </div>

              <hr className="divider" />

              {/* Certifications */}
              <p className="block__heading pt-3">Certifications</p>
              <div className="mb-4">
                <div className="row pb-2">
                  {[...certificationsInfo].map((certification, idx) => {
                    return (
                      <CertificationItem
                        certificationInfo={certification}
                        idx={idx + 1}
                        key={`certification_${idx + 1}`}
                        handleDeleteCertification={HandleDeleteCertification}
                      />
                    );
                  })}
                </div>
                <div className="row pb-2">
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="name" className="form-label">
                        Certification <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={certificationInput.name}
                        onChange={HandleCertificationInput}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="pe-xl-4">
                      <label htmlFor="issuedBy" className="form-label">
                        Issued By <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="issuedBy"
                        name="issuedBy"
                        value={certificationInput.issuedBy}
                        onChange={HandleCertificationInput}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-8 col-md-6 mt-3">
                    <div className="d-flex">
                      <div className="pe-4">
                        <label htmlFor="issuedDate" className="form-label d-block">
                          Issued Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="issuedDate"
                          id="issuedDate"
                          max={new Date()?.toISOString()?.split("T")[0]}
                          value={certificationInput.issuedDate}
                          onChange={HandleCertificationInput}
                          required
                        />
                      </div>
                      <div className="pe-lg-0">
                        <label htmlFor="expiryDate" className="form-label d-block">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          id="expiryDate"
                          min={certificationInput.issuedDate}
                          value={certificationInput.expiryDate}
                          onChange={HandleCertificationInput}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <button type="button" className="mt-2 mb-3 add__another__btn" onClick={HandleAddCertification}>
                    Add Certification
                  </button>
                </div>
              </div>

              <hr className="divider" />

              {/* Accomplishments */}
              <p className="block__heading pt-3">Accomplishments</p>
              <div className="my-4 pb-3">
                <div className="pe-lg-4 mt-md-2 mt-3">
                  <label htmlFor="accomplishments" className="form-label">
                    Accomplishments
                  </label>
                  <textarea
                    className="form-control"
                    id="accomplishments"
                    name="accomplishments"
                    rows="3"
                    value={accomplishmentsInfo}
                    onChange={HandleAccomplishmentsInput}
                  ></textarea>
                </div>
              </div>

              <hr className="divider" />

              {/* Websites */}
              <p className="block__heading pt-3">Websites</p>
              <p className="text-muted small">Add any relevant websites. Format should be: http://</p>
              <div className="my-4">
                <div className="row pb-2">
                  {[...websitesInfo].map((website, idx) => {
                    return (
                      <WebsiteItem
                        key={`website_${idx + 1}`}
                        websiteInfo={website}
                        handleDeleteWebsite={HandleDeleteWebsite}
                      />
                    );
                  })}
                </div>
                <div className="row pb-2">
                  <div className="col-md-6 mt-md-1 mt-3">
                    <div className="pe-lg-4">
                      <label htmlFor="website" className="form-label">
                        URL <span className="required__symbol">*</span>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={websiteInput}
                        onChange={HandleWebsiteInput}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <button type="button" className="mb-3 add__another__btn" onClick={HandleAddWebsite}>
                    Add Website
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="mt-md-5 mt-3 d-flex justify-content-md-end">
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

export const SkillsItem = ({ skill, handleDeleteSkills, isReview }) => {
  return (
    <span className="chip px-4">
      <span style={{ fontSize: "0.95rem" }}>
        {skill.name} ({skill.rating} <BsFillStarFill style={{ transform: "translateY(-1.8px)", color: "#0f643b" }} />)
      </span>
      {!isReview && (
        <button type="button">
          <BiX className="icon" onClick={(e) => handleDeleteSkills(e, skill.name)} />
        </button>
      )}
    </span>
  );
};

export const CertificationItem = ({ certificationInfo, idx, handleDeleteCertification, isReview }) => {
  return (
    <div className="multi__resume__item" style={{ marginTop: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Certification {idx}</h6>
        {!isReview && (
          <button
            type="button"
            className="btn delete__btn"
            onClick={(e) => {
              handleDeleteCertification(e, certificationInfo.name);
            }}
          >
            <BiTrash className="delete__icon" />
            <span>Delete</span>
          </button>
        )}
      </div>
      <div className="row item__info mt-1 ps-md-3 ps-2">
        <div className="col-md-6 mt-3">
          <h6>Certification</h6>
          <p>{certificationInfo?.name}</p>
        </div>
        <div className="col-md-6 mt-3">
          <h6>Issued By</h6>
          <p>{certificationInfo?.issuedBy}</p>
        </div>
        <div className="col-12 mt-3">
          <h6>Valid From - To</h6>
          <p>
            {certificationInfo?.issuedDate && certificationInfo?.expiryDate
              ? `${certificationInfo?.issuedDate} to ${certificationInfo?.expiryDate}`
              : "No Response"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const WebsiteItem = ({ websiteInfo, handleDeleteWebsite, isReview }) => {
  const OpenWebsiteLink = (website_url) => {
    window.open(website_url);
  };

  return (
    <div className="d-flex justify-content-between align-items-center pe-lg-4 mt-2">
      <h6 className="custom__link__url" onClick={() => OpenWebsiteLink(websiteInfo)}>
        {websiteInfo}
      </h6>
      {!isReview && (
        <button type="button" className="btn delete__btn" onClick={(e) => handleDeleteWebsite(e, websiteInfo)}>
          <BiTrash className="delete__icon" />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
};

export default SkillsCertification;
