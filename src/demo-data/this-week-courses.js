import { AssessmentRounded } from "@mui/icons-material";

const today = new Date();

let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

const courses = [
  {
    courseId: "COMP3278",
    courseName: "Introduction to Database Management System",
    lecturer: "Dr. Ping Luo",
    desc: "This course studies the principles, design, administration, and implementation of database management systems. Topics include: entity-relationship model, relational model, relational algebra, database design and normalization, database query languages, indexing schemes, integrity and concurrency control.",
    preRequisites: [],
    startOn: new Date(year, 8, 1),
    endOn: new Date(year, 11, 30),
    schedules: [
      {
        weekday: 1,
        startAt: new Date(year, month, day, 14, 30),
        endAt: new Date(year, month, day, 15, 20),
      },
      {
        weekday: 4,
        startAt: new Date(year, month, day, 13, 30),
        endAt: new Date(year, month, day, 15, 20),
      },
    ],
  },
  {
    courseId: "COMP3330",
    courseName: "Interactive Mobile Application Design and Programming",
    lecturer: "Chim T W",
    desc: "This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills. ",
    preRequisites: ["COMP2396"],
    startOn: new Date(year, 8, 1),
    endOn: new Date(year, 11, 30),
    schedules: [
      {
        weekday: 2,
        startAt: new Date(year, month, day, 9, 30),
        endAt: new Date(year, month, day, 11, 20),
      },
      {
        weekday: 5,
        startAt: new Date(year, month, day, 10, 30),
        endAt: new Date(year, month, day, 11, 20),
      },
    ],
  },
];

const generateCourseInformation = (weekday) => {
  const date = new Date();
  const startDate = new Date(
    date.setDate(date.getDate() + ((7 - weekday + 1) % 7) || 0)
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
