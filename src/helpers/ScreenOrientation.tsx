import clsx from "clsx";
import { useSyncExternalStore } from "react";

export const ScreenOrientation = () => {
  const orientationType = useSyncExternalStore<OrientationType>(
    (cb) => {
      window.screen.orientation.addEventListener("change", cb);
      return () => {
        window.screen.orientation.removeEventListener("change", cb);
      };
    },
    () => {
      return window.screen.orientation.type;
    },
    (): OrientationType => {
      return "landscape-primary" as OrientationType;
    }
  );

  const handleOrientationChange = () => {
    window.screen?.orientation?.lock("landscape-primary").catch((e) => {});
  };

  return (
    <button className={clsx("p-2")} onClick={handleOrientationChange}>
      {orientationType}
    </button>
  );
};
