import React, { useState } from "react";
import "../../styles/EmployerConsole.css";

// Media & Icons
import { BiSearchAlt } from "react-icons/bi";

// Component Sections
import ActiveBids from "./employer-console/ActiveBids";
import InterviewStage from "./employer-console/InterviewStage";
import Favourites from "./employer-console/Favourites";
import PastEngagements from "./employer-console/PastEngagements";
// import JobRoles from "./employer-console/JobRoles";
// import HiredCandidates from "./employer-console/HiredCandidates";

const EmployerConsole = () => {
  const [searchInput, setSearchInput] = useState("");
  const [currentSection, setCurrentSection] = useState("active_bids");

  // toggle sections (Bid View, Offers In Hand, Contact Employer)
  const toggleSection = (section) => setCurrentSection(section);

  return (
    <div className="employer__console__box px-lg-4">
      <div className="container-fluid mb-5 px-xl-5 px-sm-4 px-3">
        {/* Steps */}
        <div className="row pt-3">
          <div className="col-lg-9">
            <div className="d-flex justify-content-md-start justify-content-center flex-wrap mt-4">
              <div
                className={`section__toggle ${currentSection === "active_bids" ? "section__active" : ""}`}
                onClick={() => toggleSection("active_bids")}
              >
                Active Bids
              </div>
              <div
                className={`section__toggle ${currentSection === "interview_stage" ? "section__active" : ""}`}
                onClick={() => toggleSection("interview_stage")}
              >
                Interview Stage
              </div>
              <div
                className={`section__toggle ${currentSection === "favourites" ? "section__active" : ""}`}
                onClick={() => toggleSection("favourites")}
              >
                Favourites
              </div>
              <div
                className={`section__toggle ${currentSection === "past_engagements" ? "section__active" : ""}`}
                onClick={() => toggleSection("past_engagements")}
              >
                Past Engagements
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="console__search__box mt-4">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <BiSearchAlt />
                </span>
                <input
                  type="search"
                  className="form-control"
                  name="search_candidate"
                  id="search_candidate"
                  placeholder="Search ..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Steps Content */}
        {/* <div className="row mt-4 px-md-3 px-2">{currentSection === "job_roles" && <JobRoles />}</div> */}
        <div className="row mt-4 px-md-3 px-2">{currentSection === "active_bids" && <ActiveBids />}</div>
        <div className="row px-md-3 px-2">{currentSection === "interview_stage" && <InterviewStage />}</div>
        <div className="row px-md-3 px-2">{currentSection === "favourites" && <Favourites />}</div>
        <div className="row px-md-3 px-2">{currentSection === "past_engagements" && <PastEngagements />}</div>
      </div>
    </div>
  );
};

export default EmployerConsole;
