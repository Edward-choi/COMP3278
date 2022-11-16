import MainContent from "../shared/MainContent";
import * as React from "react";
import axios from "axios";
import {
  Box,
  Stack,
  Divider,
  Grid,
  List,
  TextField,
  CircularProgress,
} from "@mui/material";
import CourseCard from "../components/courseCard";
import { useGlobalState } from "../shared/auth_provider";
import CourseListTile from "../components/courseListTile";
import DropdownButton from "../components/dropdownButton";

const getCurrentCourses = async (user_id) => {
  const res = await axios.get("http://127.0.0.1:5000/current_courses", {
    params: { user_id: user_id },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

const getCourses = async (user_id) => {
  const res = await axios.get(`http://127.0.0.1:5000/courses`, {
    params: { user_id: user_id },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

const getFilterCourses = async (user_id, search, filter, order) => {
  const res = await axios.get("http://127.0.0.1:5000/filter_courses", {
    params: {
      user_id: user_id,
      search: search,
      filter: filter,
      order: order,
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  return res;
};

function Courses() {
  const [filterState, setFilter] = React.useState(1);
  const [sortBy, setSortBy] = React.useState(1);
  const [searchText, setSearchText] = React.useState("");
  const [currentCourses, setCurrentCourse] = React.useState([]);
  const [filteredCourses, setFilteredCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [state, dispatch] = useGlobalState();

  const filterMenu = [
    { query: "", text: "All" },
    {
      query:
        state.stars.length > 0
          ? `Classes.class_id IN (${state.stars.join(",")})`
          : `Classes.class_id IN (-1)`,
      text: "Star",
    },
    { query: "academic_year = YEAR(now())", text: "In progress" },
    { query: "academic_year > YEAR(now())", text: "Future" },
    { query: "academic_year < YEAR(now())", text: "Past" },
  ];
  const sortByMenu = [
    { query: "academic_year", order: 0, text: "All" },
    { query: "academic_year", order: -1, text: "Academic year" },
    { query: "course_code", order: 1, text: "Course code" },
    { query: "course_name", order: 1, text: "Course name" },
  ];

  React.useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const current_courses = (await getCurrentCourses(state.user.user_id))
          .data;
        const courses = (await getFilterCourses(state.user.user_id, searchText))
          .data;
        setCurrentCourse(current_courses);
        setFilteredCourses(courses);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
    try {
      const res = (
        await getFilterCourses(state.user.user_id, event.target.value)
      ).data;
      setFilteredCourses(res);
    } catch (error) {}
  };

  const handleFilterChange = async (event) => {
    event.preventDefault();
    setFilter(event.target.value);
    let query = filterMenu[event.target.value - 1].query;
    try {
      const res = (
        await getFilterCourses(state.user.user_id, searchText, query)
      ).data;
      setFilteredCourses(res);
    } catch (error) {}
  };

  const handleSortChange = async (event) => {
    let value = event.target.value;

    setSortBy(value);
    let index = value - 1;
    let order = (sortByMenu[index].query +=
      sortByMenu[index] > 0 ? " ASC" : " DESC");
    try {
      const res = (
        await getFilterCourses(state.user.user_id, searchText, null, order)
      ).data;
      setFilteredCourses(res);
    } catch (error) {}
  };
  const clearFilter = (prop) => {
    if (prop == "state") setFilter(1);
    else if (prop == "sort") setSortBy(1);
  };

  return (
    <div>
      <MainContent>
        {!loading ? (
          <div
            style={{
              position: "relative",
              width: "100%",
              flexGrow: "1",
            }}
          >
            <Stack spacing={1} direction="column">
              <h2>Current Courses</h2>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={{ xs: 3, md: 6 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {currentCourses.map((course, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
            <Stack spacing={1} direction="column" sx={{ mt: 16 }}>
              <h2>Enrolled Courses</h2>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 4 }}>
                  <Grid item xs={12} md={9}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="Find a course..."
                      value={searchText}
                      onChange={handleSearch}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Stack spacing={2} direction="row">
                      <DropdownButton
                        fullWidth={true}
                        value={filterState}
                        label="State"
                        items={filterMenu.map((obj, index) => ({
                          value: index + 1,
                          text: obj.text,
                        }))}
                        handleChange={handleFilterChange}
                        clearSelect={() => clearFilter("state")}
                      />

                      <DropdownButton
                        fullWidth={true}
                        value={sortBy}
                        label="Sort"
                        items={sortByMenu.map((obj, index) => ({
                          value: index + 1,
                          text: obj.text,
                        }))}
                        handleChange={handleSortChange}
                        clearSelect={() => clearFilter("sort")}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
              <List>
                {filteredCourses.map((course, index) => (
                  <Stack key={index} direction="column">
                    <CourseListTile course={course} />
                    <Divider />
                  </Stack>
                ))}
              </List>
            </Stack>
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

export default Courses;
