import React, { useState } from "react";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux";
import { contactKyw } from "../../store/commonSlice";

// Helpers
import { ScaleLoader } from "react-spinners";
import { STATUSES } from "../../App";

// Media & Icons
import ContactImg from "../../media/banner/contact.jpg";

// contact data initial
const contact_data_initial = {
  name: "",
  from: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const dispatch = useDispatch();
  const { status: contact_status } = useSelector((state) => state.common);

  const [contact, setContact] = useState(contact_data_initial);

  // handle contact field inputs
  const HandleChange = (e) => {
    setContact((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // submit contact-us form
  const HandleSubmit = (e) => {
    e.preventDefault();

    const isDataValidate = (info) => {
      let isAnyEmpty = false;
      for (let key in info) {
        if (!info[key]?.trim()) {
          isAnyEmpty = true;
          break;
        }
      }
      return isAnyEmpty ? false : true;
    };
    if (!isDataValidate(contact)) return;

    const dataToBeSubmit = {
      name: contact?.name?.trim(),
      from: contact?.from?.trim(),
      subject: contact?.subject?.trim(),
      message: contact?.message?.trim(),
    };
    dispatch(
      contactKyw(dataToBeSubmit, () => {
        setContact(contact_data_initial);
      })
    );
  };

  return (
    <div className="container p-4 mb-4 mt-2 contact__form__box registration__form__box">
      <div className="row">
        <div className="mb-lg-4">
          <h3 className="modal__heading">
            Contact to <span>Know Your Worth</span>
          </h3>
          <p className="subheading mb-4">All fields are mandatory</p>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 col-lg-6">
          <div className="contact__banner">
            <img src={ContactImg} alt="Contact Page" />
          </div>
        </div>
        <div className="col-xl-5 col-lg-6">
          <form name="contactKywForm" className="mt-4" onSubmit={HandleSubmit} autoComplete="off">
            <div className="mb-4">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={contact?.name}
                onChange={HandleChange}
                placeholder="Name"
                onInvalid={(e) => e.target.setCustomValidity("Your Name is Required!")}
                onInput={(e) => e.target.setCustomValidity("")}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="from"
                id="from"
                className="form-control"
                value={contact?.from}
                onChange={HandleChange}
                placeholder="Email Address"
                onInvalid={(e) => e.target.setCustomValidity("Please Enter Valid Email!")}
                onInput={(e) => e.target.setCustomValidity("")}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="subject"
                id="subject"
                className="form-control"
                value={contact?.subject}
                onChange={HandleChange}
                placeholder="Subject"
                onInvalid={(e) => e.target.setCustomValidity("Intention to Contact KYW is Required!")}
                onInput={(e) => e.target.setCustomValidity("")}
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                name="message"
                id="message"
                rows="5"
                className="form-control"
                value={contact?.message}
                onChange={HandleChange}
                placeholder="Message"
                onInvalid={(e) => e.target.setCustomValidity("Message is Required!")}
                onInput={(e) => e.target.setCustomValidity("")}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="btn custom__btn d-flex justify-content-center align-content-center mt-4"
                disabled={contact_status === STATUSES.LOADING ? true : false}
              >
                {contact_status === STATUSES.LOADING ? <ScaleLoader height={20} color="#fff" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
