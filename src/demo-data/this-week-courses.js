import { AssessmentRounded } from "@mui/icons-material";
import { courses } from "./courses";
const today = new Date();

const generateCourseInformation = (weekday) => {
  const date = new Date();
  const startDate = new Date(
    date.setDate(date.getDate() + ((7 + (weekday - date.getDay())) % 7) || 0)
  );

  const venue = weekday % 2 ? "Meng Wah Complex MWT2" : "Chong Yue Ming CYYP2";
  const zoom =
    weekday % 2
      ? {
          link: "https://hku.zoom.us/j/96226740999?pwd=ZER1UUdxSVVhQzNXbXFkUDd3WjRBdz09",
          meetingId: "214t1ds14",
        }
      : null;
  var materials = [];
  const length = Math.floor(Math.random() * 9);
  let i = 0;
  for (i = 0; i < length; i++) {
    materials[i] = {
      link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
    };
  }
  var messages = [];
  const messageLength = Math.floor(Math.random() * 2);
  for (i = 0; i < messageLength; i++) {
    messages[i] = {
      subject: "Update Tutorial Schedule",
      from: "Dr. Chan",
      sendAt: today,
      content: "Bla bal testing testing",
    };
  }
  return {
    date: startDate,
    venue: venue,
    zoom: zoom,
    materials: materials,
    messages: messages,
  };
};

export default courses
  .map(({ startOn, endOn, schedules, ...restArgs }) => {
    const info = schedules.map(({ weekday, ...restTime }) => {
      return { ...generateCourseInformation(weekday), ...restTime };
    });
    return info.map(({ ...i }) => {
      const result = { ...i, ...restArgs };

      return result;
    });
  })
  .flat();
