import * as React from "react";
import { Box } from "@mui/material";
import LoadModal from "../modals/LoadModal";
import CustomAlert from "../common/CustomAlert";
import ErrorModal from "../modals/ErrorModal";
import PropTypes from "prop-types";
import InfoModal from "../modals/InfoModal";

function FollowLineNewManagerExerciseView(props) {
  return (
    <Box id="exercise-view">
      <CustomAlert context={props.context} />
      {/*<ErrorModal context={props.context} />*/}
      <InfoModal context={props.context} />
    </Box>
  );
}
FollowLineNewManagerExerciseView.propTypes = {
  context: PropTypes.any,
};

export default FollowLineNewManagerExerciseView;
