import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export default function ProductTimeline({feature_name,index}) {
  return (
    
      <TimelineItem>
        <TimelineSeparator>
            {<TimelineConnector /> }
            {<TimelineDot />}
        </TimelineSeparator>
        <TimelineContent>{feature_name}</TimelineContent>
      </TimelineItem>
  );
}


