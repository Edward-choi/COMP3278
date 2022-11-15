import { Stack, Box } from "@mui/material";
export default function Appointment({
  class_id,
  course_code,
  course_name,
  venue,
  startDate,
  endDate,
}) {
  return <Stack direction="column" spacing={0.5} sx={{ py: 2, px: 3 }}></Stack>;
}
