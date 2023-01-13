import * as React from "react";
import SaveIcon from "@mui/icons-material/Save";
import { Button } from "@mui/material";
import PropTypes from "prop-types";

const SaveButton = (props) => {
  const { saveFileButton } = React.useContext(props.context);

  return (
    <Button
      id={"save"}
      variant="contained"
      color={"secondary"}
      onClick={saveFileButton}
      startIcon={<SaveIcon />}
      sx={{ m: 1 }}
    >
      Save file
    </Button>
  );
};

SaveButton.propTypes = {
  context: PropTypes.any,
};
export default SaveButton;
