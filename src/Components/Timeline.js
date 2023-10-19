import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export default function ProductTimeline({feature_name, index}) {
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot data-testid="timeline-dot" />
        <TimelineConnector data-testid="timeline-connector" />
      </TimelineSeparator>
      <TimelineContent>{`${index + 1}. ${feature_name}`}</TimelineContent>
    </TimelineItem>
  );
}
