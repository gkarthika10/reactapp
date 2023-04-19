import React, { useEffect } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

// Custom Components
import Navbar from "../components/common/Navbar";

// Media & Icons
import CompaniesBannerLg from "../media/companies/companies-lg.jpg";
import CompaniesBannerMd from "../media/companies/companies-md.jpg";
import CompaniesBannerSm from "../media/companies/companies-sm.jpg";
import BusinessBanner from "../media/banner/business_banner.png";
import Candidate1 from "../media/avatars/Candidate1.png";
import Candidate2 from "../media/avatars/Candidate2.png";
import Candidate3 from "../media/avatars/Candidate3.jpg";
import Candidate4 from "../media/avatars/Candidate4.jpg";
import { FiCheckCircle } from "react-icons/fi";

// Swiper Components, Styles, Modules
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";

// Helpers
import { isAuthenticated } from "../helpers/Auth";

const Home = ({ handleLoginModalOpen, handleLoginSidebarOpen, handleSignupModalOpen, handleSignupSidebarOpen }) => {
  const navigate = useNavigate();

  // (join kyw) click event
  const HandlePartnerSwitch = () => {
    window.scrollTo(0, 0);
    navigate("/become-partner");
  };

  // navigate user as per the role
  useEffect(() => {
    try {
      const { userType, screening_stages } = isAuthenticated();

      if (userType === "C") {
        if (screening_stages === "Email Verified") navigate("/resume-parse");
        else if (screening_stages === "Profile Created") navigate("/candidate-console");
      } else if (userType === "E") navigate("/role-based-auctions");
    } catch (err) {
      console.log(err);
    }
  }, [navigate]);

  return (
    <div className="home__container">
      {/* HERO BANNER */}
      <div className="hero__banner__box">
        <Navbar
          isBanner={true}
          handleLoginModalOpen={handleLoginModalOpen}
          handleLoginSidebarOpen={handleLoginSidebarOpen}
          handleSignupModalOpen={handleSignupModalOpen}
          handleSignupSidebarOpen={handleSignupSidebarOpen}
        />

        <div className="container banner__content my-auto">
          <div className="row">
            <div className="col-lg-6">
              <p className="banner__heading">
                Get the perfect <span>Job Offer</span> you deserve.
              </p>

              <p className="banner__desc">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla quis deserunt laboriosam facilis
                voluptates.
              </p>

              <button type="button" className="banner__btn" onClick={handleSignupModalOpen}>
                Join to <span>Know Your Worth</span>
              </button>
              <button type="button" className="banner__btn banner__btn__mobile" onClick={handleSignupSidebarOpen}>
                Join to <span>Know Your Worth</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPANIES */}
      <CompaniesBanner />

      {/* BUSINESS BANNER */}
      <div className="business__banner__box">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h4 className="business__heading">
                <span className="kyw__brand pt-1">Know Your Worth</span> Business.
              </h4>

              <div className="business__content">
                <h3 className="business__subheading">
                  A business solution designed <br /> for <span>teams</span>
                </h3>
                <p className="business__desc">
                  Upgrade to a curated experience packed with tools and benefits, dedicated to businesses
                </p>

                <ul className="list-group">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-1 col-1">
                        <FiCheckCircle className="check__icon" />
                      </div>
                      <div className="col-lg-8 col-11">
                        <span>Get matched with the perfect talent by a customer success manager</span>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col-lg-1 col-1">
                        <FiCheckCircle className="check__icon" />
                      </div>
                      <div className="col-lg-8 col-11">
                        <span>Connect to freelancers with proven business experience</span>
                      </div>
                    </div>
                  </li>
                </ul>

                <button className="btn" onClick={HandlePartnerSwitch}>
                  Join KYW Business
                </button>
              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center">
              <img src={BusinessBanner} alt="Join KYW Business to Hire" />
            </div>
          </div>
        </div>
      </div>

      {/* CANDIDATES HIRED THROUGH KYW */}
      <div className="candidates__hired__box">
        <div className="container">
          <h5 className="candidates__heading">Candidates Hired through KYW</h5>

          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            navigation={true}
            breakpoints={{
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
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="candidate__item">
                <img src={Candidate1} alt="Candidate1" />
                <div className="candidate__content">
                  <h6 className="heading">John Doe</h6>
                  <p className="designation">Software Engineer</p>
                  <p className="offer">
                    $140000 <span>by</span> Amazon
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="candidate__item">
                <img src={Candidate3} alt="Candidate3" />
                <div className="candidate__content">
                  <h6 className="heading">David Sheeran</h6>
                  <p className="designation">Android Engineer</p>
                  <p className="offer">
                    $100000 <span>by</span> Reliance Jio
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="candidate__item">
                <img src={Candidate2} alt="Candidate2" />
                <div className="candidate__content">
                  <h6 className="heading">Rafeh Qazi</h6>
                  <p className="designation">Django Developer</p>
                  <p className="offer">
                    $130000 <span>by</span> InMobi
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="candidate__item">
                <img src={Candidate4} alt="Candidate4" />
                <div className="candidate__content">
                  <h6 className="heading">Lily Williamson</h6>
                  <p className="designation">Solution Architect</p>
                  <p className="offer">
                    $190000 <span>by</span> Microsoft
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="candidate__item">
                <img src={Candidate2} alt="Candidate2" />
                <div className="candidate__content">
                  <h6 className="heading">Jack Sparrow</h6>
                  <p className="designation">Full-Stack Engineer</p>
                  <p className="offer">
                    $200000 <span>by</span> Meesho
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials__box">
        <div className="container">
          <div className="heading__box">
            <h2>Our Clients Speak</h2>
            <p>We have been working with clients around the world</p>
          </div>

          <div className="testimonials__items__box mt-5">
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              breakpoints={{
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
                991: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="mySwiper"
            >
              <SwiperSlide>
                <div className="testimonials__item">
                  <div className="testimonials__card__box">
                    <div className="testimonials__card">
                      <h5 className="heading">Efficient Collaborating</h5>
                      <p className="review">
                        Lorem, ipsum dolor sit amet consec tetur adipisicing elit. Tempore quos quisssssss commodi
                        perferendis!
                      </p>
                    </div>
                    <div className="testimonials__pointed"></div>
                  </div>
                  <div className="testimonials__profile">
                    <img src={Candidate1} alt="Testimonial Profile" />
                    <h6>John Wick</h6>
                    <p>CEO at ABC Corporation</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonials__item">
                  <div className="testimonials__card__box">
                    <div className="testimonials__card">
                      <h5 className="heading">Mindblowing Service</h5>
                      <p className="review">
                        Lorem, ipsum dolor sit amet consec tetur adipisicing elit. Tempore quos quisssssss commodi
                        perferendis!
                      </p>
                    </div>
                    <div className="testimonials__pointed"></div>
                  </div>
                  <div className="testimonials__profile">
                    <img src={Candidate2} alt="Testimonial Profile" />
                    <h6>John Wick</h6>
                    <p>CEO at ABC Corporation</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonials__item">
                  <div className="testimonials__card__box">
                    <div className="testimonials__card">
                      <h5 className="heading">Intuitive Design</h5>
                      <p className="review">
                        Lorem, ipsum dolor sit amet consec tetur adipisicing elit. Tempore quos quisssssss commodi
                        perferendis!
                      </p>
                    </div>
                    <div className="testimonials__pointed"></div>
                  </div>
                  <div className="testimonials__profile">
                    <img src={Candidate3} alt="Testimonial Profile" />
                    <h6>John Wick</h6>
                    <p>CEO at ABC Corporation</p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="testimonials__item">
                  <div className="testimonials__card__box">
                    <div className="testimonials__card">
                      <h5 className="heading">Efficient Collaborating</h5>
                      <p className="review">
                        Lorem, ipsum dolor sit amet consec tetur adipisicing elit. Tempore quos quisssssss commodi
                        perferendis!
                      </p>
                    </div>
                    <div className="testimonials__pointed"></div>
                  </div>
                  <div className="testimonials__profile">
                    <img src={Candidate1} alt="Testimonial Profile" />
                    <h6>John Wick</h6>
                    <p>CEO at ABC Corporation</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompaniesBanner = () => {
  return (
    <div className="container companies__box">
      <p className="companies__heading mb-4">More Than 100 Top Companies</p>
      <picture>
        <source media="(max-width:768px)" srcSet={CompaniesBannerSm} />
        <source media="(max-width:991px)" srcSet={CompaniesBannerMd} />
        <img src={CompaniesBannerLg} alt="Companies Hire through KYW" />
      </picture>
    </div>
  );
};

export default Home;
