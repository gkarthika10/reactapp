import React from "react";
import "../../styles/Footer.css";
import { Link } from "react-router-dom";

// Icons
import { FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaCopyright } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="container-fluid px-lg-5 pt-4">
      <div className="row pb-5">
        <div className="col-lg-4">
          <div className="footer__text mt-3">
            <span className="footer__brand">Know Your Worth.</span>

            <span className="footer__copyright mt-1 py-2">
              <FaCopyright style={{ width: 20, height: 20 }} />
              <span>2022 Know Your Worth. All Rights Reserved.</span>
            </span>

            <div className="footer__social__media mt-sm-4 mt-3">
              <Link to="#">
                <FaTwitter />
              </Link>
              <Link to="#">
                <FaLinkedin />
              </Link>
              <Link to="#">
                <FaFacebook />
              </Link>
              <Link to="#">
                <FaPinterest />
              </Link>
              <Link to="#">
                <BsInstagram />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="container">
            <div className="row">
              <div className="col-5">
                <p className="mt-4 footer__link__head">Company</p>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="#" className="footer__link">
                      About Us
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="#" className="footer__link">
                      Blog
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/contact" className="footer__link">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-5 offset-sm-1">
                <p className="mt-4 footer__link__head">Support</p>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="#" className="footer__link">
                      Help Center
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="#" className="footer__link">
                      Terms of Service
                    </Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="#" className="footer__link">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 offset-lg-1 subscribe__mail">
          <p className="mt-4 footer__link__head stay__upto__date">Stay up to date</p>
          <div className="d-flex gap-1 mb-3 pt-1">
            <input
              type="text"
              className="form-control"
              name="subscrible_mail"
              placeholder="Your email address ..."
              aria-label="Email"
            />
            <button type="button" className="subscribe__btn">
              <FiMail style={{ transform: "translateY(-1px)", width: "20px", height: "20px" }} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
