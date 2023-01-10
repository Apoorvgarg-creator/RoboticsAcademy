import * as React from "react";
import PropTypes from "prop-types";
import CommsManager from "../libs/comms_manager";
import { useState } from "react";
const NewManagerExerciseContext = React.createContext();

export function ExerciseProvider({ children }) {
  const ramHost = window.location.hostname;
  const ramPort = 7163;
  const ramManager = CommsManager(`ws://${ramHost}:${ramPort}`);
  const [exercise, setExercise] = React.useState(null);
  const [alertState, setAlertState] = useState({
    errorAlert: false,
    successAlert: false,
    infoAlert: false,
    warningAlert: false,
  });
  const [launchLevel, setLaunchLevel] = useState(0);
  const [alertContent, setAlertContent] = useState("");
  // connectionState - Connect, Connecting, Connected
  const [connectionState, setConnectionState] = useState("Connect");
  // launchState - Launch, Launching, Ready
  const [launchState, setLaunchState] = useState("Launch");
  const startSim = () => {
    if (connectionState === "Connect") {
      ramManager.connect().then(() => {
        setConnectionState("Connected");
      });
    }
  };
  const connectionButtonClick = () => {
    if (connectionState === "Connect") {
      setConnectionState("Connecting");
      startSim(0);
    }
  };

  const doLaunch = () => {
    const config = JSON.parse(
      document.getElementById("exercise-config").textContent
    );
    console.log(config);
    // Setting up circuit name into configuration
    config.application.params = { circuit: "default" };
    let launch_file = config.launch["0"].launch_file.interpolate({
      circuit: "default",
    });
    config.launch["0"].launch_file = launch_file;

    ramManager
      .launch(config)
      .then((message) => {
        setLaunchState("Ready");
      })
      .catch((response) => {})
      .finally(() => {});
  };

  const launchButtonClick = () => {
    if (connectionState === "Connected" && launchState === "Launch") {
      setLaunchState("Launching");
      doLaunch();
    } else if (connectionState === "Connect") {
      setAlertState({
        ...alertState,
        errorAlert: false,
        successAlert: false,
        warningAlert: true,
        infoAlert: false,
      });
      setAlertContent(
        `A connection with the manager must be established before launching an exercise`
      );
    }
  };
  const onPageLoad = () => {
    console.log("onPageLoad");
  };
  const onUnload = () => {
    console.log("onUnload");
  };
  const [openInfoModal, setOpenInfoModal] = useState(false);
  const handleInfoModalOpen = () => setOpenInfoModal(true);
  const [openLoadModal, setOpenLoadModal] = useState(false);
  const handleLoadModalClose = () => setOpenLoadModal(false);

  return (
    <NewManagerExerciseContext.Provider
      value={{
        onPageLoad,
        onUnload,
        startSim,
        connectionButtonClick,
        launchButtonClick,
        handleLoadModalClose,
        handleInfoModalOpen,
        openInfoModal,
        openLoadModal,
        exercise,
        setExercise,
        alertState,
        alertContent,
        connectionState,
        launchState,
        launchLevel,
      }}
    >
      {children}
    </NewManagerExerciseContext.Provider>
  );
}

ExerciseProvider.propTypes = {
  children: PropTypes.node,
};

export default NewManagerExerciseContext;
