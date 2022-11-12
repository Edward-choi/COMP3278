import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Link,
} from "@mui/material";

export default function CourseCard({
  course: { academicYear, courseCode, courseName, image },
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
      <Link
        href={`courses/${courseCode}/${academicYear}`}
        sx={{ textDecoration: "none" }}
      >
        <CardActionArea sx={{ height: "100%" }}>
          {renderBanner()}
          <CardContent>
            <Box sx={{ fontSize: 12, color: "neutral.mild", mb: 1 }}>
              {academicYear % 2 == 0
                ? `${academicYear}-${academicYear + 1}`
                : `${academicYear - 1}-${academicYear}`}
            </Box>
            <Box
              sx={{ fontSize: 14, color: "neutral.darkest", fontWeight: 550 }}
            >
              {courseCode} {courseName}
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
