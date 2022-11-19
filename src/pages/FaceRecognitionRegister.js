import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Icons from "../components/icons";
import axios from "axios";
import ProgressBar from "../components/progressBar";

export default function FaceRecognitionRegister() {
  const { name } = useParams();
  const [state, setState] = useState(false);
  let navigate = useNavigate();

  // Using useEffect for single rendering
  useEffect(() => {
    const interval = setInterval(() => {
      axios({
        method: "GET",
        url: "http://127.0.0.1:5000/facial_registered",
      })
        .then((response) => {
          const res = response.data;
          setState(res.state);
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

  // useEffect(() => {
  //   if (state) {
  //     navigate("/login");
  //   }
  // }, [state]);
  return (
    <div>
      <IconButton
        aria-label="delete"
        style={{ position: "absolute", left: 20, top: 20 }}
        component={Link}
        to={"/register"}
      >
        <KeyboardBackspaceIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <img
        src={"http://127.0.0.1:5000/video_capture/" + name}
        alt=""
        width="100%"
        height="100%"
        style={{ zIndex: -1, position: "absolute", left: 0, top: 0 }}
        className={state ? "videoCapture" : null}
      />
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10rem",
          textAlign: "center",
          visibility: state ? "visible" : "hidden",
        }}
      >
        <Icons.RegisteredIcon />
        <div style={{ marginTop: "8rem", color: "white" }}>
          <h1 style={{ fontWeight: "bold" }}>Registration Completed</h1>
        </div>
        <div style={{ marginTop: "3rem", color: "white" }}>
          <h4>100% Recognized</h4>
        </div>
      </div>
      <div>
        <h2
          style={{
            fontWeight: "bold",
            color: "white",
            visibility: state ? "hidden" : "visible",
            marginTop: "-5rem",
            textAlign: "center",
          }}
        >
          Scanning...
        </h2>
      </div>
      <ProgressBar />
    </div>
  );
}
