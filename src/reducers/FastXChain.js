import * as types from '../actions/FastXChain-types';

const initialState = {
    balances: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_BALANCES:
      return {
        ...state,
        balances: action.balances
      };
    default:
      return state;
  }
}
