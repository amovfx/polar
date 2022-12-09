import React, { useState } from 'react';
import { useAsync } from 'react-async-hook';
import { usePrefixedTranslation } from 'hooks';
import { encode } from 'lndconnect';
import { TaroNode } from 'shared/types';
import { useStoreActions } from 'store';
import { read } from 'utils/files';
import { ellipseInner } from 'utils/strings';
import CopyIcon from 'components/common/CopyIcon';
import DetailsList, { DetailValues } from 'components/common/DetailsList';

interface Props {
  node: TaroNode;
}

const TaroConnect: React.FC<Props> = ({ node }) => {
  const { l } = usePrefixedTranslation('cmps.designer.taro.connect.TaroConnect');
  const { notify } = useStoreActions(s => s.app);
  const [urls, setUrls] = useState<Record<string, string>>({});
  useAsync(async () => {
    const { host, tlsCert, adminMacaroon } = node.lnd;
    try {
      //lnd host data
      const cert = await read(tlsCert);
      const adminMac = await read(adminMacaroon, 'hex');

      const values: Record<string, string> = {};
      values[l('restUrl')] = encode({ host: host, cert, macaroon: adminMac });
      values[l('grpcUrl')] = encode({ host: host, cert, macaroon: adminMac });

      setUrls(values);
    } catch (error: any) {
      notify({ message: l('encodeError'), error });
    }
  }, [node.paths, node.status]);

  const details: DetailValues = Object.entries(urls).map(([label, val]) => {
    return {
      label: label,
      value: <CopyIcon label={label} value={val} text={ellipseInner(val, 34, 1)} />,
    };
  });

  return <DetailsList details={details} oneCol />;
};

export default TaroConnect;
