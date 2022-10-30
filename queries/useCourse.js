import { useQuery } from "@tanstack/react-query";
import { getCourseById } from "@/api/courses/getCourseById";

export function useCourse(id) {
  return useQuery(
    ["course"],
    async () => {
      return await getCourseById(id);
    },
    {
      enabled: id > 0,
    }
  );
}
