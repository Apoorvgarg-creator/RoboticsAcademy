import * as React from "react";
import PropTypes from "prop-types";
import CommsManager from "../libs/comms_manager";
const NewManagerExerciseContext = React.createContext();

export function ExerciseProvider({ children }) {
  const ramHost = window.location.hostname;
  const ramPort = 7163;
  const ramManager = CommsManager(`ws://${ramHost}:${ramPort}`);
  const [exercise, setExercise] = React.useState(null);
  const [connectionState, setConnectionState] = React.useState("Connect");
  const startSim = () => {
    if (connectionState === "Connect") {
      ramManager.connect().then(() => {
        setConnectionState("Connected");
      });
    }
  };
  return (
    <NewManagerExerciseContext.Provider
      value={{ startSim, exercise, setExercise }}
    >
      {children}
    </NewManagerExerciseContext.Provider>
  );
}

ExerciseProvider.propTypes = {
  children: PropTypes.node,
};

export default NewManagerExerciseContext;
