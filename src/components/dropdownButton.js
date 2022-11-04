import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import Icons from "../components/icons";

export default function DropdownButton({
  label,
  items,
  value,
  fullWidth,
  handleChange,
  clearSelect,
}) {
  return (
    <FormControl fullWidth={fullWidth} sx={{ minWidth: 80 }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select value={value} label={label} onChange={handleChange}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            color: "neutral.medium",
            padding: "4px 12px",
            minWidth: 200,
          }}
        >
          Select
          <IconButton size="small" onClick={clearSelect}>
            <Icons.CrossIcon width={16} />
          </IconButton>
        </Box>
        {items &&
          items.length > 0 &&
          items.map((it) => (
            <MenuItem key={it.value || it} value={it.value || it}>
              {it.text || it}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
