import MainContent from "../shared/MainContent";
import * as React from "react";
import { Box, Stack, Divider } from "@mui/material";
import moment from "moment";
import { styled } from "@mui/material/styles";
import UpcomingCourseCard from "../components/upcomingCourseCard";
import TimetableListTile from "../components/timeTableListTile";
import { default as courses } from "../demo-data/this-week-courses";

const Timetable = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(9),
  alignSelf: "stretch",
  [theme.breakpoints.up("md")]: {
    maxWidth: "50%",
  },
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

function Home() {
  const [user, setUser] = React.useState({
    name: "",
    loginAt: Date.now(),
  });

  const [selectedCourse, setCourse] = React.useState();
  const selectCourse = (index) => {
    setCourse(index);
  };
  let upcomingCourse = {
    courseId: "COMP3278",
    courseName: "Introduction to Database Management System",
    lecturer: "Dr. Ping Luo",
    startAt: new Date(2022, 10, 3, 13, 30, 0),
    endAt: new Date(2022, 10, 3, 15, 30, 0),
    venue: "Meng Wah Complex MWT2",
    zoom: {
      link: "https://hku.zoom.us/j/96226740999?pwd=ZER1UUdxSVVhQzNXbXFkUDd3WjRBdz09",
      meetingId: "21lalf;ksa?123",
    },
    materials: [
      {
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
      },
      {
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
      },
      {
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
      },
      {
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
      },
    ],
    messages: [
      {
        subject: "Update Tutorial Schedule",
        from: "Dr. Chan",
        sendAt: new Date(2022, 10, 2, 12, 32, 12),
        content: "Bla bal",
      },
    ],
    courseNumber: 4,
  };
  const renderUpcomingCourse = () => {
    return (
      <Stack spacing={1} direction="column" sx={{ mb: 12 }}>
        <h2 style={{ fontWeight: 600 }}>Upcoming Course</h2>
        <UpcomingCourseCard course={upcomingCourse} />
      </Stack>
    );
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
        {upcomingCourse && renderUpcomingCourse()}
        <Stack spacing={4} direction="column">
          <h2 style={{ fontWeight: 600 }}>Timetable</h2>
          <Box
            sx={{
              py: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: { xs: "center", md: "left" },
            }}
          >
            <Timetable>
              {courses?.map((course, index) => (
                <TimetableListTile
                  key={index}
                  course={course}
                  selectCourse={() => setCourse(index)}
                  active={index == selectedCourse}
                />
              ))}
            </Timetable>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" }, mx: 3 }}
            />
          </Box>
        </Stack>
      </MainContent>
    </div>
  );
}

export default Home;
