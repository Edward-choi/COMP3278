import { get } from "../api";

export function getCourseById(id) {
  // mock data for demo purposes
  return Promise.resolve({
    id,
    title: `Course ${id}`,
  });
  // return get(`api/v2/courses/${id}`);
}
