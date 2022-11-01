import MainContent from "../shared/MainContent";
import { Stack } from "@mui/material";
import CustomButton from "../components/button";

function Login() {
  return (
    <div>
      <MainContent>
        <h1>Login</h1>
        <Stack spacing={12} direction="column">
          <CustomButton fullWidth={true} color="primary" variant="contained">
            Facial Login
          </CustomButton>
        </Stack>
      </MainContent>
    </div>
  );
}

export default Login;
