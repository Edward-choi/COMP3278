import { get } from "../api";

export function getCourses() {
  // mock data for demo purposes
  return Promise.resolve({
    list: [
      {
        id: 1,
        title: "Course 1",
      },
      {
        id: 2,
        title: "Course 2",
      },
      {
        id: 3,
        title: "Course 3",
      },
    ],
    more: false,
  });
  // return get("api/v2/courses");
}
