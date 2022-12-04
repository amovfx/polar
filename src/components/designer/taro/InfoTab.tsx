import React from 'react';
import { Alert, Tooltip } from 'antd';
import { usePrefixedTranslation } from 'hooks';
import { TaroNode, Status } from 'shared/types';
import { useStoreState } from 'store';
import { dockerConfigs } from 'utils/constants';
import { ellipseInner } from 'utils/strings';
import { format } from 'utils/units';
import { StatusBadge } from 'components/common';
import CopyIcon from 'components/common/CopyIcon';
import DetailsList, { DetailValues } from 'components/common/DetailsList';

interface Props {
  node: TaroNode;
}

const InfoTab: React.FC<Props> = ({ node }) => {
  const { l } = usePrefixedTranslation('cmps.designer.taro.InfoTab');
  const { nodes } = useStoreState(s => s.taro);
  const details: DetailValues = [
    { label: l('nodeType'), value: node.type },
    { label: l('implementation'), value: dockerConfigs[node.implementation]?.name },
    { label: l('version'), value: node.docker.image ? 'custom' : `v${node.version}` },
    {
      label: l('status'),
      value: (
        <StatusBadge
          status={node.status}
          text={l(`enums.status.${Status[node.status]}`)}
        />
      ),
    },
  ];
  if (node.docker.image) {
    details.splice(3, 0, { label: l('customImage'), value: node.docker.image });
  }
  const showSyncWarning = false;
  const nodeState = nodes[node.name];

  return (
    <>
      {showSyncWarning && (
        <Alert type="warning" message={l('syncWarning')} closable={false} showIcon />
      )}
      {node.status === Status.Error && node.errorMsg && (
        <Alert
          type="error"
          message={l('startError', { implementation: node.implementation })}
          description={node.errorMsg}
          closable={false}
          showIcon
        />
      )}
      <DetailsList details={details} />
    </>
  );
};
export default InfoTab;
