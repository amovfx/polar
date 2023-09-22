import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Tag } from 'antd';
import { useTheme } from 'hooks/useTheme';
import { Status } from 'shared/types';
import { useStoreActions, useStoreState } from 'store';

export interface StatusTagProps {
  networkId: number;
}

const StatusTag: React.FC<StatusTagProps> = ({ networkId }) => {
  const { t } = useTranslation();

  const { networks } = useStoreState(s => s.network);
  const network = networks.find(n => n.id === networkId);
  const { getExternalDockerNetworks } = useStoreActions(s => s.network);
  const [dockerNetworks, setDockerNetworks] = useState<string[]>([]);

  const { statusTag } = useTheme();

  const statusColors = {
    [Status.Starting]: 'blue',
    [Status.Started]: 'green',
    [Status.Stopping]: 'blue',
    [Status.Stopped]: statusTag.stopped,
    [Status.Error]: 'red',
  };

  useEffect(() => {
    (async () => {
      const networks = await getExternalDockerNetworks();
      setDockerNetworks(networks);
    })();
  }, [network?.externalNetworkName]);

  const cmp =
    network?.externalNetworkName &&
    dockerNetworks.includes(network?.externalNetworkName) ? (
      <Tag color="blue">{`External: ${network.externalNetworkName}`}</Tag>
    ) : (
      <Tag color="error">{`External Docker Network: ${network?.externalNetworkName} does not exist`}</Tag>
    );

  return (
    <Row>
      {network && (
        <Tag color={statusColors[network.status]}>
          {t(`enums.status.${Status[network.status]}`)}
        </Tag>
      )}
      {cmp}
    </Row>
  );
};

export default StatusTag;
