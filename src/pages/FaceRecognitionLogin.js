import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Icons from "../components/icons";
import axios from "axios";
import CircularIndeterminate from '../components/loading';

export default function FaceRecognitionLogin() {
    const [state, setState] = useState(false);
    const [name, setName] = useState();
    const [start, setStart] = useState(false);
    var interval = useState();

    // Using useEffect for single rendering
    useEffect(() => {
        interval = setInterval(() => {
            axios({
                method: "GET",
                url: "http://127.0.0.1:5000/verified",
            })
                .then((response) => {
                    const res = response.data
                    setState(res.state)
                    setName(res.name)
                    setStart(res.start)
                    if (res.state === true) clearInterval(interval);
                }).catch((error) => {
                    if (error.response) {
                        console.log(error.response)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                    }
                })
        }, 1000);
        return () => clearInterval(interval)

    }, []);
    return (
        <div>
            <IconButton aria-label="delete" style={{ position: "absolute", left: 20, top: 20 }} component={Link} to={"/login"}>
                <KeyboardBackspaceIcon fontSize="large" sx={{ color: 'white' }} />
            </IconButton>
            <img src="http://127.0.0.1:5000/login_verification" alt="" width="100%" height="100%"
                style={{ zIndex: -1, position: "absolute", left: 0, top: 0 }} className={state ? "videoCapture" : null} />
            <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10rem", textAlign: 'center', visibility: state ? "visible" : "hidden" }}>
                <Icons.RegisteredIcon />
                <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center", visibility: !start ? "hidden" : "visible" }}>
                    {
                        state ?
                            <div style={{ marginTop: "4rem" }}>
                                <h2 style={{ fontWeight: "bold", color: "white" }}>Scanned Completed</h2>
                                <h3 style={{ color: "white", display: "inline" }}>Are you {name}? </h3>
                                <IconButton component={Link} to={"/"}><Icons.GreenTickIcon/></IconButton>
                                <IconButton><Icons.RedCrossIcon /></IconButton>
                            </div>
                            :
                            <CircularIndeterminate />
                    }
                </div>
            </div>
        </div>
    )
}
