import React from "react";

// Media & Icons
import CandidateImg from "../../../media/avatars/Candidate1.png";

const HiredCandidates = () => {
  return (
    <div className="hired__candidates__box">
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="row">
          <h5 className="console__section__heading mt-1">Hired Candidates</h5>
        </div>

        <div className="container-fluid px-xl-5">
          <div className="candidates__box">
            <div className="row mb-4">
              {[1, 1, 1, 1, 1, 1].map((candidate, idx) => {
                return (
                  <div className="col-xl-3 col-md-4 col-6 mt-4" key={idx}>
                    <div className="candidate__item rounded-1 px-xl-3 px-1 pt-4 pb-3">
                      <div className="candidate__img">
                        <img src={CandidateImg} alt="Candidate" />
                      </div>
                      <h5 className="candidate__name">Rishi Soni</h5>
                      <p className="candidate__designation">Software Engineer</p>
                      <p className="candidate__employer">Apisero Inc.</p>
                      <ul>
                        <li>
                          <span>Experience:</span> <span>4.5 Years</span>
                        </li>
                        <li>
                          <span>Base Bid:</span> <span>$900000</span>
                        </li>
                        <li>
                          <span>Latest Bid:</span> <span>$1000000</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiredCandidates;
