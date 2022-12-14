import MainContent from "../shared/MainContent";
import * as React from "react";
import {
  Box,
  Stack,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import moment from "moment";
import { styled } from "@mui/material/styles";
import UpcomingCourseCard from "../components/upcomingCourseCard";
import TimetableListTile from "../components/timeTableListTile";
import ClickableImg from "../assets/images/clickable.png";
import HaveBreakImg from "../assets/images/haveBreak.png";
import { useGlobalState } from "../shared/auth_provider";
import axios from "axios";

const Timetable = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(9),
  alignSelf: "stretch",
  [theme.breakpoints.up("md")]: {
    minWidth: "50%",
    maxWidth: "60%",
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const TimetableContainer = styled("div")(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
  display: "flex",
  flexDirection: "row",
  alignSelf: "stretch",
  maxWidth: "100%",
  overflowX: "hidden",
  position: "relative",

  [theme.breakpoints.down("md")]: {
    justifyContent: "center",
    "& .courseCardContainer": {
      backgroundColor: "#FFF",
      maxWidth: "85%",
      flexShrink: 1,
      flexGrow: 1,
      position: "absolute",
      top: "0",
      right: "0",
      height: "100%",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    },
  },

  [theme.breakpoints.up("md")]: {
    "& .courseCardContainer": {
      maxWidth: "50%",
    },
  },
}));

