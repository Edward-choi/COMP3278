const today = new Date();

export const courseDates = (startOn, endOn, weekdays) => {
  const date = new Date(startOn);
  var dates = [];
  while (date.getTime() < endOn.getTime() && date.getTime() < today.getTime()) {
    for (let weekday in weekdays) {
      const sDate = new Date(
        date.setDate(
          date.getDate() + ((7 + (weekday - date.getDay())) % 7) || 0
        )
      );
      sDate.setHours(0, 0, 0, 0);
      dates.push(sDate);
    }
  }
  return dates;
};
export const courseMessages = (course) => {
  const weekdays = course.schedules.map((s) => s.weekday);
  const dates = courseDates(course.startOn, course.endOn, weekdays);
  return Array.from(dates)
    .map((d) => {
      const date = new Date(d);
      const dayDiff = Math.floor(Math.random() * 5);
      const sDate = new Date(date.setDate(date.getDate() - dayDiff));
      return {
        subject: "Update Tutorial Schedule",
        from: "Dr. Chan",
        send_at: sDate,
        content: "Bla bal testing testing",
      };
    })
    .sort((a, b) => b.send_at - a.send_at);
};

export const courseMaterials = (course) => {
  const weekdays = course.schedules.map((s) => s.weekday);
  const dates = courseDates(course.startOn, course.endOn, weekdays);

  let materials = [];

  dates.forEach(function (date, index) {
    let len = Math.floor(Math.random() * 3);
    materials.push({
      course_number: index + 1,
      date: date.getTime(),
      zoom:
        len < 1
          ? {
              link: "https://hku.zoom.us/j/96226740999?pwd=ZER1UUdxSVVhQzNXbXFkUDd3WjRBdz09",
              meeting_id: "962 2674 0999",
            }
          : null,
      materials: Array.from({ length: len }, (_) => {
        return {
          link: "https://moodle.hku.hk/pluginfile.php/4050987/mod_resource/content/1/tutorial%202-0%20Project%20Introduction.pdf?forcedownload=1",
          file_name: "ProjectCodeIntroduction.pdf",
        };
      }),
    });
  });
  return materials;
};
