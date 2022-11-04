import * as React from "react";
import { Link } from "react-router-dom";

import {
  Stack,
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
  TextField,
} from "@mui/material";
import BannerImg from "../assets/images/login.png";
import StyledButton from "../components/button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Icons from "../components/icons";

function Register() {
  const [step, setStep] = React.useState(1);
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    major: "",
    year: 1,
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    formErrors: { email: "", password: "", confirmPassword: "" },
    emailValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
  });

  const [agreeTerms, setAgree] = React.useState(true);

  const prevStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleChange = (prop) => (event) => {
    let fieldValidationErrors = values.formErrors;
    let emailValid = values.emailValid;
    let passwordValid = values.passwordValid;
    let confirmPasswordValid = values.confirmPasswordValid;
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
      case "confirmPassword":
        confirmPasswordValid = value === values.password;
        fieldValidationErrors.confirmPassword = confirmPasswordValid
          ? ""
          : "confirm passwords does not match";

      default:
        break;
    }
    setValues({
      ...values,
      formErrors: fieldValidationErrors,
      emailValid: emailValid,
      passwordValid: passwordValid,
      confirmPasswordValid: confirmPasswordValid,
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

  const handleAgree = (event) => {
    setAgree(event.target.checked);
  };

  const switchForm = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-container">
            <h1 style={{ marginBottom: 40 }}>Sign Up</h1>
            <Stack spacing={8} direction="column">
              <Stack spacing={3} direction={{ xs: "column", sm: "row" }}>
                <TextField
                  required
                  fullWidth
                  id="first-name"
                  value={values.firstName}
                  onChange={handleChange("firstName")}
                  label="First Name"
                  placeholder="e.g. Alex"
                />
                <TextField
                  fullWidth
                  id="last-name"
                  value={values.lastName}
                  onChange={handleChange("lastName")}
                  label="Last Name"
                  placeholder="e.g. Chan"
                />
              </Stack>
              <Stack spacing={3} direction={{ xs: "column", sm: "row" }}>
                <TextField
                  required
                  fullWidth
                  id="major"
                  value={values.major}
                  onChange={handleChange("major")}
                  label="Major"
                  placeholder="Enter your major"
                />
                <TextField
                  required
                  id="year"
                  type="number"
                  value={values.year}
                  onChange={handleChange("year")}
                  label="Year"
                  placeholder="e.g. 2"
                />
              </Stack>
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
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>{values.formErrors.password}</FormHelperText>
              </FormControl>
              <FormControl
                required
                error={
                  !values.passwordValid && values.formErrors.password.length > 0
                }
              >
                <InputLabel htmlFor="confirm-password">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="show"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>
                  {values.formErrors.confirmPassword}
                </FormHelperText>
              </FormControl>
            </Stack>
            <div
              style={{
                display: "flex",
                direction: "row",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox checked={agreeTerms} onChange={handleAgree} />
                  }
                  label="I've read and agree to"
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: 18 },
                    "& .MuiFormControlLabel-label": {
                      fontSize: 14,
                      color: "neutral.medium",
                    },
                  }}
                />
              </FormGroup>
              <Link className="link">Terms & Condition</Link>
            </div>

            <Stack direction="column" spacing={3} mt={8}>
              <StyledButton
                fullWidth={true}
                color="primary"
                variant="contained"
                onClick={() => nextStep()}
              >
                Continue
              </StyledButton>
              <Stack spacing={2} direction="row">
                <Box
                  sx={{
                    fontSize: 12,
                    color: "neutral.medium",
                    display: "inline",
                  }}
                >
                  Already have an account?
                </Box>
                <Link className="link" to="/login">
                  Login
                </Link>
              </Stack>
            </Stack>
          </div>
        );

      case 2:
        return (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              position: "relative",
              margin: "0 auto",
            }}
          >
            <Box sx={{ position: "absolute", top: 38, left: 38 }}>
              <IconButton
                onClick={() => prevStep()}
                aria-label="Return"
                size="large"
              >
                <Icons.ReturnIcon />
              </IconButton>
            </Box>
            <div
              className="form-container"
              style={{ textAlign: "center", alignSelf: "center" }}
            >
              <Icons.FaceIcon
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "32",
                }}
              />

              <Stack spacing={4} direction="column">
                <h1 style={{ margin: "0" }}>Facial Recognition</h1>
                <h3>SMILE TO LOGIN</h3>
                <p>
                  One step left! Please allow us permission to access your
                  camera for fast and wise facial login.
                </p>
              </Stack>
              <Stack
                spacing={6}
                direction="column"
                sx={{ mt: 24, display: "inline-flex" }}
              >
                <StyledButton variant="contained" size="large">
                  I'm Ready To Smile
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  component={Link}
                  to="/login"
                  size="large"
                >
                  Skip For This Time
                </StyledButton>
              </Stack>
            </div>
          </Box>
        );

      default:
        return <h1>No Page Match</h1>;
    }
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
          <img className="banner" src={BannerImg} alt="sign-in banner" />
        </div>
        {switchForm()}
      </Box>
    </div>
  );
}

export default Register;
