import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/api/courses/getCourses";

export function useCourses() {
  return useQuery(["courses"], async () => {
    return await getCourses();
  });
}
