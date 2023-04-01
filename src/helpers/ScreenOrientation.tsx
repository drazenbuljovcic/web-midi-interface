import clsx from "clsx";
import {
  RefObject,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import isMobile from "ismobilejs";

export const ScreenOrientation = ({
  element,
}: {
  element: RefObject<HTMLElement>;
}) => {
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

  const handleOrientationChange = useCallback(async () => {
    await element.current?.requestFullscreen();

    window.screen?.orientation
      ?.lock("landscape-primary")
      .catch(function (error) {
        alert(error);
      });
  }, [element]);

  if (typeof window === "undefined" || !isMobile(window.navigator).any) {
    return null;
  }

  return (
    <button className={clsx("p-2")} onClick={handleOrientationChange}>
      {orientationType}
    </button>
  );
};
