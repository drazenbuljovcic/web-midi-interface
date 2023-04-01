import clsx from "clsx";
import {
  RefObject,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

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

  const [canChangeOrientation, setCanChangeOrientation] = useState(false);

  useEffect(() => {
    const tryOrientationChange = async () => {
      let caughtError = false;
      if (typeof window === "undefined") {
        return caughtError;
      }

      try {
        await element.current?.requestFullscreen();
        await window.screen?.orientation?.lock("landscape-primary");
      } catch (e) {
        caughtError = true;
      }

      return !caughtError;
    };

    tryOrientationChange().then((can) => {
      setCanChangeOrientation(can);
    });
  }, [element]);

  const handleOrientationChange = useCallback(async () => {
    await element.current?.requestFullscreen();

    window.screen?.orientation
      ?.lock("landscape-primary")
      .catch(function (error) {
        alert(error);
      });
  }, [element]);

  if (!canChangeOrientation) {
    return null;
  }

  return (
    <button className={clsx("p-2")} onClick={handleOrientationChange}>
      {orientationType}
    </button>
  );
};
