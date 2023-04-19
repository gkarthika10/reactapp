import React from "react";
import { HashLoader } from "react-spinners";

const Loader = ({ shadow }) => {
  return (
    <div className={`loading__box mt-4 ${shadow && "loader__box__shadow__bg"}`}>
      <p className="mb-3">Loading...</p>
      <HashLoader height={20} color="#198754" />
    </div>
  );
};

export default Loader;
