import React from 'react';
import { Status } from 'shared/types';
import { initChartFromNetwork } from 'utils/chart';
import { getNetwork, renderWithProviders } from 'utils/tests';
import StatusTag from './StatusTag';

describe('StatusBadge Component', () => {
  const renderComponent = (status: Status) => {
    const network = getNetwork(0, 'test network', status);
    network.status = status;
    const initialState = {
      network: {
        networks: [network],
      },
      designer: {
        activeId: network.id,
        allCharts: {
          1: initChartFromNetwork(network),
        },
      },
    };

    return renderWithProviders(<StatusTag networkId={0} />, { initialState });
  };

  it('should render the Starting status', () => {
    const { getByText } = renderComponent(Status.Starting);
    expect(getByText('Starting')).toBeInTheDocument();
  });

  it('should render the Started status', () => {
    const { getByText } = renderComponent(Status.Started);
    expect(getByText('Started')).toBeInTheDocument();
  });

  it('should render the Stopping status', () => {
    const { getByText } = renderComponent(Status.Stopping);
    expect(getByText('Stopping')).toBeInTheDocument();
  });

  it('should render the Stopped status', () => {
    const { getByText } = renderComponent(Status.Stopped);
    expect(getByText('Stopped')).toBeInTheDocument();
  });

  it('should render the Error status', () => {
    const { getByText } = renderComponent(Status.Error);
    expect(getByText('Error')).toBeInTheDocument();
  });
});
