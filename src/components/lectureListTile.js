import * as React from "react";
import { Box, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import Icons from "../components/icons";
import moment from "moment";

const StyledLectureListTile = styled("div")(({ theme }) => ({
  padding: theme.spacing(8, 2),
  borderRadius: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  "& .headerContainer": {
    alignSelf: "stretch",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.neutral.darkest,
  },
  "& .detailContainer": {
    color: theme.palette.neutral.medium,
    fontSize: 12,
    gap: theme.spacing(2),
    flexDirection: "row",
    display: "flex",
    alignItems: "start",
    lineHeight: 1.8,
    "& .link": {
      fontSize: 12,
    },
    "& svg": {
      height: 16,
      width: "auto",
      margin: "4px 0px",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 14,
      "& .link": {
        fontSize: 14,
      },
    },
  },
  borderBottom: `1px solid ${theme.palette.neutral.lightest}`,
}));

export default function LectureListTile({ number, date, materials, zoom }) {
  const renderZoom = () => {
    let link = zoom.link;
    let meeting_id = zoom.meeting_id;
    let passCode = zoom.passCode;
    let renderLink, renderMeetingId, renderPassCode;

    if (link !== undefined && link !== null) {
      renderLink = (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          {link}
        </a>
      );
    }
    if (meeting_id !== undefined && meeting_id !== null) {
      renderMeetingId = <div>Meeting ID: {meeting_id}</div>;
    }
    if (passCode !== undefined && passCode !== null) {
      renderPassCode = <div>Password: {passCode}</div>;
    }

    return (
      link && (
        <div className="detailContainer">
          <Icons.LinkOnIcon />
          <Stack spacing={1} direction="column">
            {renderLink}
            {renderMeetingId}
            {renderPassCode}
          </Stack>
        </div>
      )
    );
  };

  const getExtension = (file_name) => {
    var parts = file_name?.split(".");
    return parts[parts.length - 1];
  };

  const renderMaterials = () => {
    return (
      <Stack spacing={1} direction="column">
        {materials.map((m, index) => {
          let file_name = m.link;
          if (m.file_name !== undefined && m.file_name !== null) {
            file_name = m.file_name;
          }
          const ext = getExtension(file_name);
          let fileIcon;
          switch (ext) {
            case "pdf":
              fileIcon = <Icons.PdfIcon sx={{ width: 16, height: "auto" }} />;
              break;
            case "ppt":
              fileIcon = <Icons.PptIcon sx={{ width: 16, height: "auto" }} />;
              break;
            case "doc":
            case "docx":
              fileIcon = <Icons.DocIcon sx={{ width: 16, height: "auto" }} />;
              break;
            default:
              fileIcon = <Icons.LinkIcon sx={{ width: 16, height: "auto" }} />;
              break;
          }
          return (
            <a
              key={index}
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div className="detailContainer">
                {fileIcon}
                {file_name}
              </div>
            </a>
          );
        })}
      </Stack>
    );
  };

  return (
    <StyledLectureListTile>
      <div className="headerContainer">
        <span>Lecture {number}</span>
        <span>{moment(date).format("DD.MM")}</span>
      </div>
      {materials && renderMaterials()}
      {zoom && renderZoom()}
    </StyledLectureListTile>
  );
}
