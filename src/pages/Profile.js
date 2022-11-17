import MainContent from "../shared/MainContent";
import * as React from "react";
import axios from "axios";

import {
  Stack,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import { useGlobalState } from "../shared/auth_provider";
import StyledButton from "../components/button";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const getUserInfo = async (user_id) => {
  const res = await axios.get(`http://127.0.0.1:5000/personal_info/${user_id}`);
  return await res.data;
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
    showPassword: false,
    formErrors: { name: "", email: "", password: "" },
    nameValid: true,
    emailValid: true,
    passwordValid: true,
  });
  const [showAlert, setShowAlert] = React.useState(false);
  const [updateStatus, setUpdateStatus] = React.useState(false);
  const [loadingUpdate, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchPersonalInfo = async () => {
      const res = await getUserInfo(state.user.user_id);
      setValues({
        ...values,
        firstName: res?.first_name,
        lastName: res?.last_name,
        major: res?.major ?? "",
        year: res?.year ?? 1,
        email: res?.email ?? "",
        password: res?.password ?? "",
      });
    };
    fetchPersonalInfo();
  }, []);

  const saveInfo = async (event) => {
    let formValidationErrors = values.formErrors;
    if (!values.nameValid) formValidationErrors.name = "name is invalid";

    if (!values.emailValid) formValidationErrors.email = "email is invalid";

    if (!values.passwordValid)
      formValidationErrors.password = "password is invalid";

    setValues({ ...values, formErrors: formValidationErrors });
    if (!values.nameValid || !values.emailValid || !values.passwordValid)
      return;
    console.log("update");
    if (!loadingUpdate) {
      setLoading(true);
      try {
        const res = (await editProfile()).data;
        dispatch({ user: res.user });
        setUpdateStatus(true);
        console.log("success");
      } catch (error) {
        handleAPIError(error);
        setUpdateStatus(false);
      } finally {
        setShowAlert(true);
        setLoading(false);
      }
    }
  };

  const editProfile = async () => {
    let data = {
      user_id: state.user.user_id,
      firstName: values.firstName,
      lastName: values.lastName,
      major: values.major,
      year: values.year,
      email: values.email,
      password: values.password,
    };
    const res = await axios.post("http://127.0.0.1:5000/edit_profile", data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    });
    return res;
  };

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
      case "firstName":
        nameValid = value.length > 0;
        fieldValidationErrors.name = nameValid ? "" : `${prop} cannot be empty`;
        break;
      default:
        break;
    }
    setValues({
      ...values,
      formErrors: fieldValidationErrors,
      nameValid: nameValid,
      emailValid: emailValid,
      passwordValid: passwordValid,

      [prop]: value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
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
        <Alert
          severity={updateStatus ? "success" : "error"}
          onClose={() => {
            setShowAlert(false);
          }}
          sx={{ visibility: showAlert ? "visible" : "hidden" }}
        >
          {updateStatus
            ? `You have successfully updated the profile!`
            : "Fail update -- please check your fill in again!"}
        </Alert>
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
                onSubmit={handleSubmit}
                label="First Name"
                placeholder="e.g. Alex"
                error={!values.nameValid && values.formErrors.name.length > 0}
              />
              <TextField
                fullWidth
                id="last-name"
                value={values.lastName}
                onChange={handleChange("lastName")}
                onSubmit={handleSubmit}
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
                onSubmit={handleSubmit}
                label="Major"
                placeholder="Enter your major"
              />
              <TextField
                id="year"
                type="number"
                value={values.year}
                onChange={handleChange("year")}
                onSubmit={handleSubmit}
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
                onSubmit={handleSubmit}
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
                onSubmit={handleSubmit}
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

          <Stack direction="column" spacing={3} mt={8}>
            <StyledButton
              fullWidth={true}
              color="primary"
              variant="contained"
              onClick={saveInfo}
              loading={loadingUpdate.toString()}
              loading_indicator="Loading..."
            >
              Save
            </StyledButton>
          </Stack>
        </div>
      </MainContent>
    </div>
  );
}
