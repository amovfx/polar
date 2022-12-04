import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from 'easy-peasy';
import { TaroNode, Status } from 'shared/types';
import * as PLN from 'lib/lightning/types';
import { Network, StoreInjections } from 'types';
import { delay } from 'utils/async';
import { BLOCKS_TIL_CONFIRMED } from 'utils/constants';
import { fromSatsNumeric } from 'utils/units';
import { RootModel } from './';

export interface TaroNodeMapping {
  [key: string]: TaroNodeModel;
}

export interface TaroNodeModel {
  assets: string;
  name: string;
}

export interface TaroModel {
  nodes: TaroNodeMapping;
  name: string;
}

const taromodel: TaroModel = {
  nodes: {},
  name: '',
};

export default taromodel;
