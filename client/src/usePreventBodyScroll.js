import { useEffect } from "react";

const usePreventBodyScroll = () => {
  useEffect(() => {
    const preventScroll = (event) => {
      event.preventDefault();
    };

    document.body.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      document.body.removeEventListener("wheel", preventScroll);
    };
  }, []);

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
  };

  return { disableScroll, enableScroll };
};

export default usePreventBodyScroll;
