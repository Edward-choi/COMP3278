import { useRouter } from "next/router";
import { useCourse } from "@/queries/useCourse";
import { Title } from "@/components/elements/Title";

function CourseDetail() {
  const {
    query: { id },
  } = useRouter();
  const { status, data, error, isFetching } = useCourse(id);
  return (
    <div>
      {status === "loading" ? (
        "Loading...."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <div>
          <Title>{data.title}</Title>
        </div>
      )}
      <div>{isFetching ? "Background Updating..." : " "}</div>
    </div>
  );
}

export default CourseDetail;
