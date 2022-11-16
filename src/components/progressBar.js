import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#ffffff",
    },
  },
});

function LinearProgressWithLabel(props) {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "40%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{ height: 10, borderRadius: 10 }}
            color="primary"
          />
        </Box>
        {/* <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="secondary" fontSize={25}>{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box> */}
      </Box>
    </ThemeProvider>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function ProgressBar() {
  var interval = useState();
  const [progress, setProgress] = useState(0);
  const [start, setStart] = useState();

  useEffect(() => {
    interval = setInterval(() => {
      axios({
        method: "GET",
        url: "http://127.0.0.1:5000/facial_registered",
      })
        .then((response) => {
          const res = response.data;
          setProgress(Math.min(res.count, 100));
          setStart(res.start);
          if (res.state) clearInterval(interval);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        visibility: start ? "visible" : "hidden",
        marginTop: 5,
      }}
    >
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
