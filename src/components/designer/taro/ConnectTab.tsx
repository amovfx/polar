import React, { ReactNode, useMemo, useState } from 'react';
import { BookOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Radio, Tooltip } from 'antd';
import { usePrefixedTranslation } from 'hooks';
import { Status, TaroNode } from 'shared/types';
import { useStoreActions, useStoreState } from 'store';
import { eclairCredentials } from 'utils/constants';
import { ellipseInner } from 'utils/strings';
import CopyIcon from 'components/common/CopyIcon';
import DetailsList, { DetailValues } from 'components/common/DetailsList';
//import { BasicAuth, EncodedStrings, FilePaths, LndConnect } from './connect';

const Styled = {
  RadioGroup: styled(Radio.Group)`
    display: flex;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 20px;
  `,
  Link: styled.a`
    margin-left: 10px;
    color: inherit;
    &:hover {
      opacity: 1;
    }
  `,
  BookIcon: styled(BookOutlined)`
    margin-left: 5px;
    color: #aaa;
  `,
};

export interface ConnectionInfo {
  restUrl: string;
  grpcUrl?: string;
  grpcDocsUrl?: string;
  credentials: {
    admin?: string;
    cert?: string;
  };
  lnd: {
    adminMacaroon: string;
    tlsCert: string;
  };
}

interface Props {
  node: TaroNode;
}

const ConnectTab: React.FC<Props> = ({ node }) => {
  const { l } = usePrefixedTranslation('cmps.designer.taro.TaroDetails.connect');
  const nodeState = useStoreState(s => s.taro.nodes[node.name]);

  const info = useMemo((): ConnectionInfo => {
    if (node.status === Status.Started && node.implementation === 'taro') {
      const taronode = node as TaroNode;
      return {
        restUrl: `https://127.0.0.1:${taronode.ports.rest}`,
        grpcUrl: `https://127.0.0.1:${taronode.ports.rpc}`,
        grpcDocsUrl: 'https://lightning.engineering/taroapi/#taro-grpc-api-reference',
        credentials: {
          admin: taronode.paths.macaroon,
          cert: taronode.paths.tlsCert,
        },
        lnd: {
          adminMacaroon: '',
          tlsCert: '',
        },
      };
    }
    return {
      restUrl: '',
      grpcUrl: '',
      grpcDocsUrl: '',
      credentials: {},
      lnd: {},
    } as ConnectionInfo;
  }, [node]);

  const { restUrl, grpcUrl } = info;
  const hosts: DetailValues = [
    [l('grpcHost'), grpcUrl, grpcUrl],
    [l('restHost'), restUrl, restUrl],
  ]
    .filter(h => !!h[1]) // exclude empty values
    .map(([label, value, text]) => ({
      label,
      value: <CopyIcon label={label} value={value as string} text={text} />,
    }));
  return (
    <>
      <DetailsList details={hosts} />
    </>
  );
};

export default ConnectTab;
