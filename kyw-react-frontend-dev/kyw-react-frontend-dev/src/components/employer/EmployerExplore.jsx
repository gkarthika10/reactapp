import React, { useState, useEffect } from "react";
import "../../styles/EmployerExplore.css";
import { useNavigate } from "react-router-dom";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctionsRoleBased } from "../../store/auctionSlice";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";
import { getUserAlias } from "../../helpers/Utility";
import { STATUSES } from "../../App";
import Loader from "../common/Loader";

// Swiper Components, Styles, Modules
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
const swiperBreakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  450: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 3,
    spaceBetween: 40,
  },
  1024: {
    slidesPerView: 4,
    spaceBetween: 30,
  },
};

const EmployerExplore = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { status, data: active_auctions } = useSelector((state) => state.auction.auctions_role_based);

  // active role based auctions
  const [auctions, setAuctions] = useState([]);
  useEffect(() => {
    dispatch(fetchAuctionsRoleBased());
  }, [dispatch]);

  useEffect(() => {
    if (active_auctions.length > 0) setAuctions(active_auctions);
  }, [active_auctions]);

  // when click on any active-auction-candidate
  const NavigateToAuction = (e) => {
    const auction_id = e.currentTarget.id;
    if (auction_id) navigate(`/auction/${auction_id}`);
  };

  // function to ready cards for slider (to avoid nested map method)
  const getCandidates = (candidates) => {
    return (
      <>
        {[...candidates].map((candidate, idx) => {
          if (idx > 4) return "";
          else {
            return (
              <SwiperSlide key={candidate?.auction_id}>
                <div
                  className="explore__candidate__item text-center"
                  id={candidate?.auction_id}
                  onClick={NavigateToAuction}
                >
                  <h5 className="name">{getUserAlias(candidate?.candidate_profile?.first_name)}</h5>
                  <p className="from__company">{candidate?.candidate_profile?.current_company}</p>
                  <ul className="content__list">
                    <li>
                      <span>Experience:</span>
                      <span>{candidate?.candidate_profile?.relevant_experience} Year(s)</span>
                    </li>
                    <li>
                      <span>Base Bid:</span>
                      <span>${candidate?.base_bid}</span>
                    </li>
                    <li>
                      <span>Latest Bid:</span>
                      <span>{candidate?.latest_bid ? `$${candidate?.latest_bid}` : "No Bid"}</span>
                    </li>
                  </ul>
                </div>
              </SwiperSlide>
            );
          }
        })}
      </>
    );
  };

  return (
    <div className="employer__explore__box">
      <div className="container-lg px-lg-0 px-3 pt-2 pb-5">
        {isAuthenticated()?.userType === "E" && status === STATUSES.IDLE ? (
          <>
            {[...auctions].map((auction, idx) => {
              return (
                <div className="employer__explore__item mt-4 p-sm-4 py-4 px-3" key={`role_${idx + 1}`}>
                  <div className="employer__explore__candidates">
                    <Swiper
                      slidesPerView={4}
                      spaceBetween={20}
                      navigation={true}
                      breakpoints={swiperBreakpoints}
                      modules={[Navigation]}
                      className="mySwiper"
                      draggable={false}
                    >
                      {getCandidates(auction?.candidate)}
                    </Swiper>
                  </div>
                  <div className="employer__explore__content px-sm-5 px-4">
                    <p className="bidding__open">Online bidding is open!</p>
                    <div className="explore__content__row">
                      <h5 className="explore__heading">{auction?.role} Role</h5>
                      <p className="explore__candidates__count">({auction?.no_of_canididates} Candidates)</p>
                      <button type="button" className="btn custom__btn catalogue__btn px-5">
                        Catalogue
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <Loader shadow={true} />
        )}
      </div>
    </div>
  );
};

export default EmployerExplore;
