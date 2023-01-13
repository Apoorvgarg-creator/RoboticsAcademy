import * as React from "react";
import PropTypes from "prop-types";
import CommsManager from "../libs/comms_manager";
import { useState } from "react";
import { saveCode } from "../helpers/utils";
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
  const createData = (key, value) => {
    return { key, value };
  };
  const [frequencyRows, setFrequencyRows] = useState([
    createData("Brain Frequency (Hz)", 0),
    createData("GUI Frequency (Hz)", 0),
    createData("Simulation Real time factor", 0),
  ]);
  const [editorCode, setEditorCode] = useState(`from GUI import GUI
from HAL import HAL
# Enter sequential code!

while True:
    # Enter iterative code!`);

  const [filename, setfilename] = useState("filename");

  const startSim = () => {
    if (connectionState === "Connect") {
      RoboticsExerciseComponents.commsManager.connect().then(() => {
        setConnectionState("Connected");
      });
    }
  };
  const connectionButtonClick = () => {
    if (connectionState === "Connect") {
      setConnectionState("Connecting");
      startSim();
    }
  };

  const doLaunch = () => {
    const config = JSON.parse(
      document.getElementById("exercise-config").textContent
    );
    console.log(document.getElementById("exercise-config"));
    // Setting up circuit name into configuration
    config.application.params = { circuit: "default" };
    let launch_file = config.launch["0"].launch_file.interpolate({
      circuit: "default",
    });
    config.launch["0"].launch_file = launch_file;
    console.log(config, "config");
    RoboticsExerciseComponents.commsManager
      .launch(config)
      .then((message) => {
        setLaunchState("Ready");
        console.log(message);
      })
      .catch((response) => {
        console.log(response, "response");
        setLaunchState("Launch");
      })
      .finally(() => {});
  };

  const editorCodeChange = (e) => {
    setEditorCode(e);
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

  const submitCode = () => {
    try {
      // Get the code from editor and add headers

      console.log(editorCode, "code sumited from state");
      RoboticsExerciseComponents.commsManager
        .send("load", {
          code: editorCode,
        })
        .then((message) => {
          console.log("code loaded");
        })
        .catch((response) => {
          console.error(response);
        });
      setAlertState({
        ...alertState,
        errorAlert: false,
        successAlert: false,
        warningAlert: false,
        infoAlert: true,
      });
      setAlertContent(`Code Sent! Check terminal for more information!`);
      // deactivateTeleOpButton();
    } catch {
      setAlertState({
        ...alertState,
        errorAlert: false,
        successAlert: false,
        warningAlert: true,
        infoAlert: false,
      });
      setAlertContent(
        `Connection must be established before sending the code.`
      );
    }
  };

  const loadFileButton = (event) => {
    event.preventDefault();
    var fr = new FileReader();
    fr.onload = () => {
      setEditorCode(fr.result);
    };
    fr.readAsText(event.target.files[0]);
  };

  const saveFileButton = () => {
    saveCode(filename, editorCode);
  };

  const resetSim = () => {
    RoboticsExerciseComponents.commsManager
      .reset()
      .then(() => {
        console.log("reseting");
      })
      .catch((response) => console.log(response));
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
        frequencyRows,
        setFrequencyRows,
        submitCode,
        editorCodeChange,
        editorCode,
        resetSim,
        loadFileButton,
        saveFileButton,
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
