import * as React from "react";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import "../style.css";

import {
  Stack,
  Divider,
  Box,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import BannerImg from "../assets/images/login.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StyledButton from "../components/button";

function Login() {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
    formErrors: { email: "", password: "" },
    emailValid: false,
    passwordValid: false,
  });

  const [rememberPassword, setRemember] = React.useState(true);

  const handleChange = (prop) => (event) => {
    let fieldValidationErrors = values.formErrors;
    let emailValid = values.emailValid;
    let passwordValid = values.passwordValid;
    let value = event.target.value;

    switch (prop) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : `${prop} is invalid`;
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : `${prop} is too short`;
        break;
      default:
        break;
    }
    setValues({
      ...values,
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      passwordValid: passwordValid,
      [prop]: value,
    });
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRemember = (event) => {
    setRemember(event.target.checked);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          direction: "row",
          height: "100vh",
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <div className="banner-container">
          <img className="banner" src={BannerImg} alt="login banner" />
        </div>
        <div className="form-container">
          <h1>Login</h1>

          <StyledButton fullWidth color="primary" variant="contained">
            Facial Login
          </StyledButton>
          <Divider sx={{ my: 12 }}>
            <Box sx={{ padding: "0px 32px", color: "neutral.mild" }}>
              or Sign in with Email
            </Box>
          </Divider>
          <Stack spacing={8} direction="column">
            <FormControl
              required
              error={!values.emailValid && values.formErrors.email.length > 0}
            >
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                value={values.email}
                onChange={handleChange("email")}
                label="Email"
              />
              <FormHelperText>{values.formErrors.email}</FormHelperText>
            </FormControl>

            <FormControl
              required
              error={
                !values.passwordValid && values.formErrors.password.length > 0
              }
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="show"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText>{values.formErrors.password}</FormHelperText>
            </FormControl>
          </Stack>
          <div
            style={{
              display: "flex",
              direction: "row",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberPassword}
                    onChange={handleRemember}
                  />
                }
                label="Remember Password"
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: 18 },
                  "& .MuiFormControlLabel-label": {
                    fontSize: 14,
                    color: "neutral.medium",
                  },
                }}
              />
            </FormGroup>
            <a className="link">Forget password?</a>
          </div>

          <Stack direction="column" spacing={3} mt={12}>
            <StyledButton color="primary" variant="outlined" fullWidth>
              Login
            </StyledButton>
            <Stack spacing={2} direction="row">
              <Box
                sx={{
                  fontSize: 12,
                  color: "neutral.medium",
                  display: "inline",
                }}
              >
                Don’t have an account?
              </Box>
              <Link className="link" to="/register">
                Sign up
              </Link>
            </Stack>
          </Stack>
        </div>
      </Box>
    </div>
  );
}

export default Login;
