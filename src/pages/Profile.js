import MainContent from "../shared/MainContent";
import * as React from "react";
import axios from "axios";

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
  TextField,
} from "@mui/material";
import { useGlobalState } from "../shared/auth_provider";
import StyledButton from "../components/button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Icons from "../components/icons";

const getUserInfo = async () => {
  const res = axios.get("");
};

export default function Profile() {
  const [state, dispatch] = useGlobalState();
  const [values, setValues] = React.useState({
    firstName: "",
    lastName: "",
    major: "",
    year: 1,
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    formErrors: { name: "", email: "", password: "", confirmPassword: "" },
    nameValid: false,
    emailValid: false,
    passwordValid: false,
    confirmPasswordValid: false,
  });

  React.useEffect(() => {}, [state]);

  const save = async (event) => {};

  const handleAPIError = (error) => {
    if (error.response) {
      console.log("error");
      console.log(error.response);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  };

  const handleChange = (prop) => (event) => {
    event.preventDefault();
    let fieldValidationErrors = values.formErrors;
    let nameValid = values.name;
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
      case "firstName":
        nameValid = value.length > 0;
        fieldValidationErrors.name = nameValid ? "" : `${prop} cannot be empty`;
      default:
        break;
    }
    setValues({
      ...values,
      formErrors: fieldValidationErrors,
      nameValid: nameValid,
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
  return (
    <div>
      <MainContent>
        <div className="profile-container">
          <h1 style={{ marginBottom: 40 }}>Edit Profile</h1>
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
                error={!values.nameValid && values.formErrors.name.length > 0}
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
                fullWidth
                id="major"
                value={values.major}
                onChange={handleChange("major")}
                label="Major"
                placeholder="Enter your major"
              />
              <TextField
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
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
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
                !values.confirmPasswordValid &&
                values.formErrors.confirmPassword.length > 0
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
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
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

          <Stack direction="column" spacing={3} mt={8}>
            <StyledButton
              fullWidth={true}
              color="primary"
              variant="contained"
              onClick={save}
            >
              Save
            </StyledButton>
          </Stack>
        </div>
      </MainContent>
    </div>
  );
}
