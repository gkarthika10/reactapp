import React from "react";

const PastAuctions = () => {
  return (
    <div className="personal__info__box px-lg-4">
      <div className="row section__bg p-4">
        <div className="d-flex align-items-center justify-content-between" style={{ paddingTop: 6 }}>
          <h6 className="profile__section__heading">Past Auctions</h6>
        </div>

        <div className="container-fluid px-lg-5 px-md-4 mt-2">
          {[1, 1, 1].map((item, idx) => {
            return (
              <div
                className="row mt-4 pt-4 pb-2 px-md-5 px-xs-4 px-2 rounded-3"
                style={{ background: "#DEDDDD" }}
                key={idx.toString()}
              >
                <div className="col-lg-2 col-sm-6 col-12">
                  <label htmlFor={`auction_profile`} className="candidate__info__label">
                    Profile
                  </label>
                  <p className="candidate__info__value">Associate Software Engineer</p>
                </div>
                <div className="col-lg-2 col-sm-3 col-6">
                  <label htmlFor={`auction_base_bid`} className="candidate__info__label">
                    Base Bid
                  </label>
                  <p className="candidate__info__value">$80000</p>
                </div>
                <div className="col-lg-2 col-sm-3 col-6">
                  <label htmlFor={`auction_last_bid`} className="candidate__info__label">
                    Last Bid
                  </label>
                  <p className="candidate__info__value">$130000</p>
                </div>
                <div className="col-lg-2 col-sm-6 col-12">
                  <label htmlFor={`auction_last_bid_by`} className="candidate__info__label">
                    Last Bid By
                  </label>
                  <p className="candidate__info__value">Tata Consultancy Services</p>
                </div>
                <div className="col-lg-2 col-sm-3 col-6">
                  <label htmlFor={`auction_started_at`} className="candidate__info__label">
                    Auction Started At
                  </label>
                  <p className="candidate__info__value">01-08-2022</p>
                </div>
                <div className="col-lg-2 col-sm-3 col-6">
                  <label htmlFor={`auction_closed_at`} className="candidate__info__label">
                    Auction Closed At
                  </label>
                  <p className="candidate__info__value">31-08-2022</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PastAuctions;
