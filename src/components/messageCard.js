import * as React from "react";
import { styled } from "@mui/material/styles";
import StyledButton from "./button";
import Icons from "./icons";
import { act } from "react-dom/test-utils";
import { Box, Stack, IconButton, Collapse } from "@mui/material";

const Accordion = styled("div", {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  background: `rgba(255, 255, 255, 0.8)`,
  color: theme.palette.neutral.darkest,

  textAlign: "left",
  borderRadius: theme.spacing(1),
  padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
  border: ["1px", "solid", theme.palette.neutral.mild].join(" "),
  boxSizing: "border-size",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "0.3s",
  alignSelf: "stretch",

  "& .header": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },

  "& .content": {
    fontSize: 12,
    marginTop: theme.spacing(8),
  },
}));

function MessageCard({ message: { subject, from, sendAt, content } }) {
  const [active, setActive] = React.useState(true);
  const onToggle = () => {
    setActive(!active);
  };
  return (
    <Accordion active={active}>
      <div className="header">
        <Stack spacing={4} direction="row" sx={{ alignItems: "center" }}>
          <Icons.AvatarIcon
            style={{ minHeight: 40, width: "auto", height: "100%" }}
          />
          <Stack direction="column">
            <p>{subject}</p>
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "row",
                fontSize: 12,
                gap: 5,
              }}
            >
              <span style={{ display: "inline-flex" }}>
                by <Box sx={{ color: "primary.dark" }}>{from}</Box>
              </span>
              {sendAt.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </Box>
          </Stack>
        </Stack>
        <IconButton onClick={onToggle}>
          {active ? <Icons.ChevronDownIcon /> : <Icons.ChevronLeftIcon />}
        </IconButton>
      </div>
      <Collapse in={active}>
        <div className="content">{content}</div>
      </Collapse>
    </Accordion>
  );
}

export default MessageCard;
