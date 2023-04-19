import React, { useState, useEffect } from "react";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchPastEngagements } from "../../../store/auctionSlice";

// Helpers
import { STATUSES } from "../../../App";
import Loader from "../../common/Loader";

const PastEngagements = () => {
  const dispatch = useDispatch();
  const { status, data: past_engagements } = useSelector((state) => state.auction.past_engagements);

  // states
  const [pastEngagements, setPastEngagements] = useState([]);

  // fetch past_engagements once component load
  useEffect(() => {
    // not available in store then only fetch (caching)
    dispatch(fetchPastEngagements());
  }, [dispatch]);

  // save past_engagements everytime gets update from store
  useEffect(() => {
    if (past_engagements?.length > 0) setPastEngagements([...past_engagements]);
  }, [past_engagements]);

  // get first char of first_name & last_name of user
  const getUserAlias = (first_name, last_name) => {
    const firstChr = first_name?.substring(0, 1);
    const lastChr = last_name?.substring(0, 1) || "";
    return `${firstChr}${lastChr}`;
  };

  return (
    <div className="active__bids__box">
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="row">
          <h5 className="console__section__heading mt-1">Past Engagements</h5>
        </div>

        <div className="container-fluid px-xl-5">
          <div className="candidates__box">
            {status !== STATUSES.LOADING ? (
              <div className="row mb-4">
                {pastEngagements?.length > 0 ? (
                  <>
                    {[...pastEngagements].map((candidate, idx) => {
                      return (
                        <div className="col-xl-3 col-md-4 col-6 mt-4" key={candidate?.auction_id}>
                          <div className="candidate__item rounded-1 px-xl-3 px-1 pt-4 pb-3">
                            <h5 className="candidate__name">
                              {getUserAlias(candidate?.candidate_profile?.first_name) || "-"}
                            </h5>
                            <p className="candidate__designation">
                              {candidate?.candidate_profile?.current_role || "-"}
                            </p>
                            <p className="candidate__employer">
                              {candidate?.candidate_profile?.current_employer || "-"}
                            </p>
                            <ul>
                              <li>
                                <span>Experience:</span>{" "}
                                <span>{candidate?.candidate_profile?.relevant_experience} Years</span>
                              </li>
                              <li>
                                <span>Base Bid:</span> <span>${candidate?.base_bid}</span>
                              </li>
                              <li>
                                <span>Latest Bid:</span> <span>${candidate?.latest_bid}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-3">
                    <div className="mt-3 no__items__found pt-4 pb-2">
                      <p>No History Found!</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastEngagements;
