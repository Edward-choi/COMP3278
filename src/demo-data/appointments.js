const today = new Date();

let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

export const appointments = [
  {
    title: 'Website Re-Design Plan',
    startDate: new Date(year, month, day, 9, 35),
    endDate: new Date(year, month, day, 11, 30),
    id: 0,
    location: 'Room 1',
  }, {
    title: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(year, month, day + 1, 12, 11),
    endDate: new Date(year, month, day + 1, 13, 0),
    id: 1,
    location: 'Room 1',
  }
];
