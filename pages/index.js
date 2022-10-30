import { Card } from "@/components/elements/Card";
import { useCourses } from "@/queries/useCourses";

function Home() {
  const { status, data, error, isFetching } = useCourses();
  return (
    <div>
      {status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <div>
          {data.list.map((course, index) => (
            <Card
              key={index}
              title={course.title}
              href={`/course/${course.id}`}
            />
          ))}
        </div>
      )}
      <div>{isFetching ? "Background Updating..." : " "}</div>
    </div>
  );
}

export default Home;
