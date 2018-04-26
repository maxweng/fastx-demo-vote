import React, { Component } from 'react';
import axios from 'axios';

import getWeb3 from '../../utils/getWeb3';
import { host, fastXRpc, goldContractAddress } from '../../config';

const web3 = getWeb3();
const rlp = require('rlp');

export default class FXTransaction extends Component {
    getUTXO(params) {
        return axios.post(fastXRpc, {
            "method": "get_utxo",
            "params": params,
            "jsonrpc": "2.0",
            "id": 0
        })
    }

    createTransaction(blk, txindex, oindex, contract, amountSend, amount, owner1, owner2) {
        let blk_num = blk;
        let tx_index = txindex;
        let o_index = oindex;
        let amSend = amountSend;
        let amRemain = amount - amountSend;
    
        if (amSend <= 0) {
          throw new Error();
        }
        if (amRemain < 0) {
          throw new Error();
        }
    
        let newowner1, newowner2;
    
        if (!owner1) {
          throw new Error();
        } else {
          newowner1 = this.normalize_address(owner1);
        }
        if (amSend > 0 && amRemain > 0 && !owner2 ) {
          // there's some change, but no owner2 is specified
          throw new Error();
        } else if (amRemain > 0) {
          newowner2 = this.normalize_address(owner2);
        } else {
            owner2 = 0;
            newowner2 = this.normalize_address('0x0');
        }
    
        let token_contract = new Buffer(goldContractAddress, 'hex');
    
        return [blk_num,tx_index,o_index,0,0,0,
          newowner1, token_contract, amSend, 0, 
          newowner2, owner2 ? token_contract:this.normalize_address('0x0'), amRemain, 0];
    }

    hashTransaction(tx_raw) {
        let tx_encoded = rlp.encode(tx_raw);
        console.log('tx encoded');
        console.log(tx_encoded.toString('hex'));
        return web3.utils.sha3(tx_encoded);
    }

    sendTransaction(params) {
        return axios.post(fastXRpc, {
            "method": "eth_sendRawTransaction",
            "params": params,
            "jsonrpc": "2.0",
            "id": 0
        })
    }
    
    normalize_address(address) {
        if (!address) {
            throw new Error();
        }
        if ('0x' == address.substr(0,2)) {
            address = address.substr(2);
        }
        if (address == 0) address = '0'.repeat(40);
        return new Buffer(address, 'hex');
    }

    render() {
        return this.props.children;
    }
}
