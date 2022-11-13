import * as React from "react";
import { styled } from "@mui/material/styles";
import Icons from "./icons";
import { Box, Stack, IconButton, Collapse } from "@mui/material";
import { render } from "@testing-library/react";

const Accordion = styled("div")(({ theme }) => ({
  background: `rgba(255, 255, 255, 0.8)`,
  color: theme.palette.neutral.darkest,

  textAlign: "left",
  borderRadius: theme.spacing(1),
  padding: `${theme.spacing(4)} ${theme.spacing(6)}`,
  border: ["1px", "solid", theme.palette.neutral.lightest].join(" "),
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

function MessageCard({ message: { subject, from, send_at, content } }) {
  const [active, setActive] = React.useState(true);
  const onToggle = () => {
    setActive(!active);
  };
  const renderSendAt = () => {
    console.log(send_at);
    return new Date(Date.parse(send_at))?.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
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
                flexDirection: { xs: "column", md: "row" },
                fontSize: 12,
                gap: { xs: 2, md: 5 },
              }}
            >
              <span style={{ display: "inline-flex" }}>
                by
                <Box sx={{ color: "primary.dark" }}>{` ${from}`}</Box>
              </span>
              {renderSendAt()}
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
