import MainContent from "../shared/MainContent";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    Toolbar,
    DateNavigator,
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import { useGlobalState } from "../shared/auth_provider";

function Timetable() {
    const today = new Date();
    const [state, dispatch] = useGlobalState();
    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    const now = `${year}-${month < 10 ? `0${month}` : `${month}`}-$${day < 10 ? `0${day}` : `${day}`}`;
    const [date, setDate] = useState(now);
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const getTimetable = async (user_id) => {
            const res = await axios.get(
                `http://127.0.0.1:5000/timetable/${user_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            return res;
        };
        const fetchTimetbale = async () => {
            try {
                const timetable = (await getTimetable(state.user.user_id)).data;
                var tempData = []
                for (var i = 0; i < timetable.data.length; i++) {
                    var classData = timetable.data[i];
                    console.log(classData.address);
                    tempData.push(
                        {
                            title: (
                                <div className="courseInfo">
                                    <div style={{ fontSize: 12, fontWeight: 600 }} className="course_code">
                                        {classData.course_code}
                                    </div>
                                    <div>
                                        <LocationOnIcon sx={{ marginBottom: -2, width: 15 }} />
                                        {classData.venue}
                                    </div>
                                </div>
                            ),
                            startDate: new Date(classData.date + "T" + classData.start_time),
                            endDate: new Date(classData.date + "T" + classData.end_time),
                        }
                    )
                }
                setAppointments(tempData)
            } catch (error) {
                console.warn(error);
            }
        };
        fetchTimetbale();
    }, []);


    return (
        <div>
            <MainContent>
                <h1>Timetable</h1>
                <Paper>
                    <Scheduler data={appointments} height={660}>
                        <ViewState
                            currentDate={date}
                            onCurrentDateChange={newDate => setDate(newDate)}
                        />
                        <WeekView
                            startDayHour={8}
                            endDayHour={19}
                            cellDuration={30}
                        />
                        <Toolbar />
                        <DateNavigator />
                        <TodayButton />
                        <Appointments />
                    </Scheduler>
                </Paper>
            </MainContent>
        </div>
    );
}

export default Timetable;

