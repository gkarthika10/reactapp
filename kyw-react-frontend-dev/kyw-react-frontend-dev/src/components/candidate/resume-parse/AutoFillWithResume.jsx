import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";

// Redux Stuff
import { useDispatch, useSelector } from "react-redux/es/exports";
import { setResumeFileRedux, uploadResumeLink } from "../../../store/resumeSlice";

// Media & Icons
import { BiTrash, BiCheck, BiX } from "react-icons/bi";
import { MdArrowUpward } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa";

// Helpers
import { STATUSES } from "../../../App";
import { toastError } from "../../../helpers/Notification";
import { getLocalStorage } from "../../../helpers/LocalStorage";
import { BeatLoader } from "react-spinners";

// AWS-S3 File Upload
import { Buffer } from "buffer";
import S3FileUpload from "react-s3";
window.Buffer = window.Buffer || Buffer;

// AWS-S3 Bucket Credentials Config
const config = {
  bucketName: process.env.REACT_APP_AWS_S3_BUCKET,
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
};

const AutoFillWithResume = ({ stepPlusOne, getParsedResumeData }) => {
  const { record_id } = getLocalStorage("user");

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.resume);
  const { resume_file, parsed_resume } = useSelector((state) => state.resume.autofill_resume);

  const [isResumeUploaded, setIsResumeUploaded] = useState(null);
  const [resumeInitialFileName, setResumeInitialFileName] = useState("");
  const [myFile, setMyFile] = useState([]);
  const [dragStyle, setDragStyle] = useState(false);

  // react-dropzone setup
  const onDropAccepted = useCallback(
    (files) => {
      setResumeInitialFileName(files[0]?.name);

      // creating custom file object using existing file object
      if (!record_id) return;

      const name = record_id + files[0]?.name?.substring(files[0]?.name?.lastIndexOf("."));
      const custom_file = new File([files[0]], name, { type: files[0]?.type });

      setMyFile([custom_file]);
      setDragStyle(false);
      handleUpload(custom_file);
    },
    [setMyFile, record_id]
  );
  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 5242880,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDropAccepted,
    onDragOver: function () {
      setDragStyle(true);
    },
    onDragLeave: function () {
      setDragStyle(false);
    },
  });

  // populate resume-file from redux-store (to avoid state wipe-out)
  useEffect(() => {
    if (Object.keys(resume_file)?.length > 0) {
      setMyFile([resume_file]);
      setResumeInitialFileName(resume_file?.key);
      setIsResumeUploaded(true);
    }
  }, [resume_file]);

  // raise error in case of fileRejections
  useEffect(() => {
    const err = fileRejections[0]?.errors[0].message;
    if (err) toastError(err);
  }, [fileRejections]);

  // once get parsed_resume then pass data to ResumeParse.jsx
  useEffect(() => {
    if (Object.keys(parsed_resume).length > 0) {
      getParsedResumeData(parsed_resume);
    }
  }, [parsed_resume, getParsedResumeData]);

  // handle upload to s3-bucket
  const handleUpload = async (file) => {
    setIsResumeUploaded(false);
    S3FileUpload.uploadFile(file, config)
      .then((data) => {
        console.log(data);
        dispatch(uploadResumeLink(data, () => setIsResumeUploaded(true)));
      })
      .catch((err) => console.error(err));
  };

  // when use click on delete file button
  const HandleRemoveFile = () => {
    setMyFile([]);
    setIsResumeUploaded(null);
    dispatch(setResumeFileRedux({}));
  };

  // handle skip or continue button
  const HandleSkipContinue = () => {
    // Here we are just uploading resume file details only to show user if he move from current page
    if (myFile?.length > 0) {
      // to avoid non-serializable data in state error
      const newFileObj = {
        lastModified: new Date(myFile[0].lastModified).toLocaleDateString(),
        lastModifiedDate: new Date(myFile[0].lastModifiedDate).toLocaleDateString(),
        name: myFile[0]?.name,
        key: resumeInitialFileName,
        size: myFile[0]?.size,
        type: myFile[0]?.type,
      };
      dispatch(setResumeFileRedux(newFileObj));
    }
    stepPlusOne();
  };

  return (
    <div className="container-lg autofill__with__resume__box px-lg-5">
      <h5 className="step__heading">Autofill with Resume</h5>
      <div className="step__content mt-5 px-lg-5">
        <p className="required__line">
          <span className="required__symbol">*</span> Indicates a required field
        </p>
        <p className="mt-3 step__desc">
          Make completing your profile application easier by uploading your resume or CV or click the Next button if you
          prefer to enter your information manually.
          <br />
          Upload PDF File Only (5MB max)
        </p>

        <div className="file__chooser__box">
          <div
            {...getRootProps({ className: "file__chooser" })}
            style={{ borderColor: dragStyle ? "#003815" : "#dadada" }}
          >
            <input {...getInputProps()} />
            <MdArrowUpward className="arrow__icon" />
            <p>Drop file here</p>
            <Link to="#">Select file</Link>
          </div>
        </div>

        {myFile?.length > 0 ? (
          <div className="row mt-4 file__accepted__box">
            <div className="col-2">
              <div className="pdf__col">
                <FaRegFilePdf className="pdf__icon" />
              </div>
            </div>
            <div className="col-9">
              <div className="accepted__content">
                <p>{resumeInitialFileName}</p>
                <p>{Math.round(myFile[0]?.size / 1024)} KB</p>
                <p className="d-flex align-items-center">
                  {isResumeUploaded === null ? (
                    ""
                  ) : isResumeUploaded === false ? (
                    <>
                      <BeatLoader size="8" color="#0f643b" />
                      <span className="resume__accepted__label">Uploading! Please Wait...</span>
                    </>
                  ) : status === STATUSES.ERROR ? (
                    <>
                      <BiX className="file__rejected__icon" />
                      <span className="resume__rejected__label">Upload Failed!</span>
                    </>
                  ) : (
                    <>
                      <BiCheck className="file__accepted__icon" />
                      <span className="resume__accepted__label">Successfully Uploaded!</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="col-1">
              <div className="delete__col">
                <div className="delete__btn mt-3">
                  <BiTrash
                    className="delete__icon"
                    title="Remove File"
                    onClick={HandleRemoveFile}
                    style={{ transform: "scale(1.2)", color: "#6b6b6b", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="mt-4 d-flex justify-content-end">
          <button
            className="btn continue__btn my-2"
            onClick={HandleSkipContinue}
            disabled={isResumeUploaded === false ? true : false}
          >
            Skip or Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoFillWithResume;