const formatDateHeader = (date) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const sDate = new Date(Date.parse(date));
  const diffHours = moment.duration(sDate - today).asHours();

  if (diffHours >= 0 && diffHours <= 24) {
    return `Today ${moment(date).format("D.M")}`;
  } else if (diffHours > 24 && diffHours < 48) {
    return `Tomorrow ${moment(date).format("D.M")}`;
  } else {
    return `${moment(date).format("dddd D.M")}`;
  }
};
const getUpcomingCourse = async (user_id) => {
  const res = await axios.get(
    `http://127.0.0.1:5000/upcoming_course/${user_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  return res;
};

const getThisWeekCourse = async (user_id) => {
  const res = await axios.get(`http://127.0.0.1:5000/this_week_courses`, {
    params: {
      user_id: user_id,
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

function Home() {
  const [state, dispatch] = useGlobalState();
  const [loading, setLoading] = React.useState(true);
  const [selectedCourse, setCourse] = React.useState();
  const [upcomingCourse, setUpcomingCourse] = React.useState();
  const [weekCourses, setWeekCourses] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const upcoming = (await getUpcomingCourse(state.user.user_id)).data;
        const thisWeek = (await getThisWeekCourse(state.user.user_id)).data;
        console.log(upcoming);
        console.log(thisWeek);
        if (!upcoming.hasOwnProperty("msg")) setUpcomingCourse(upcoming);
        if (!thisWeek.hasOwnProperty("msg")) setWeekCourses(thisWeek);
      } catch (error) {
        console.warn(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const onClickSend = () => {
    setShowAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const onClickCourseList = (course) => {
    if (course !== selectedCourse) setCourse(course);
    else setCourse(null);
  };

  const renderUpcomingCourse = () => {
    return (
      <Stack spacing={1} direction="column" sx={{ mb: 12 }}>
        <h2 style={{ fontWeight: 600 }}>Upcoming Course</h2>
        <UpcomingCourseCard
          course={upcomingCourse}
          onClickSend={onClickSend}
          setAlertMessage={setAlertMessage}
        />
      </Stack>
    );
  };

  const thisWeekCourses = () => {
    let events = new Map();

    weekCourses?.forEach((course) => {
      const date = new Date(Date.parse(course.date));
      date.setHours(0, 0, 0, 0);

      const sDate = date.getTime();
      events.has(sDate)
        ? events.set(
            sDate,
            [...events.get(sDate), course].sort((a, b) => a.startAt - b.startAt)
          )
        : events.set(sDate, [course]);
    });
    let orderedEvents = new Map();
    const dates = Array.from(events.keys());

    dates
      ?.sort((a, b) => a - b)
      ?.forEach((key) => orderedEvents.set(key, events.get(key)));

    return orderedEvents;
  };

  const renderSelectedCourse = () => {
    if (selectedCourse !== undefined && selectedCourse !== null) {
      return (
        <div className="courseCardContainer">
          <UpcomingCourseCard
            disableElevation
            course={selectedCourse}
            onClickSend={onClickSend}
            setAlertMessage={(msg) => setAlertMessage(msg)}
          />
        </div>
      );
    } else {
      return (
        <Box
          sx={{
            position: "relative",
            alignSelf: "stretch",
            width: "100%",
            maxWidth: "40%",
            display: { xs: "none", md: "flex" },
          }}
        >
          <Stack
            spacing={6}
            direction="column"
            sx={{
              textAlign: "center",
              alignItems: "center",
              position: "absolute",
              top: "25%",
              left: "25%",
            }}
          >
            <img
              src={ClickableImg}
              alt="Click"
              style={{ maxWidth: 187, height: "auto" }}
            />
            <h4>Click course to view the detail</h4>
          </Stack>
        </Box>
      );
    }
  };

  const renderTimetable = () => {
    if (thisWeekCourses() && thisWeekCourses().size > 0) {
      return (
        <TimetableContainer>
          <Timetable>
            {Array.from(thisWeekCourses().keys())?.map((date, index) => {
              return (
                <Stack
                  spacing={9}
                  direction="column"
                  key={date}
                  sx={{ width: "100%" }}
                >
                  <h3>{formatDateHeader(date)}</h3>
                  {thisWeekCourses()
                    .get(date)
                    ?.map((course) => (
                      <TimetableListTile
                        key={`${index} ${course.course_code}`}
                        course={course}
                        selectCourse={() => onClickCourseList(course)}
                        active={course === selectedCourse}
                      />
                    ))}
                </Stack>
              );
            })}
          </Timetable>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", md: "block" }, mx: 3 }}
          />
          {renderSelectedCourse()}
        </TimetableContainer>
      );
    } else {
      return (
        <Stack
          spacing={3}
          direction="column"
          sx={{
            py: 19,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "stretch",
            textAlign: "center",
            color: "neutral.medium",
          }}
        >
          <img
            src={HaveBreakImg}
            alt="Have a Break!"
            style={{ height: 188, width: "auto", marginBottom: 12 }}
          />
          <h3>No Lectures or Tutorials This Week</h3>
          <Box sx={{ fontSize: 12, color: "neutral.mild" }}>
            Rest is as important as working hard.
          </Box>
        </Stack>
      );
    }
  };

  return (
    <div>
      <MainContent>
        {!loading ? (
          <div>
            <Stack spacing={1} direction="column" marginBottom={10}>
              <h3 style={{ margin: 0 }}>
                Welcome Back {state.user.first_name} {state.user.last_name}!
              </h3>
              <Box
                sx={{
                  display: "inline-flex",
                  gap: 4,
                  color: "neutral.medium",
                }}
              >
                <p>
                  Login Time:{" "}
                  {moment(state.loginAt).format("DD-MM-yy HH:mm:ss")}
                </p>
                <p>
                  Elapsed staying time:
                  {moment.utc(state.duration * 1000).format("HH:mm:ss")}
                </p>
              </Box>
            </Stack>
            {upcomingCourse && renderUpcomingCourse()}
            <Stack spacing={4} direction="column">
              <h2>Timetable</h2>
              {renderTimetable()}
            </Stack>
            <Snackbar
              open={showAlert}
              autoHideDuration={6000}
              onClose={handleCloseAlert}
            >
              <Alert
                onClose={handleCloseAlert}
                severity={alertMessage.includes("Fail") ? "error" : "success"}
              >
                {alertMessage}
              </Alert>
            </Snackbar>
          </div>
        ) : (
          <div className="circular-progress-container">
            <CircularProgress size="10rem" />
          </div>
        )}
      </MainContent>
    </div>
  );
}

export default Home;
