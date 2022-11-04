import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
} from "@mui/material";

export default function CourseCard({
  course: { academicYear, courseId, courseName, image },
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
      <CardActionArea sx={{ height: "100%" }}>
        {renderBanner()}
        <CardContent>
          <Box sx={{ fontSize: 12, color: "neutral.mild", mb: 1 }}>
            {academicYear}-{academicYear + 1}
          </Box>
          <Box sx={{ fontSize: 14, color: "neutral.darkest", fontWeight: 550 }}>
            {courseId} {courseName}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
