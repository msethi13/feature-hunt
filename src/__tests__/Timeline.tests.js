import React from 'react';
import {render, screen} from '@testing-library/react';
import ProductTimeline from '../Components/Timeline';

describe('ProductTimeline', () => {
  it('renders the feature_name correctly', () => {
    const featureName = 'Sample Feature';
    const index = 0;
    render(<ProductTimeline feature_name={featureName} index={index} />);

    // Assert that the feature_name is rendered
    const featureNameElement = screen.getByText('1. Sample Feature');
    expect(featureNameElement).toBeInTheDocument();

    // Assert that the TimelineConnector is rendered
    const connectorElement = screen.getByTestId('timeline-connector');
    expect(connectorElement).toBeInTheDocument();

    // Assert that the TimelineDot is rendered
    const dotElement = screen.getByTestId('timeline-dot');
    expect(dotElement).toBeInTheDocument();
  });
});
