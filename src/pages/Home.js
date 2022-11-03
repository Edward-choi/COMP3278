import MainContent from "../shared/MainContent";
import * as React from "react";
import { Box, Stack } from "@mui/system";
import moment from "moment";
import UpcomingCourseCard from "../components/upcomingCourseCard";

function Home() {
  const [user, setUser] = React.useState({
    name: "",
    loginAt: Date.now(),
  });
  let upcomingCourse = {
    courseId: "COMP3278",
    courseName: "Introduction to Database Management System",
    startAt: new Date(2022, 10, 3, 13, 30, 0),
    endAt: new Date(2022, 10, 3, 15, 30, 0),
    venue: "MWT2",
    zoom: {
      link: "https://hku.zoom.us/j/96226740999?pwd=ZER1UUdxSVVhQzNXbXFkUDd3WjRBdz09",
      meetingId: "21lalf;ksa?123",
    },
    materials: [
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
        <UpcomingCourseCard course={upcomingCourse} />
      </MainContent>
    </div>
  );
}

export default Home;
