import React, { useState } from "react";
import "../../styles/ResumeParse.css";
import { Stepper, Step } from "react-form-stepper";

// Helpers
import { isAuthenticated } from "../../helpers/Auth";

// Resume Steps
import AutoFillWithResume from "./resume-parse/AutoFillWithResume";
import MyInformation from "./resume-parse/MyInformation";
import MyExperience from "./resume-parse/MyExperience";
import MyEducation from "./resume-parse/MyEducation";
import SkillsCertification from "./resume-parse/SkillsCertification";
import Review from "./resume-parse/Review";

const ResumeParse = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedResume, setParsedResume] = useState({});

  // continue & back controls for steps
  const stepPlusOne = () => {
    setCurrentStep((prevState) => prevState + 1);
    window.scrollTo(0, 0);
  };
  const stepMinusOne = () => {
    setCurrentStep((prevState) => prevState - 1);
    window.scrollTo(0, 0);
  };

  // function to get parsed resume details
  const getParsedResumeData = (data) => {
    setParsedResume(data);
  };

  return (
    <div className="resume__parse__box">
      {isAuthenticated()?.userType === "C" && (
        <div className="container-fluid mt-3 mb-5 px-lg-5" id="top">
          <div className="steps__box">
            <Stepper activeStep={currentStep}>
              <Step label="Autofill with Resume">{currentStep > 0 ? "✓" : "1"}</Step>
              <Step label="My Information">{currentStep > 1 ? "✓" : "2"}</Step>
              <Step label="My Experience">{currentStep > 2 ? "✓" : "3"}</Step>
              <Step label="My Education">{currentStep > 3 ? "✓" : "4"}</Step>
              <Step label="Skills &#38; Certification">{currentStep > 4 ? "✓" : "5"}</Step>
              <Step label="Review">{currentStep > 5 ? "✓" : "6"}</Step>
            </Stepper>
          </div>

          <div className="container-fluid px-lg-0 px-4 mt-4 steps__content__box">
            {currentStep === 0 ? (
              <AutoFillWithResume stepPlusOne={stepPlusOne} getParsedResumeData={getParsedResumeData} />
            ) : currentStep === 1 ? (
              <MyInformation
                parsedInfo={parsedResume?.INTRODUCTION}
                stepPlusOne={stepPlusOne}
                stepMinusOne={stepMinusOne}
              />
            ) : currentStep === 2 ? (
              <MyExperience
                parsedInfo={{
                  "WORK EXPERIENCE": parsedResume["WORK EXPERIENCE"] ? [...parsedResume["WORK EXPERIENCE"]] : [],
                  data: { ...parsedResume?.data },
                }}
                stepPlusOne={stepPlusOne}
                stepMinusOne={stepMinusOne}
              />
            ) : currentStep === 3 ? (
              <MyEducation parsedInfo={parsedResume?.EDUCATION} stepPlusOne={stepPlusOne} stepMinusOne={stepMinusOne} />
            ) : currentStep === 4 ? (
              <SkillsCertification
                parsedInfo={parsedResume?.data}
                stepPlusOne={stepPlusOne}
                stepMinusOne={stepMinusOne}
              />
            ) : currentStep === 5 ? (
              <Review stepMinusOne={stepMinusOne} />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// const parsedResume = {
//   INTRODUCTION: [
//     "A goal-oriented individual with a data-driven mindset and strong communication skills having 1.5 years experience in",
//     "Software Development, seeking a challenging position in a progressive organization that will help me enhance my",
//     "industrial exposure, analytical knowledge and my ability to work well with people.",
//   ],
//   EDUCATION: ["MIT World Peace University", "B.Tech. in Computer Science Engineering"],
//   "WORK EXPERIENCE": [
//     "APISERO INC.  | Senior Software Engineer",
//     "Chandler, Arizona | November 2020 - Currently",
//     "Aspen Grove Solutions",
//     "Mulesoft | Devops | API Dev | Analytics | Testing",
//     "● Designed and developed API Speciﬁcations, Mule applications and RESTful web APIs using Anypoint Platform in",
//     "multiple languages YAML, RAML, OpenAPISpec.",
//     "● Designed and Anchored 10+ Mock APIs and POCs (proof of concept) to show implementation, and validate proposed",
//     "solutions to the clients and stakeholders which will in turn increase the clarity for clients moving  forward.",
//     "● Worked on building an end-to-end CICD pipeline for complete deployment of 13 Mule Applications which includes",
//     "connectors and APIs on Cloudhub Server using Teamcity platform.",
//     "● This pipeline had multiple stages - Initially Unit Testing was done, and for code validation and review SonarQube was",
//     "integrated. The nexus repository was also conﬁgured for automated deployment of artifacts. On complete deployment",
//     "to cloudhub, email notiﬁcation is sent to the developer.",
//     "● Worked on building POCs of pipelines and gave demos to clients. This made them  understand the ﬂow in a better way.",
//     "● Worked on securing APIs and worked on a regex for schema validation to notify users when HTTP request is not",
//     "proper format.",
//     "● Created custom business events, conﬁgured custom metrics and designed dashboards to evaluate the performance of",
//     "the API's and mule applications.",
//     "Banking System with AI Chatbot",
//     "https://apiserobank.herokuapp.com",
//     "Django| Rasa Chatbot | SonarQube | Heroku",
//     "● Based on my performance, I was given the opportunity of leading the team of 4 SDE’s for a Training project of 6 weeks.",
//     "● Developed a Banking System using Django Framework (Django Models and Django Forms) where users can create a bank",
//     "account, view his proﬁle, deposit/withdraw money, check the transaction report and transfer money from one account to",
//     "another.",
//     "● Apart from that, users can also view the dashboards to know the details about total balance, total amount debited and",
//     "credited. Dashboard is also present for the bank admin, where he can check details regarding all the users and the total",
//     "money present in bank reserve.",
//     "● Developed a chatbot based on Rasa Framework, which will guide the users in tasks like knowing the Nearest ATM location,",
//     "Transaction limits etc.",
//     "● Complete Code validation was done using SonarQube tool and for Unit Testing and Integration testing PyTest library was",
//     "used.",
//     "● Initially the database was in SQLite after that it was migrated to PostgreSQL to deploy the complete product on Heroku.",
//     "●",
//     "aa",
//     "EATLER | Data Analyst Intern",
//     "Bengaluru, India | June 2020 - September 2020",
//     "● Initially worked on data scraping and gathering of customer reviews from websites like Zomato, Swiggy and Google",
//     "reviews of all restaurants in and around bengaluru.",
//     "● Further, above data was cleaned and sorted based on diﬀerent factors according to diﬀerent cuisines, whether review",
//     "was for dine-in or delivery, etc.",
//     "● Based on this processed data we were able to generate many valuable insights as to what customers expect from us,",
//     "and which all factors create a diﬀerence in the food industry.",
//   ],
//   data: {
//     Mobile: "8668899304",
//     Email: "jaybagrecha1234@gmail.com",
//     GITHUB: "https://github.com/jaybagrecha",
//     LINKEDIN: "https://linkedin.com/in/jaybagrecha",
//     Skills: [
//       "yaml",
//       "algorithms",
//       "big data",
//       "git",
//       "java",
//       "django framework",
//       "tableau",
//       "unit testing",
//       "android",
//       "mysql",
//       "bootstrap",
//       "python",
//       "java",
//       "analytics",
//       "html",
//       "deep learning",
//       "c++",
//       "data visualization",
//       "visualization",
//       "devops",
//       "data analysis",
//       "regex",
//       "jenkins",
//       "sqlite",
//       "data scraping",
//       "nosql",
//       "postgresql",
//       "heroku",
//       "css",
//       "machine learning",
//       "sql",
//       "hadoop",
//       "data structures",
//       "flask",
//       "mongodb",
//     ],
//   },
// };

export default ResumeParse;
