import MainContent from "../shared/MainContent";
import { appointments } from "../demo-data/appointments";
import React, { useState } from 'react';
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

function Timetable() {
    const today = new Date();

    let day = today.getDate();
    let month = today.getMonth()+1;
    let year = today.getFullYear();
    const now = `${year}-${month<10?`0${month}`:`${month}`}-$${day<10?`0${day}`:`${day}`}`;
    const [date, setDate] = useState(now);
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

