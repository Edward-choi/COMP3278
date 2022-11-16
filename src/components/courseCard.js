import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Link,
} from "@mui/material";

export default function CourseCard({
  course: { class_id, academic_year, course_code, course_name, image },
}) {
  const renderBanner = () => {
    if (image) {
      return (
        <CardMedia component="img" image={image} alt="banner" height="160" />
      );
    } else {
      return (
        <Box
          component="div"
          sx={{ bgcolor: "neutral.lightest", height: 160 }}
        />
      );
    }
  };
  return (
    <Card
      sx={{
        minHeight: 250,
        maxHeight: 300,
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Link href={`/courses/${class_id}`} sx={{ textDecoration: "none" }}>
        <CardActionArea sx={{ height: "100%" }}>
          {renderBanner()}
          <CardContent>
            <Box sx={{ fontSize: 12, color: "neutral.mild", mb: 1 }}>
              {academic_year % 2 == 0
                ? `${academic_year}-${academic_year + 1}`
                : `${academic_year - 1}-${academic_year}`}
            </Box>
            <Box
              sx={{ fontSize: 14, color: "neutral.darkest", fontWeight: 550 }}
            >
              {course_code} {course_name}
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
