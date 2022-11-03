import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    prop !== "size" && prop !== "fullWidth" && prop !== "variant",
})(({ theme, size, fullWidth, variant }) => ({
  textTransform: "none",
  fontWeight: "bold",
  fontFamily: "Poppins",
  fontSize: size === "small" ? 12 : size === "medium" ? 14 : 16,
  borderRadius: size === "small" ? theme.spacing(1) : theme.spacing(2),
  padding:
    size === "large" || fullWidth
      ? `${theme.spacing(3)} ${theme.spacing(16)}`
      : size === "medium"
      ? `${theme.spacing(2)} ${theme.spacing(6)}`
      : `6 ${theme.spacing(3)}`,
  boxShadow: "none",
  backgroundColor:
    variant == "outlined" || variant == "text"
      ? "transparent"
      : theme.palette.primary.main,
  color:
    variant == "outlined" || variant == "text"
      ? theme.palette.primary.main
      : "#FFF",
  width: fullWidth ? "100%" : "auto",
  textAlign: "center",
  border:
    variant != "text"
      ? ["2px", "solid", theme.palette.primary.main].join(" ")
      : "none",
  "&: hover": {
    border: ["2px", "solid", theme.palette.primary.main].join(" "),
    backgroundColor:
      variant == "outlined" || variant == "text"
        ? theme.palette.neutral.lightest
        : theme.palette.primary.light,
  },
  ...(size == "large" && {
    [theme.breakpoints.up("lg")]: { minWidth: "380px" },
  }),
  "& .MuiButton-startIcon path": {
    fill: variant == "outlined" ? theme.palette.primary.main : "#FFF",
    stroke: variant == "contained" ? "transparent" : theme.palette.primary.main,
  },
}));

export default StyledButton;
