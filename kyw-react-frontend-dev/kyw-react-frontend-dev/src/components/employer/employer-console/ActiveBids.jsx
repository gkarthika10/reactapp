import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveBidsByEmployer } from "../../../store/auctionSlice";

// Helpers
import { STATUSES } from "../../../App";
import Loader from "../../common/Loader";
import { getUserAlias } from "../../../helpers/Utility";

const ActiveBids = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, data: active_bids } = useSelector((state) => state.auction.active_bids_by_employer);

  // states
  const [activeBids, setActiveBids] = useState([]);

  // fetch active_bids_by_employer once component load
  useEffect(() => {
    // not available in store then only fetch (caching)
    dispatch(fetchActiveBidsByEmployer());
  }, [dispatch]);

  // save active_bids everytime gets update from store
  useEffect(() => {
    if (active_bids?.length > 0) setActiveBids([...active_bids]);
  }, [active_bids]);

  // when click on any active-bid
  const NavigateToAuction = (auction_id) => {
    if (auction_id) navigate(`/auction/${auction_id}`);
  };

  return (
    <div className="active__bids__box">
      <div className="row section__bg p-sm-4 py-4 px-3">
        <div className="row">
          <h5 className="console__section__heading mt-1">Active Bids</h5>
        </div>

        <div className="container-fluid px-xl-5">
          <div className="candidates__box">
            {status !== STATUSES.LOADING ? (
              <div className="row mb-4">
                {activeBids?.length > 0 ? (
                  <>
                    {[...activeBids].map((candidate, idx) => {
                      return (
                        <div
                          className="col-xl-3 col-md-4 col-6 mt-4"
                          key={candidate?.auction_id}
                          onClick={() => NavigateToAuction(candidate?.auction_id)}
                        >
                          <div className="candidate__item rounded-1 px-xl-3 px-1 pt-4 pb-3">
                            <h5 className="candidate__name">
                              {getUserAlias(candidate?.candidate_profile?.first_name)}
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
                      <p>No Active Bids!</p>
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

export default ActiveBids;
