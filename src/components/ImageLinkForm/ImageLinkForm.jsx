import React from "react";
import './ImageLinkform.css';

const ImageLinkForm = () => {
  return (
    <div>
      <p className="f3">
        This app will detect faces in your pictures. Give it a try!
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            placeholder="Paste image URL here"
            autoComplete="off"
          />
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple">
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;