import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontFamily: "Poppins",
  fontSize: 16,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  border: ["2px", "solid", theme.palette.primary.main].join(" "),
  "&: hover": {
    border: ["2px", "solid", theme.palette.primary.main].join(" "),
  },
}));

export default StyledButton;
