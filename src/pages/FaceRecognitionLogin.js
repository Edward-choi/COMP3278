import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Icons from "../components/icons";
import axios from "axios";
import CircularIndeterminate from "../components/loading";
import { useGlobalState } from "../shared/auth_provider";
export default function FaceRecognitionLogin() {
  const [status, setState] = useState(false);
  const [user_id, setId] = useState();
  const [name, setName] = useState();
  const [start, setStart] = useState(false);
  const [state, dispatch] = useGlobalState();
  var interval = useState();
  let navigate = useNavigate();
  // Using useEffect for single rendering
  useEffect(() => {
    interval = setInterval(() => {
      axios({
        method: "GET",
        url: "http://127.0.0.1:5000/verified",
      })
        .then((response) => {
          const res = response.data;
          setId(res.user_id);
          setState(res.state);
          setName(res.name);
          setStart(res.start);
          if (res.status === true) clearInterval(interval);
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

  const reset = (event) => {
    setState(false);
    setName();
    setStart(false);
    window.location.reload(false);
  };

  const createToken = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/login/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Access-Credentials": true,
      },
    });
    return await res.data;
  };

  const handleConfirm = async (event) => {
    try {
      let res = await createToken();
      dispatch({
        token: res.access_token,
        user: res.user,
        loginAt: Date.now(),
      });
      navigate("/");
    } catch (error) {
      console.warn(error);
    }
  };
  return (
    <div>
      <IconButton
        aria-label="delete"
        style={{ position: "absolute", left: 20, top: 20 }}
        component={Link}
        to={"/login"}
      >
        <KeyboardBackspaceIcon fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <img
        key={Date.now()}
        src="http://127.0.0.1:5000/login_verification"
        alt=""
        width="100%"
        height="100%"
        style={{ zIndex: -1, position: "absolute", left: 0, top: 0 }}
        className={status ? "videoCapture" : null}
      />
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "10rem",
          textAlign: "center",
          visibility: status ? "visible" : "hidden",
        }}
      >
        <Icons.RegisteredIcon />
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            visibility: !start ? "hidden" : "visible",
          }}
        >
          {status ? (
            <div style={{ marginTop: "4rem" }}>
              <h2 style={{ fontWeight: "bold", color: "white" }}>
                Scanned Completed
              </h2>
              <h3 style={{ color: "white", display: "inline" }}>
                Are you {name}?{" "}
              </h3>
              <IconButton onClick={handleConfirm}>
                <Icons.GreenTickIcon />
              </IconButton>
              <IconButton onClick={reset}>
                <Icons.RedCrossIcon />
              </IconButton>
            </div>
          ) : (
            <CircularIndeterminate />
          )}
        </div>
      </div>
    </div>
  );
}
