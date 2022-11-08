import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularIndeterminate() {
  return (
    <div>
      <CircularProgress size="10rem"/>
      <br></br>
      <h2 style={{fontWeight: "bold", color: "white"}}>Scanning...</h2>
    </div>
  );
}