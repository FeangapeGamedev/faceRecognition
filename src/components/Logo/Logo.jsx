import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import faceIcon from "./facial-recognition.png"; // Import the image

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="logo-tilt"
        glareEnable={true}
        glareMaxOpacity={0.8}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="20px"
      >
        <div className="logo-inner">
          <img src={faceIcon} alt="Facial Recognition Logo" />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;