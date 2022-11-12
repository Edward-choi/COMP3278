import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  Collapse,
  Button,
  Link,
} from "@mui/material";
import StyledButton from "./button";
import Icons from "./icons";
import MessageCard from "./messageCard";

const CourseCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "disableElevation",
})(({ theme, disableElevation }) => ({
  backgroundColor: "#FFF",
  boxShadow: disableElevation ? "none" : "0px 4px 8px rgba(0, 0, 0, 0.15)",
  borderRadius: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  flex: "none",
  alignItems: "flex-start",
  padding: `${theme.spacing(6)} ${theme.spacing(8)}`,
  gap: theme.spacing(9),
}));

const CourseDetailHeader = styled("span")(({ theme }) => ({
  alignItems: "center",
  fontSize: 16,
  lineHeight: 1.8,
  display: "inline-flex",
  flexDirection: "row",
  color: theme.palette.neutral.darkest,
  gap: theme.spacing(2),
  height: "auto",
  "& svg": {
    width: 20,
    height: 20,
  },
}));

const CourseContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    padding: `0 ${theme.spacing(3)} 0 ${theme.spacing(8)}`,
  },
}));

const MaterialCard = styled("div")(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.light,
  width: 100,
  height: 100,
  gap: theme.spacing(2),
  display: "-webkit-box",
  flexDirection: "column",
  color: theme.palette.neutral.medium,
  fontSize: 10,
  textAlign: "center",
  wordBreak: "break-word",
  textOverflow: "ellipsis",
  overflow: "hidden",
  WebkitLineClamp: 2,
  lineClamp: 2,
  "& svg": {
    width: 40,
    height: 40,
  },
  "&:hover": {
    backgroundColor: theme.palette.neutral.lightest,
  },
}));

