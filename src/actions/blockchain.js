import * as types from './blockchain-types';
import path from 'path';
import contractToken from '../contracts/FastXToken.json';

export function setCoinbase(coinbase) {
  return {
    type: types.SET_COINBASE,
    coinbase
  };
}

export function setBalance(balance) {
  return {
    type: types.SET_BALANCE,
    balance
  };
}

export function setLatestBlockNumber(latestBlockNumber) {
  return {
    type: types.SET_LATEST_BLOCK_NUMBER,
    latestBlockNumber
  };
}

export function setLatestBlockTimestamp(latestBlockTimestamp) {
  return {
    type: types.SET_LATEST_BLOCK_TIMESTAMP,
    latestBlockTimestamp
  };
}

export function setLatestBlockHash(latestBlockHash) {
  return {
    type: types.SET_LATEST_BLOCK_HASH,
    latestBlockHash
  };
}

export function loadContractABI(contractName) {
  return function(dispatch) {
    return new Promise((resolve, reject) => {
      // if (typeof req.url === 'undefined' ||
      //     req.url.split('/').length < 3) {
      //   return reject(new Error('No contractName provided in request URL!'));
      // }
      // const contractName = req.url.split('/')[2];
      const filename = `${contractName}.json`;
      const JSONObject = contractToken;
      return resolve({
        abi: JSONObject.abi
      });
      });
  }
  // return {

    // types: [types.LOAD_CONTRACT_ABI, types.LOAD_CONTRACT_ABI_SUCCESS, types.LOAD_CONTRACT_ABI_FAIL],
    // type: types.LOAD_CONTRACT_ABI,

    // promise: ({ client }) =>
    //   client.get(`/loadContractABI/${contractName}`)
  // };
}
