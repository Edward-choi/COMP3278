import LocationOnIcon from "@mui/icons-material/LocationOn";
const today = new Date();

let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

export const appointments = [
  {
    title: (
      <div className="courseInfo">
        <div style={{ fontSize: 12, fontWeight: 600 }} className="course_code">
          COMP3278
        </div>
        <div>
          <LocationOnIcon sx={{ marginBottom: -2, width: 15 }} />
          MB301
        </div>
      </div>
    ),
    startDate: new Date(year, month, day, 9, 30),
    endDate: new Date(year, month, day, 11, 30),
    id: 0,
    location: "Room 1",
  },
  {
    title: (
      <div className="courseInfo">
        <div style={{ fontSize: 12, fontWeight: 600 }} className="course_code">
          COMP3330
        </div>
        <div>
          <LocationOnIcon sx={{ marginBottom: -2, width: 15 }} />
          CPD LG08
        </div>
      </div>
    ),
    startDate: new Date(year, month, day - 1, 12, 0),
    endDate: new Date(year, month, day - 1, 12, 50),
    id: 1,
    location: "Room 1",
  },
];
