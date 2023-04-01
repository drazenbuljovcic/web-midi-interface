import { useEffect } from "react";

const useScreenOrientation = () => {
  useEffect(() => {
    const screenOrientation = window.screen.orientation;
    if (screenOrientation) {
      screenOrientation.lock("landscape").catch((e) => {});
    }
  }, []);
};

export default useScreenOrientation;
