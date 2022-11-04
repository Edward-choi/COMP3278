import MainContent from "../shared/MainContent";
import * as React from "react";
import { Box, Stack, Divider, Grid, List, TextField } from "@mui/material";
import { courses } from "../demo-data/courses";
import CourseCard from "../components/courseCard";

import CourseListTile from "../components/courseListTile";
import DropdownButton from "../components/dropdownButton";

function Courses() {
  const [filterState, setFilter] = React.useState({
    state: "",
    type: "",
    sort: "",
  });
  const handleFilterChange = (prop) => (event) => {
    setFilter({ ...filterState, [prop]: event.target.value });
  };
  const clearFilter = (prop) => {
    setFilter({ ...filterState, [prop]: "" });
  };
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
          <Grid container spacing={{ xs: 2, md: 4 }}>
            <Grid item xs={12} md={9}>
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Find a course..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack spacing={2} direction="row">
                <DropdownButton
                  fullWidth={true}
                  value={filterState.state}
                  label="State"
                  items={["All", "In progress", "Future", "Past"]}
                  handleChange={handleFilterChange("state")}
                  clearSelect={() => clearFilter("state")}
                />
                <DropdownButton
                  fullWidth={true}
                  value={filterState.type}
                  label="Type"
                  items={["All", "Regular", "Common Core"]}
                  handleChange={handleFilterChange("type")}
                  clearSelect={() => clearFilter("type")}
                />
                <DropdownButton
                  fullWidth={true}
                  value={filterState.sort}
                  label="Sort"
                  items={["All", "Star", "Last Accessed", "Name"]}
                  handleChange={handleFilterChange("sort")}
                  clearSelect={() => clearFilter("sort")}
                />
              </Stack>
            </Grid>
          </Grid>
          <List>
            {courses.map((course, index) => (
              <Stack key={index} direction="column">
                <CourseListTile course={course} />
                <Divider />
              </Stack>
            ))}
          </List>
        </Stack>
      </MainContent>
    </div>
  );
}

export default Courses;
