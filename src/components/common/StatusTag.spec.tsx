import React from 'react';
import { Status } from 'shared/types';
import { getNetwork, renderWithProviders } from 'utils/tests';
import StatusTag from './StatusTag';

describe('StatusTag Component', () => {
  const renderComponent = (status: Status) => {
    const network = getNetwork(0, 'test network', status);
    network.externalNetworkName = 'test-external-network';
    const initialState = {
      network: {
        networks: [network],
      },
    };
    const result = renderWithProviders(<StatusTag networkId={0} />, { initialState });
    return {
      ...result,
      dot: result.container.querySelector('.ant-badge span:first-child'),
    };
  };

  it('should render the Error status', () => {
    const docker_network_name = 'test-external-network';
    const { getByText } = renderComponent(Status.Started);
    expect(getByText(`External: ${docker_network_name}`)).toBeInTheDocument();
  });
});
