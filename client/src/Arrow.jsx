import React, { useContext } from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./arrow.css";

function LeftArrow({ disabled, onClick }) {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  const handleClick = () => {
    if (!isFirstItemVisible) {
      scrollPrev();
    }
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`arrow-button left-arrow ${disabled ? "disabled" : ""} fa-lg`}
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
  );  
}

function RightArrow({ disabled, onClick }) {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  const handleClick = () => {
    if (!isLastItemVisible) {
      scrollNext();
    }
  };

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`arrow-button right-arrow ${disabled ? "disabled" : ""} fa-lg`}

    >
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  );
  
}

export { LeftArrow, RightArrow };
