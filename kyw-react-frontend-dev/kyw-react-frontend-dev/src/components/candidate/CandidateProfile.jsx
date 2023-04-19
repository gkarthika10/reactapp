import React, { useState, useEffect } from "react";
import "../../styles/CandidateProfile.css";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { getCandidateProfile } from "../../store/profileSlice";

// Candidate Profile Components
import PersonalInformation from "./candidate-profile/PersonalInformation";
import WorkExperience from "./candidate-profile/WorkExperience";
import Education from "./candidate-profile/Education";
import SkillsCertification from "./candidate-profile/SkillsCertification";
import PastAuctions from "./candidate-profile/PastAuctions";

const CandidateProfile = () => {
  const dispatch = useDispatch();
  const { profile_data } = useSelector((state) => state.profile.candidate);

  // states
  const [currentSection, setCurrentSection] = useState("personal_info");
  const [profileData, setProfileData] = useState({});

  // toggle sections (Bid View, Offers In Hand, Contact Employer)
  const toggleSection = (section) => setCurrentSection(section);

  // get candidate profile info
  useEffect(() => {
    dispatch(getCandidateProfile());
  }, [dispatch]);

  // key the profile-data up-to-date
  useEffect(() => {
    setProfileData(profile_data);
  }, [profile_data]);

  return (
    <div className="candidate__profile__box">
      <div className="container-fluid mb-5 px-xl-5 px-sm-4 px-3">
        <div className="row pt-3">
          <div className="d-flex justify-content-center flex-wrap mt-4">
            <div
              className={`section__toggle ${currentSection === "personal_info" ? "section__active" : ""}`}
              onClick={() => toggleSection("personal_info")}
            >
              Personal Info.
            </div>
            <div
              className={`section__toggle ${currentSection === "work_experience" ? "section__active" : ""}`}
              onClick={() => toggleSection("work_experience")}
            >
              Work Experience
            </div>
            <div
              className={`section__toggle ${currentSection === "education" ? "section__active" : ""}`}
              onClick={() => toggleSection("education")}
            >
              Education
            </div>
            <div
              className={`section__toggle ${currentSection === "skills_certification" ? "section__active" : ""}`}
              onClick={() => toggleSection("skills_certification")}
            >
              Skills &amp; Certification
            </div>
            <div
              className={`section__toggle ${currentSection === "past_auctions" ? "section__active" : ""}`}
              onClick={() => toggleSection("past_auctions")}
            >
              Past Auctions
            </div>
          </div>
        </div>

        <div className="row mt-4 px-md-3 px-2">
          {currentSection === "personal_info" && <PersonalInformation profileInfo={profileData} />}
          {currentSection === "work_experience" && <WorkExperience profileInfo={profileData} />}
          {currentSection === "education" && <Education profileInfo={profileData} />}
          {currentSection === "skills_certification" && <SkillsCertification profileInfo={profileData} />}
          {currentSection === "past_auctions" && <PastAuctions />}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
