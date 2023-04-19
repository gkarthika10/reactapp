import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFavoriteCandidates, removeFromFavourites } from "../../../store/auctionSlice";

// Helpers
import { STATUSES } from "../../../App";
import Loader from "../../common/Loader";
import { getUserAlias } from "../../../helpers/Utility";

// Media & Icons
import { BiTrash } from "react-icons/bi";

const Favourites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: favourite_candidates, status } = useSelector((state) => state.auction.all_favourite_candidates);

  // states
  const [favouriteCandidates, setFavouriteCandidates] = useState([]);

  // fetch all_favourite_candidates once component load
  useEffect(() => {
    dispatch(fetchAllFavoriteCandidates());
  }, [dispatch]);

  // save favourite_candidates everytime gets update from store
  useEffect(() => {
    setFavouriteCandidates([...favourite_candidates]);
  }, [favourite_candidates]);

  // when click on any active-bid
  const NavigateToAuction = (auction_id) => {
    if (auction_id) navigate(`/auction/${auction_id}`);
  };

  return (
    <div className="favourites__box">
      <div className="row section__bg p-sm-4 py-4 px-2">
        <div className="row">
          <h5 className="console__section__heading mt-1">Favourite Auctions</h5>
        </div>

        <div className="container-fluid px-xl-5">
          <div className="candidates__box">
            {status !== STATUSES.LOADING ? (
              <div className="row mb-4">
                {favouriteCandidates?.length > 0 ? (
                  <>
                    {[...favouriteCandidates].map((candidate, idx) => {
                      return (
                        <div
                          className="col-xl-3 col-md-4 col-sm-6 mt-4"
                          key={`favourite_${idx + 1}_${candidate?.auction?.auction_id}`}
                          onClick={() => NavigateToAuction(candidate?.auction?.auction_id)}
                        >
                          <div className="candidate__item rounded-1 px-xl-3 px-2 pt-4 pb-3">
                            <BiTrash
                              size={20}
                              className="remove__favourite"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(removeFromFavourites(candidate?.auction?.auction_id));
                              }}
                            />
                            <h5 className="candidate__name">
                              {getUserAlias(candidate?.auction?.candidate_profile?.first_name)}
                            </h5>
                            <p className="candidate__designation">
                              {candidate?.auction?.candidate_profile?.current_role || "-"}
                            </p>
                            <p className="candidate__employer">
                              {candidate?.auction?.candidate_profile?.current_employer || "-"}
                            </p>
                            <ul>
                              <li>
                                <span>Experience:</span>{" "}
                                <span>{candidate?.auction?.candidate_profile?.relevant_experience} Years</span>
                              </li>
                              <li>
                                <span>Base Bid:</span> <span>${candidate?.auction?.base_bid}</span>
                              </li>
                              <li>
                                <span>Latest Bid:</span> <span>${candidate?.auction?.latest_bid}</span>
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
                      <p>No Favouirtes Added!</p>
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

export default Favourites;
