import * as React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function VncConsoleViewer(props) {
  const { consoleView } = React.useContext(props.context);
  return (
    <Box display={consoleView ? "block" : "none"}>
      <Typography color={"secondary"} borderBottom={2} m={0.4}>
        Console
      </Typography>
      <iframe
        id={"console-vnc"}
        style={{
          width: "40vw",
          height: "50vh",
        }}
        src={
          consoleView
            ? "http://127.0.0.1:1108/vnc.html?resize=remote&autoconnect=true"
            : ""
        }
      />
    </Box>
  );
}
VncConsoleViewer.propTypes = {
  context: PropTypes.any,
};

export default VncConsoleViewer;
