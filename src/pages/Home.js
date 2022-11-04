import MainContent from "../shared/MainContent";
import * as React from "react";
import { Box, Stack, Divider } from "@mui/material";
import moment from "moment";
import { styled } from "@mui/material/styles";
import UpcomingCourseCard from "../components/upcomingCourseCard";
import TimetableListTile from "../components/timeTableListTile";
import { default as courses } from "../demo-data/this-week-courses";
import ClickableImg from "../assets/images/clickable.png";
import HaveBreakImg from "../assets/images/haveBreak.png";

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
  const today = new Date();

  const diffDays = moment(date).diff(today, "days");
  switch (diffDays) {
    case 0:
      return `Today ${moment(date).format("D.M")}`;
    case 1:
      return `Tomorrow ${moment(date).format("D.M")}`;
    default:
      return `${moment(date).format("dddd D.M")}`;
  }
};

function Home() {
  const [user, setUser] = React.useState({
    name: "",
    loginAt: Date.now(),
  });

  const [selectedCourse, setCourse] = React.useState();

  const onClickCourseList = (course) => {
    if (course !== selectedCourse) setCourse(course);
    else setCourse(null);
  };

  const renderUpcomingCourse = () => {
    return (
      <Stack spacing={1} direction="column" sx={{ mb: 12 }}>
        <h2 style={{ fontWeight: 600 }}>Upcoming Course</h2>
        <UpcomingCourseCard course={courses[0]} />
      </Stack>
    );
  };

  const thisWeekCourses = () => {
    let events = new Map();

    courses.forEach((course) => {
      const cDate = new Date(course.date);
      const date = new Date(cDate.getTime());
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
          <UpcomingCourseCard disableElevation course={selectedCourse} />
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
            display: { sm: "none", md: "flex" },
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
                        key={`${index} ${course.courseId}`}
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
        <Stack spacing={1} direction="column" marginBottom={10}>
          <h3 style={{ margin: 0 }}>Welcome Back {user.name}!</h3>
          <Box
            sx={{
              display: "inline-flex",
              gap: 4,
              color: "neutral.medium",
            }}
          >
            <p>
              Login Time: {moment(user.loginAt).format("DD-MM-yy HH:mm:ss")}
            </p>
            <p>Elapsed staying time:</p>
          </Box>
        </Stack>
        {courses && courses[0] && renderUpcomingCourse()}
        <Stack spacing={4} direction="column">
          <h2>Timetable</h2>
          {renderTimetable()}
        </Stack>
      </MainContent>
    </div>
  );
}

export default Home;
