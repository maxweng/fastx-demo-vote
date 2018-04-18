import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import * as blockchainActions from '../../actions/blockchain';
import * as userActions from '../../actions/user';
import { Header } from '../../components';
import getWeb3 from '../../utils/getWeb3';
import { host } from '../../config';
import './App.css';

const web3 = getWeb3();

class App extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  /// TODO: Get the user profile from the game server.
  loadUserProfile(address) {
    console.log('loading user profile for: '+address);
    return new Promise((resolve, reject) => {
      axios({
          method: 'get',
          url: host+'/api/user',
          params: {
             coinbase_address:address
          }
        })
      .then((res) => {
        resolve(res);
      })
      
    });
  }

  loadWeb3Info() {
    // Get and then set coinbase address
    return web3.eth.net.getNetworkType().then(networkId => {
      this.props.setNetworkId(networkId);
      return web3.eth.getCoinbase().then(coinbase => {

        this.props.setAccount(coinbase);

        this.props.setCoinbase(coinbase);
        // Set default address
        web3.eth.defaultAccount = coinbase;

        // Get and then set default account balance
        return web3.eth.getBalance(coinbase, () => {}).then(balance => {
          this.props.setBalance(balance);
        });
      });
    });
  }

  componentDidMount() {
    this.loadWeb3Info().then( () => {
      let userAddress = this.props.coinbase;
      // load the user info based on the wallet address
      this.loadUserProfile(userAddress).then( profile => {
        this.props.setProfile(profile);
      });
    });

  }

  render() {
    const { children } = this.props;

    return (
      <div className="App">
        <Header />
        <div className="App-content">
          {children}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    online: state.online,
    networkId: state.blockchain.networkId,
    coinbase: state.blockchain.coinbase,
    balance: state.blockchain.balance,
    latestBlockNumber: state.blockchain.latestBlockNumber,
    latestBlockTimestamp: state.blockchain.latestBlockTimestamp,
    latestBlockHash: state.blockchain.latestBlockHash,
    user: state.user
  }),
  {
    ...blockchainActions,
    ...userActions
  }
)(App);