// zoom :{ link:string , meetingId:sting, passCode:string },
// material: {link:string, name:string}
// message: {subject: string, content:string, from: string(teacher's name), date: dateTime}
function UpcomingCourseCard({
  course: {
    courseCode,
    academicYear, // required for routing to CourseDetailPage
    courseName, // string
    startAt, // time
    endAt, // time
    venue, // string
    desc, // string
    zoom,
    materials,
    messages,
  },
  disableElevation,
}) {
  const theme = useTheme();
  const isSmallOrLess = useMediaQuery(theme.breakpoints.up("sm"));
  const ref = React.useRef(null);
  const [width, setWidth] = React.useState(0);
  const [expandDesc, setExpand] = React.useState(false);

  React.useLayoutEffect(() => {
    setWidth(ref?.current?.offsetWidth ?? 0);
  }, [ref.current]);

  const sendCopyToEmail = () => {};
  const downloadAll = () => {};

  const renderTimeRangeString = () => {
    if (
      typeof startAt === "object" &&
      startAt !== null &&
      "getHours" in startAt
    ) {
      if (typeof endAt === "object" && endAt !== null && "getHours" in endAt) {
        return `${startAt.getHours()}:${startAt.getMinutes()} - ${endAt.getHours()}:${endAt.getMinutes()}`;
      }
    }
    return "";
  };

  const toggleExpand = () => {
    setExpand((prev) => !prev);
  };

  const renderDesc = () => {
    return (
      <Stack
        spacing={4}
        direction="column"
        sx={{
          fontSize: 12,
          color: "neutral.medium",
          lineHeight: 1.8,
          alignItems: "flex-end",
        }}
      >
        <Collapse in={expandDesc} collapsedSize={40}>
          {desc}
        </Collapse>
        <Button
          variant="text"
          endIcon={
            expandDesc ? <Icons.ChevronUpIcon /> : <Icons.ChevronDownIcon />
          }
          onClick={() => toggleExpand()}
          size="small"
          sx={{ color: "neutral.medium", textTransform: "none" }}
        >
          Show {expandDesc ? "less" : "more"}
        </Button>
      </Stack>
    );
  };

  const renderAddress = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", sm: "space-between" },
          alignItems: "center",
          gap: { xs: 2, sm: 0 },
        }}
      >
        <CourseDetailHeader>
          <Icons.LocationOutLinedIcon />
          {isSmallOrLess && "Course Address"}
        </CourseDetailHeader>
        {venue}
      </Box>
    );
  };

  const renderZoom = () => {
    let link = zoom.link;
    let meetingId = zoom.meetingId;
    let passCode = zoom.passCode;
    let renderLink, renderMeetingId, renderPassCode;

    if (link !== undefined && link !== null) {
      renderLink = (
        <a href={link} className="link">
          {link}
        </a>
      );
    }
    if (meetingId !== undefined && meetingId !== null) {
      renderMeetingId = (
        <Box sx={{ fontSize: 12, color: "neutral.medium", lineHeight: 1.8 }}>
          Meeting ID: {meetingId}
        </Box>
      );
    }
    if (passCode !== undefined && passCode !== null) {
      renderPassCode = (
        <Box sx={{ fontSize: 12, color: "neutral.medium", lineHeight: 1.8 }}>
          Password: {passCode}
        </Box>
      );
    }
    if (
      link !== undefined &&
      link !== null &&
      (meetingId === undefined || meetingId === null) &&
      (passCode === undefined || passCode === null)
    ) {
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CourseDetailHeader>
          <Icons.LinkIcon />
          Zoom Link
        </CourseDetailHeader>
        {renderLink}
      </div>;
    } else {
      return (
        <Stack spacing={2} direction="column">
          <CourseDetailHeader>
            <Icons.LinkIcon />
            Zoom Link
          </CourseDetailHeader>
          <CourseContainer>
            {renderLink}
            {renderMeetingId}
            {renderPassCode}
          </CourseContainer>
        </Stack>
      );
    }
  };

  const getExtension = (fileName) => {
    var parts = fileName.split(".");
    return parts[parts.length - 1];
  };

  const renderMaterials = () => {
    var maxLength = Math.floor(width / 88) - 1;
    var croppedMaterials = materials.slice(0, maxLength);

    return (
      <Stack spacing={2} direction="column">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CourseDetailHeader>
            <Icons.NoteIcon />
            Course Materials
          </CourseDetailHeader>
          <StyledButton
            size="small"
            variant="outlined"
            startIcon={<Icons.DownloadIcon />}
            onClick={() => downloadAll()}
          >
            {isSmallOrLess && "Download All"}
          </StyledButton>
        </div>
        <CourseContainer>
          <Stack
            spacing={3}
            direction="row"
            sx={{ overflow: "hidden" }}
            ref={ref}
          >
            {croppedMaterials.map(function (m, index) {
              let fileName = m.link;
              if (m.fileName !== undefined && m.fileName !== null) {
                fileName = m.fileName;
              }
              const ext = getExtension(fileName);
              let fileIcon;
              switch (ext) {
                case "pdf":
                  fileIcon = <Icons.PdfIcon />;
                  break;
                case "ppt":
                  fileIcon = <Icons.PptIcon />;
                  break;
                case "doc":
                case "docx":
                  fileIcon = <Icons.DocIcon />;
                  break;
                default:
                  fileIcon = <Icons.LinkIcon />;
                  break;
              }

              if (
                index < maxLength - 1 ||
                (index === maxLength - 1 && maxLength >= materials.length)
              ) {
                return (
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                    key={index}
                  >
                    <MaterialCard>
                      {fileIcon}
                      {fileName}
                    </MaterialCard>
                  </a>
                );
              } else {
                return (
                  <MaterialCard key={index}>
                    <div style={{ fontSize: 16 }}>
                      {materials.length - maxLength} More
                    </div>
                  </MaterialCard>
                );
              }
            })}
          </Stack>
        </CourseContainer>
      </Stack>
    );
  };

  const renderMessages = () => {
    return (
      <Stack spacing={2} direction="column">
        <CourseDetailHeader>
          <Icons.MessageIcon />
          Teacher's Messages
        </CourseDetailHeader>
        <CourseContainer>
          <Stack spacing={2} direction="column">
            {messages.map((message, index) => {
              return <MessageCard key={index} message={message} />;
            })}
          </Stack>
        </CourseContainer>
      </Stack>
    );
  };

  return (
    <CourseCard disableElevation={disableElevation}>
      <Stack spacing={2} direction="column" width={"100%"}>
        <Box sx={{ color: "neutral.medium", fontSize: 14 }}>
          {renderTimeRangeString()}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: { sm: 4, md: 8 },
            alignItems: "center",
            alignSelf: "stretch",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={`courses/${courseCode}/${academicYear}`}
            sx={{ textDecoration: "none", color: "neutral.darkest" }}
          >
            <h4 style={{ padding: "8px 0px", display: "flex", flexGrow: 1 }}>
              {courseCode}--{courseName}
            </h4>
          </Link>
          <StyledButton
            size="small"
            variant="contained"
            startIcon={<Icons.EmailIcon />}
            onClick={() => sendCopyToEmail()}
          >
            {isSmallOrLess && "Send"}
          </StyledButton>
        </Box>
        {desc && desc.length > 0 && renderDesc()}
      </Stack>
      <Stack spacing={6} direction="column" sx={{ alignSelf: "stretch" }}>
        {venue && renderAddress()}
        {zoom && renderZoom()}
        {materials && materials.length > 0 && renderMaterials()}
        {messages && messages.length > 0 && renderMessages()}
      </Stack>
    </CourseCard>
  );
}

export default UpcomingCourseCard;
