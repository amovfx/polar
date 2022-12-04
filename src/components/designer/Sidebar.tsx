import React, { useMemo } from 'react';
import { IChart } from '@mrblenny/react-flow-chart';
import { LightningNode, TaroNode, BitcoinNode } from 'shared/types';
import { Network } from 'types';
import BitcoindDetails from './bitcoind/BitcoindDetails';
import DefaultSidebar from './default/DefaultSidebar';
import LightningDetails from './lightning/LightningDetails';
import TaroDetails from './taro/TaroDetails';
import LinkDetails from './link/LinkDetails';

interface Props {
  network: Network;
  chart: IChart;
}

const Sidebar: React.FC<Props> = ({ network, chart }) => {
  const cmp = useMemo(() => {
    const { id, type } = chart.selected;

    if (type === 'node') {
      const { bitcoin, lightning, taro } = network.nodes;
      const node =
        bitcoin.find(n => n.name === id) ||
        lightning.find(n => n.name === id) ||
        taro.find(n => n.name === id);
      if (node && node.implementation === 'bitcoind') {
        return <BitcoindDetails node={node as BitcoinNode} />;
      } else if (node && node.type === 'lightning') {
        return <LightningDetails node={node as LightningNode} />;
      } else if (node && node.type === 'taro') {
        return <TaroDetails node={node as TaroNode} />;
      }
    } else if (type === 'link' && id) {
      const link = chart.links[id];
      return <LinkDetails link={link} network={network} />;
    }

    return <DefaultSidebar />;
  }, [network, chart.selected, chart.links]);

  return <>{cmp}</>;
};

export default Sidebar;
