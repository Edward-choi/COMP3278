import * as React from "react";
import { styled } from "@mui/material/styles";
import MainContent from "../shared/MainContent";
import {
  Stack,
  Button,
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
import BannerImg from "../assets/images/login.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { breakpoints } from "@mui/system";

const TextFormField = styled(FormControl)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#fcfcfb" : "#2b2b2b",
    border: "1px solid #ced4da",
    fontSize: 16,
    width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontSize: 16,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  border: ["2px", "solid", theme.palette.primary.main].join(" "),
  "&: hover": {
    border: ["2px", "solid", theme.palette.primary.main].join(" "),
  },
}));

const BannerContainer = styled("div")(({ theme }) => ({
  width: "50vw",
  height: "85vh",
  flexGrow: 1,
  flexShrink: 1,
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  textAlign: "center",
  position: "relative",
  boxSizing: "border-box",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const Banner = styled("img")(({ theme }) => ({
  width: "100%",
  objectFit: "cover",
  backgroundPosition: "center center",
  display: "block",
  alignSelf: "center",
}));

const Form = styled("div")(({ theme }) => ({
  minWidth: "50vw",
  maxWidth: "50%",
  [theme.breakpoints.down("lg")]: { margin: "0 auto" },
  [theme.breakpoints.up("lg")]: { padding: "0px 10%" },
}));

const Link = styled("div")(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  color: theme.palette.primary.main,
  display: "inline",
  textDecorationLine: "underline",
}));

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
      <MainContent>
        <Stack display="flex" direction="row" width="100%">
          <BannerContainer>
            <Banner src={BannerImg} />
          </BannerContainer>
          <Form>
            <h1>Login</h1>

            <StyledButton
              fullWidth={true}
              color="primary"
              variant="contained"
              disableElevation
            >
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
                      fontSize: 12,
                      color: "neutral.medium",
                    },
                  }}
                />
              </FormGroup>
              <Link>Forget password?</Link>
            </div>

            <Stack direction="column" spacing={3} mt={12}>
              <StyledButton
                fullWidth={true}
                color="primary"
                variant="outlined"
                disableElevation
              >
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
                <Link>Sign up</Link>
              </Stack>
            </Stack>
          </Form>
        </Stack>
      </MainContent>
    </div>
  );
}

export default Login;
