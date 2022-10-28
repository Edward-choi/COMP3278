import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "variant",
})(({ theme, size, variant }) => ({
  boxShadow: "none",
  textTransform: "none",
  borderRadius: theme.spacing(2),
  ...(variant == "contained" && {}),
}));

export default CustomButton;
