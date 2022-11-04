import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainContent from "../shared/MainContent";
import { courses } from "../demo-data/courses";
import { styled } from "@mui/material/styles";
import {
  Stack,
  Box,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Divider,
  Grid,
  List,
  Collapse,
  Button,
} from "@mui/material";
import Icons from "../components/icons";
import DropdownButton from "../components/dropdownButton";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ mt: { xs: 3, sm: 6 } }}>{children}</Box>}
    </div>
  );
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontFamily: "Poppins",
  fontWeight: "bold",
  borderRadius: theme.spacing(1, 1, 0, 0),
  [theme.breakpoints.up("md")]: {
    fontSize: 16,
  },
  fontSize: 14,
}));

export default function Course() {
  const { id, academic_year } = useParams();
  const [course, setCourse] = React.useState();
  const [tab, setTab] = React.useState(0);
  const [messageSortAsc, setMessageSortAsc] = React.useState(-1);
  const [messageSearch, setMessageSearch] = React.useState("");
  const [courseSortAsc, setCourseSortAsc] = React.useState(-1);
  const [courseSearch, setCourseSearch] = React.useState("");
  const [expandDesc, setExpand] = React.useState(true);

  React.useEffect(() => {
    const fetchCourse = async () => {
      try {
        const result = courses.find(
          (c) =>
            c.courseId === id && c.academicYear.toString() === academic_year
        );
        setCourse(result);
      } catch (e) {
        console.warn(e);
      }
    };
    fetchCourse();
    console.log(course);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSearch = (prop) => (event) => {
    const value = event.target.value;
    switch (prop) {
      case "message":
        setMessageSearch(value);
        break;
      case "course":
        setCourseSearch(value);
        break;
      default:
        break;
    }
  };

  const handleFilterChange = (prop) => (event) => {
    const value = event.target.value;
    switch (prop) {
      case "message":
        setMessageSortAsc(value);
        break;
      case "course":
        setCourseSortAsc(value);
        break;
      default:
        break;
    }
  };
  const clearFilter = (prop) => {
    switch (prop) {
      case "message":
        setMessageSortAsc(-1);
        break;
      case "course":
        setCourseSortAsc(-1);
        break;
      default:
        break;
    }
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
          {course.desc}
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
  return (
    <MainContent>
      <div style={{ position: "relative" }}>
        <Box sx={{ position: "absolute", left: -52 }}>
          <IconButton aria-label="Return" size="large">
            <Icons.ReturnIcon />
          </IconButton>
        </Box>
        {course && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ mt: 16, mb: 8 }}>
              <h2>
                {course.courseId} {course.courseName}
              </h2>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <StyledTab label="General" />
                <StyledTab label="Announcements" />
                <StyledTab label="Lectures & Tutorials" />
              </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
              {renderDesc()}
              <Stack spacing={8} direction="row" sx={{ flexWrap: "wrap" }}>
                <Stack
                  spacing={1}
                  direction="column"
                  sx={{
                    alignItems: "flex-start",
                    py: "10",
                    fontSize: { xs: 12, sm: 14 },
                  }}
                >
                  <Box
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      color: "neutral.darkest",
                      mb: 1,
                    }}
                  >
                    Course Instructor
                  </Box>
                  <Box sx={{ color: "primary.main", fontWeight: 700 }}>
                    {course.lecturer}
                  </Box>
                </Stack>
              </Stack>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  columns={{ xs: 5, sm: 8, md: 10 }}
                  spacing={{ xs: 2, md: 4 }}
                >
                  <Grid item xs={3} sm={6} md={9}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="Find a message..."
                      value={messageSearch}
                      onChange={handleSearch("message")}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={1}>
                    <DropdownButton
                      fullWidth={true}
                      value={messageSortAsc}
                      label="Sort"
                      items={[
                        { value: -1, text: "Newest" },
                        { value: 1, text: "Oldest" },
                      ]}
                      handleChange={handleFilterChange("message")}
                      clearSelect={() => clearFilter("message")}
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  columns={{ xs: 5, sm: 8, md: 10 }}
                  spacing={{ xs: 2, md: 4 }}
                >
                  <Grid item xs={3} sm={6} md={9}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="Find a lecture or tutorial..."
                      value={courseSearch}
                      onChange={handleSearch("course")}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={1}>
                    <DropdownButton
                      fullWidth={true}
                      value={courseSortAsc}
                      label="Sort"
                      items={[
                        { value: -1, text: "Newest" },
                        { value: 1, text: "Oldest" },
                      ]}
                      handleChange={handleFilterChange("course")}
                      clearSelect={() => clearFilter("course")}
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Box>
        )}
      </div>
    </MainContent>
  );
}
