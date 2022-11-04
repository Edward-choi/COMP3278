import MainContent from "../shared/MainContent";
import * as React from "react";
import {
  Box,
  Stack,
  ListItem,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Icons from "../components/icons";
import StyledButton from "./button";

const StyledCourseListTile = styled(ListItem)(({ theme }) => ({
  padding: 0,
  "& .courseListTileHeader": {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "space-between",
    color: theme.palette.neutral.darkest,
  },
}));

const LabelItem = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.up("md")]: {
    gap: theme.spacing(2),
    fontSize: 14,
    "& svg": {
      height: 18,
    },
  },
  gap: theme.spacing(1),
  fontSize: 12,
  "& svg": {
    height: 16,
    width: "auto",
    fill: theme.palette.neutral.lightest,
  },
}));

export default function CourseListTile({
  course: { courseId, courseName, academicYear, lecturer },
}) {
  const theme = useTheme();
  const isSmallOrLess = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <StyledCourseListTile>
      <ListItemButton
        sx={{ borderRadius: 2, padding: 4 }}
        component={Link}
        to={`/courses/${courseId}/${academicYear}`}
      >
        <Stack spacing={3} direction="column" width="100%">
          <div className="courseListTileHeader">
            <h4 style={{ fontWeight: 600 }}>
              {courseId} {courseName}
            </h4>
            <StyledButton
              variant="contained"
              size={isSmallOrLess ? "small" : "medium"}
              startIcon={<Icons.StarEmptyIcon />}
            >
              <Box sx={{ display: { xs: "none", md: "inline-flex" } }}>
                Star
              </Box>
            </StyledButton>
          </div>
          <Stack
            spacing={{ xs: 2, md: 4 }}
            direction="row"
            sx={{ mt: 3, flexWrap: "wrap" }}
          >
            {lecturer && (
              <LabelItem>
                <Icons.UserIcon />
                {lecturer}
              </LabelItem>
            )}
            {academicYear && (
              <LabelItem>
                <Icons.HistoryIcon />
                {`${academicYear} - ${academicYear + 1}`}
              </LabelItem>
            )}
          </Stack>
        </Stack>
      </ListItemButton>
    </StyledCourseListTile>
  );
}
