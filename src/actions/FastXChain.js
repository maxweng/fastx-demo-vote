import * as types from './FastXChain-types';

export function setBalances(balances) {
  return {
    type: types.SET_BALANCES,
    balances: balances
  };
}