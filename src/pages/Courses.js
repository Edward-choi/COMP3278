import MainContent from "../shared/MainContent";
import * as React from "react";
import { Box, Stack, Divider, Grid } from "@mui/material";
import moment from "moment";
import { styled } from "@mui/material/styles";
import { courses } from "../demo-data/courses";
import CourseCard from "../components/courseCard";

function Courses() {
  return (
    <div>
      <MainContent>
        <Stack spacing={1} direction="column">
          <h2>Current Courses</h2>
          <Grid
            container
            spacing={{ xs: 3, md: 6 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {courses.map((course, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Stack spacing={1} direction="column" sx={{ mt: 16 }}>
          <h2>Enrolled Courses</h2>
        </Stack>
      </MainContent>
    </div>
  );
}

export default Courses;
