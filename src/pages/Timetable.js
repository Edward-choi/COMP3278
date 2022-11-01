import MainContent from "../shared/MainContent";
import { appointments } from "../demo-data/appointments";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
    Scheduler,
    WeekView,
    Appointments,
} from '@devexpress/dx-react-scheduler-material-ui';

function Timetable() {
    return (
        <div>
            <MainContent>
                <h1>Timetable</h1>
                <Paper>
                    <Scheduler data={appointments} height={660}>
                        <WeekView startDayHour={8} endDayHour={19} cellDuration={30}/>
                        <Appointments/>
                    </Scheduler>
                </Paper>
            </MainContent>
        </div>
    );
}

export default Timetable;

