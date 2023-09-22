import React from 'react';
import { Status } from 'shared/types';
import { getNetwork, injections, renderWithProviders } from 'utils/tests';
import StatusTag from './StatusTag';

const dockerServiceMock = injections.dockerService as jest.Mocked<
  typeof injections.dockerService
>;

describe('StatusTag Component', () => {
  const renderComponent = (status: Status, externalNetworkName: string) => {
    const network = getNetwork(0, 'test network', status);
    network.externalNetworkName = externalNetworkName;
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

  it('should render the Error status', async () => {
    dockerServiceMock.getDockerExternalNetworks.mockResolvedValue([
      'test-network-1',
      'test-network-2',
    ]);
    const docker_network_name = 'test-network-1';

    const { findByText } = renderComponent(Status.Started, docker_network_name);
    const textElement = await findByText(`External: ${docker_network_name}`);
    expect(textElement).toBeInTheDocument();
  });
  it('should render the Error status', async () => {
    dockerServiceMock.getDockerExternalNetworks.mockResolvedValue([
      'test-network-1',
      'test-network-2',
    ]);
    const docker_network_name = 'test-network-3';

    const { findByText } = renderComponent(Status.Started, docker_network_name);
    const textElement = await findByText(
      `External Docker Network: ${docker_network_name} does not exist`,
    );
    expect(textElement).toBeInTheDocument();
  });
});
