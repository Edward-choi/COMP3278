import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainContent from "../shared/MainContent";
import { styled } from "@mui/material/styles";
import moment from "moment";
import {
  Stack,
  Box,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Grid,
  Collapse,
  Button,
  CircularProgress,
} from "@mui/material";
import Icons from "../components/icons";
import DropdownButton from "../components/dropdownButton";
import MessageCard from "../components/messageCard";
import LectureListTile from "../components/lectureListTile";
import CourseErrorImg from "../assets/images/course_error.png";
import axios from "axios";

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

const getCourse = async (id) => {
  const res = await axios.get(`http://127.0.0.1:5000/course/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

const filterMessage = async (id, search, order) => {
  const res = await axios.get(`http://127.0.0.1:5000/course_message`, {
    params: { id: id, search: search, order: order },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

const filterMaterials = async (id, search, order) => {
  const res = await axios.get(`http://127.0.0.1:5000/course_materials`, {
    params: { id: id, search: search, order: order },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

export default function Course() {
  const navigator = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = React.useState(null);
  const [tab, setTab] = React.useState(0);
  const [messageSortAsc, setMessageSortAsc] = React.useState(1);
  const [messageSearch, setMessageSearch] = React.useState("");
  const [lectureSortAsc, setLectureSortAsc] = React.useState(1);
  const [lectureSearch, setLectureSearch] = React.useState("");
  const [expandDesc, setExpand] = React.useState(true);
  const [messages, setMessages] = React.useState([]);
  const [info, setMaterials] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const course = (await getCourse(id)).data;
        const messages = (
          await filterMessage(id, messageSearch, messageSortAsc)
        ).data;
        const materials = (
          await filterMaterials(id, lectureSearch, lectureSortAsc)
        ).data;
        setCourse(course);
        setMessages(messages);
        setMaterials(materials);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSearch = (prop) => async (event) => {
    event.preventDefault();
    const value = event.target.value;

    switch (prop) {
      case "message":
        setMessageSearch(value);
        try {
          const res = (await filterMessage(id, value, messageSortAsc)).data;
          setMessages(res);
        } catch (error) {}

        break;
      case "course":
        setLectureSearch(value);
        try {
          const res = (await filterMaterials(id, value, lectureSortAsc)).data;
          setMaterials(res);
        } catch (error) {}

        break;
      default:
        break;
    }
  };

  const handleFilterChange = (prop) => async (event) => {
    event.preventDefault();
    const value = event.target.value;
    switch (prop) {
      case "message":
        setMessageSortAsc(value);
        try {
          const res = (await filterMessage(id, messageSearch, value)).data;
          setMessages(res);
        } catch (error) {}
        break;
      case "course":
        setLectureSortAsc(value);
        try {
          const res = (await filterMaterials(id, lectureSearch, value)).data;
          setMaterials(res);
        } catch (error) {}
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
        setLectureSortAsc(-1);
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
          {course.description}
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
          <IconButton
            aria-label="Return"
            size="large"
            onClick={() => navigator(-1)}
          >
            <Icons.ReturnIcon />
          </IconButton>
        </Box>
        {!loading ? (
          course ? (
            course && (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ mt: 16, mb: 8 }}>
                  <p>
                    {course.academic_year % 2 == 0
                      ? `${course.academic_year}-${course.academic_year + 1}`
                      : `${course.academic_year - 1}-${course.academic_year}`}
                  </p>
                  <h2>
                    {course.course_code} {course.course_name}
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
                        {course.lecturer?.name}
                      </Box>
                      {course.lecturer?.email}
                      {course.lecturer?.department}
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
                    <Stack
                      spacing={{ xs: 4, md: 6 }}
                      direction="column"
                      sx={{ mt: 8 }}
                    >
                      {messages.map((message, index) => (
                        <MessageCard key={`m${index}`} message={message} />
                      ))}
                    </Stack>
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
                          value={lectureSearch}
                          onChange={handleSearch("course")}
                        />
                      </Grid>
                      <Grid item xs={2} sm={2} md={1}>
                        <DropdownButton
                          fullWidth={true}
                          value={lectureSortAsc}
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
                  <Stack direction="column" sx={{ mt: 8 }}>
                    {info.map((it, index) => (
                      <LectureListTile
                        key={`l${index}`}
                        number={it.course_number}
                        date={it.date}
                        materials={it.materials}
                        zoom={it.zoom}
                      />
                    ))}
                  </Stack>
                </TabPanel>
              </Box>
            )
          ) : (
            <Stack
              direction="column"
              sx={{
                mx: "auto",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={CourseErrorImg} alt="Course 404 Not Found" />
              <h2>Course 404 Not Found</h2>
            </Stack>
          )
        ) : (
          <div className="circular-progress-container">
            <CircularProgress size="10rem" />
          </div>
        )}
      </div>
    </MainContent>
  );
}
