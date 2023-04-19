import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/FindCandidateConsole.css";
import Slider from "rc-slider";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAuctions, addCandidateInFavourites } from "../../store/auctionSlice";

// Helpers
import { toastError } from "../../helpers/Notification";
import { isAuthenticated } from "../../helpers/Auth";
import { getUserAlias } from "../../helpers/Utility";
import Loader from "../common/Loader";

// Media & Icons
import { BiSearchAlt, BiX, BiBookmarkHeart } from "react-icons/bi";
import { FcSearch } from "react-icons/fc";
import { STATUSES } from "../../App";

// Constants
const MAX_BASE_BID = 300000;
const MAX_EXPERIENCE = 20;

// Filter Initial Data
const filter_data_initial = {
  skills: [],
  locations: [],
  notice_period: {
    "0-30": false,
    "30-60": false,
    "60-90": false,
  },
  experience: [0, 20],
  base_bid: [0, MAX_BASE_BID],
};

const FindCandidateConsole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, data: all_auctions } = useSelector((state) => state.auction.all_active_auctions);

  const [allAuctions, setAllAuctions] = useState([]);
  const [searchedAuctions, setSearchedAuctions] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [filterInfo, setFilterInfo] = useState(filter_data_initial);

  const [skillsInput, setSkillsInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  // set filter initial data every time refresh
  useEffect(() => {
    setFilterInfo(filter_data_initial);
    console.log("API Called!");
  }, []);

  // fetch all_active_auctions once component load
  useEffect(() => {
    dispatch(fetchAllAuctions());
  }, [dispatch]);

  // save all_auctions everytime gets update from store
  useEffect(() => {
    if (all_auctions) {
      setAllAuctions([...all_auctions]);
      setSearchedAuctions([...all_auctions]);
    }
  }, [all_auctions]);

  // when click on any active-bid
  const NavigateToAuction = (auction_id) => {
    if (auction_id) navigate(`/auction/${auction_id}`);
  };

  // handle skills input
  const HandleSkillsInput = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      // if already exist
      if (filterInfo?.skills?.includes(skillsInput)) {
        toastError("Skill Already Added.");
        return;
      }

      if (skillsInput !== "") {
        const new_skills = [...filterInfo?.skills, skillsInput];
        setFilterInfo((prevState) => {
          return { ...prevState, skills: [...new_skills] };
        });
        setSkillsInput("");
      }
    }
  };

  // handle work-location input
  const HandleLocationInput = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      // if already exist
      if (filterInfo?.locations?.includes(locationInput)) {
        toastError("Location Already Added.");
        return;
      }

      if (locationInput !== "") {
        const new_locations = [...filterInfo?.locations, locationInput];
        setFilterInfo((prevState) => {
          return { ...prevState, locations: [...new_locations] };
        });
        setLocationInput("");
      }
    }
  };

  // handle experience & salary input
  const HandleSliderInput = (input_type, value) => {
    setFilterInfo((prevState) => {
      return { ...prevState, [input_type]: [...value] };
    });
  };

  // handle notice_period checkbox input
  const HandleNoticePeriod = (e) => {
    const id = e.target.id?.split("_")?.[0];
    const value = filterInfo?.notice_period?.[id] ? false : true;
    setFilterInfo((prevState) => {
      return { ...prevState, notice_period: { ...prevState.notice_period, [id]: value } };
    });
  };

  // handle delete skill from filter
  const HandleDeleteSkill = (e) => {
    const skill_value = e.currentTarget.id;
    const { skills } = filterInfo;

    const new_skills = skills?.filter((skill) => {
      return skill !== skill_value;
    });

    setFilterInfo((prevState) => {
      return { ...prevState, skills: [...new_skills] };
    });
  };

  // handle work-locations from filter
  const HandleDeleteLocation = (e) => {
    const location_value = e.currentTarget.id;
    const { locations } = filterInfo;

    const new_locations = locations?.filter((skill) => {
      return skill !== location_value;
    });

    setFilterInfo((prevState) => {
      return { ...prevState, locations: [...new_locations] };
    });
  };

  // check if filter not changed
  const IsFilterChanged = () => {
    try {
      return JSON.stringify(filterInfo) !== JSON.stringify(filter_data_initial);
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // handle submit filter results
  const HandleFilterSubmit = (e) => {
    e.preventDefault();

    try {
      // if filter not changed then all auctions
      if (!IsFilterChanged()) {
        setSearchedAuctions([...allAuctions]);
        return;
      }

      // find common elements in two arrays (skills, location)
      const findCommon = (arr1, arr2) => {
        const res = [];
        if (!arr1 || !arr2) return res;

        arr1.forEach((item) => {
          if (arr2.includes(item)) res.push(item);
        });
        return res;
      };

      // list of checked notice_period(s) by user in filter
      const checked_notice_periods = [];
      for (let key in filterInfo?.notice_period) {
        if (filterInfo?.notice_period[key]) checked_notice_periods.push(key);
      }

      // validate notice_period
      const validateNoticePeriod = (by_server, by_user) => {
        for (let np of by_user) {
          const tmp = np?.split("-");
          if (by_server >= parseInt(tmp[0]) && by_server <= parseInt(tmp[1])) return true;
        }
        return false;
      };

      const searched = allAuctions?.filter((auction) => {
        const exp = parseInt(auction?.candidate_profile?.relevant_experience);
        const base_bid = parseInt(auction?.base_bid);
        const skills = auction?.candidate_profile?.skills
          ? JSON.parse(auction?.candidate_profile?.skills)?.map((item) => item?.name?.toLowerCase())
          : [];
        const locations = auction?.candidate_profile?.preferred_work_location
          ? JSON.parse(auction?.candidate_profile?.preferred_work_location)
          : [];
        const notice_period = parseInt(auction?.candidate_profile?.notice_period);

        // conditions to filtering
        const exp_condn = exp ? exp >= filterInfo?.experience[0] && exp <= filterInfo?.experience[1] : false;
        const based_bid_condn = base_bid
          ? base_bid >= filterInfo?.base_bid[0] && base_bid <= filterInfo?.base_bid[1]
          : false;
        const skills_condn = findCommon(skills, filterInfo?.skills);
        const locations_condn = findCommon(locations, filterInfo?.locations);
        const notice_period_condn = notice_period
          ? validateNoticePeriod(notice_period, checked_notice_periods)
          : filter_data_initial?.notice_period;

        return (
          exp_condn &&
          based_bid_condn &&
          (checked_notice_periods?.length === 0 || notice_period_condn) &&
          (filterInfo?.skills?.length === 0 || skills_condn?.length > 0) &&
          (filterInfo?.locations?.length === 0 || locations_condn?.length > 0)
        );
      });

      setSearchedAuctions([...searched]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="find__candidate__box">
      <div className="container-fluid mb-5 px-xl-5 px-sm-4 px-3">
        {isAuthenticated()?.userType === "E" && (
          <div className="row">
            <div className="col-lg-4 mt-4 px-4">
              <div className="filter__box sticky-lg-top p-4 px-xl-5 px-lg-4 px-5 mt-2">
                {/* <button type="button" className="btn btn-success w-100">
                  Show Recommended
                </button>
                <div className="text-center my-2 text-muted">------- or -------</div> */}

                <form className="mt-2 mb-3" onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-4">
                    <label htmlFor="skills" className="filter__input__label">
                      Skill
                    </label>
                    <label className="input__chip__label filter__chip__label">
                      {[...filterInfo?.skills].map((skill, idx) => {
                        return (
                          <span className="chip py-1" key={`${skill}_${idx}`}>
                            <span>{skill}</span>
                            <button type="button">
                              <BiX className="icon" id={skill} onClick={HandleDeleteSkill} />
                            </button>
                          </span>
                        );
                      })}
                      <input
                        type="text"
                        id="skills"
                        name="skills"
                        className="bg-transparent"
                        placeholder="Type Here ..."
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value.toLowerCase())}
                        onKeyDown={HandleSkillsInput}
                      />
                    </label>
                  </div>

                  <div className="mb-4 pt-2">
                    <label htmlFor="experience" className="filter__input__label d-flex align-items-center gap-2">
                      <span>Experience</span>
                      <span style={{ fontWeight: 700 }}>
                        {filterInfo?.experience?.length > 0
                          ? `(${filterInfo?.experience[0]} - ${filterInfo?.experience[1]} Years)`
                          : ""}
                      </span>
                    </label>
                    <div className="mt-3 ps-1">
                      <Slider
                        range
                        allowCross={false}
                        min={0}
                        max={MAX_EXPERIENCE}
                        defaultValue={[...filterInfo?.experience]}
                        onChange={(value) => HandleSliderInput("experience", value)}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="locations" className="filter__input__label">
                      Work Location
                    </label>
                    <label className="input__chip__label filter__chip__label">
                      {[...filterInfo?.locations].map((location, idx) => {
                        return (
                          <span className="chip py-1" key={`${location}_${idx}`}>
                            <span>{location}</span>
                            <button type="button">
                              <BiX className="icon" id={location} onClick={HandleDeleteLocation} />
                            </button>
                          </span>
                        );
                      })}
                      <input
                        type="text"
                        id="locations"
                        name="locations"
                        className="bg-transparent"
                        placeholder="Type Here ..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value.toLowerCase())}
                        onKeyDown={HandleLocationInput}
                      />
                    </label>
                  </div>

                  <div className="mb-4 pt-2">
                    <label htmlFor="base_bid" className="filter__input__label d-flex align-items-center gap-2">
                      <span>Base Bid</span>
                      <span style={{ fontWeight: 700 }}>
                        {filterInfo?.base_bid?.length > 0
                          ? `($${filterInfo?.base_bid[0]} - $${filterInfo?.base_bid[1]})`
                          : ""}
                      </span>
                    </label>
                    <div className="mt-3 ps-1">
                      <Slider
                        range
                        allowCross={false}
                        min={0}
                        max={MAX_BASE_BID}
                        defaultValue={[...filterInfo?.base_bid]}
                        step={5000}
                        onChange={(value) => HandleSliderInput("base_bid", value)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 mb-1">
                    <label htmlFor="notice_period" className="filter__input__label">
                      Notice Period
                    </label>
                    <div className="mt-1 ps-3 lh-base">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="notice_period"
                          value="0-30"
                          id="0-30_days"
                          checked={filterInfo?.notice_period?.["0-30"]}
                          onChange={HandleNoticePeriod}
                        />
                        <label className="form-check-label" htmlFor="0-30_days">
                          0 - 30 Days
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="notice_period"
                          value="30-60"
                          id="30-60_days"
                          checked={filterInfo?.notice_period?.["30-60"]}
                          onChange={HandleNoticePeriod}
                        />
                        <label className="form-check-label" htmlFor="30-60_days">
                          30 - 60 Days
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="notice_period"
                          value="60-90"
                          id="60-90_days"
                          checked={filterInfo?.notice_period?.["60-90"]}
                          onChange={HandleNoticePeriod}
                        />
                        <label className="form-check-label" htmlFor="60-90_days">
                          60 - 90 Days
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="button" className="btn btn-success w-100 mt-3" onClick={HandleFilterSubmit}>
                    Filter Results
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-8 my-4">
              <div className="search__box mt-2">
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">
                    <BiSearchAlt />
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    name="search_candidate"
                    id="search_candidate"
                    placeholder="Search Candidates by Auction-Id/Role/Company..."
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value.toLowerCase());
                      // const searchStr = e.target.value?.toLowerCase();

                      // const searchResults = searchedAuctions?.filter((candidate) => {
                      //   const current_role = candidate?.candidate_profile?.current_role?.toLowerCase();
                      //   const current_employer = candidate?.candidate_profile?.current_employer?.toLowerCase();

                      //   if (
                      //     searchStr?.trim() === "" ||
                      //     current_role?.includes(searchStr) ||
                      //     current_employer?.includes(searchStr)
                      //   )
                      //     return true;
                      //   return false;
                      // });

                      // setSearchedAuctions([...searchResults]);
                    }}
                  />
                </div>
              </div>

              <div className="candidates__box">
                {status !== STATUSES.LOADING ? (
                  <div className="row">
                    {searchedAuctions?.length > 0 ? (
                      <>
                        {[...searchedAuctions].map((candidate, idx) => {
                          const searchStr = searchInput;
                          const auction_id = candidate?.auction_id?.toLowerCase();
                          const current_role = candidate?.candidate_profile?.current_role?.toLowerCase();
                          const current_employer = candidate?.candidate_profile?.current_employer?.toLowerCase();

                          if (
                            searchStr !== "" &&
                            (auction_id?.includes(searchStr) ||
                              current_role?.includes(searchStr) ||
                              current_employer?.includes(searchStr))
                          ) {
                          } else if (searchStr !== "") return "";

                          return (
                            <div
                              className="col-md-4 col-6 mt-4"
                              key={candidate?.auction_id}
                              onClick={() => NavigateToAuction(candidate?.auction_id)}
                            >
                              <div className="candidate__item px-xl-3 px-1 pt-4 pb-3 rounded-3">
                                <h5 className="candidate__name">
                                  {getUserAlias(candidate?.candidate_profile?.first_name)}
                                </h5>
                                <p className="candidate__designation">
                                  {candidate?.candidate_profile?.current_role || "Employee"}
                                </p>
                                <p className="candidate__employer">
                                  {candidate?.candidate_profile?.current_employer || `Anonymous`}
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
                                <button
                                  type="button"
                                  className="btn btn-secondary mb-1 add__to__favourite"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(addCandidateInFavourites(candidate?.auction_id));
                                  }}
                                >
                                  <BiBookmarkHeart size={20} className="favourite__icon" />
                                  <span className="favourite__text">Add to Favourites</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="d-flex flex-column align-items-center mt-5">
                        <FcSearch style={{ fontSize: "4.5rem" }} />
                        <span className="mt-3 text-secondary fs-5">Sorry, we couldn't find any results!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindCandidateConsole;
