import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import async from 'async';
import { AddressBlock } from '../../components';
import FontAwesome from 'react-fontawesome';
import * as blockchainActions from '../../actions/blockchain';
import * as metaCoinActions from '../../actions/metaCoin';
import getWeb3 from '../../utils/getWeb3';
import contractAddress from '../../contracts/addresses.json';
import './FastXToken.css';

const web3 = getWeb3();

let FastXTokenContract;
export class FastXToken extends Component {
  componentDidMount() {
    // Get and set coinbase if it hasn't been set yet
    if (this.props.coinbase.length === 0) {
      web3.eth.getCoinbase().then(coinbase => {
        this.props.setCoinbase(coinbase);
        // Set default address
        web3.eth.defaultAccount = coinbase;
        this.initWeb3Subscriptions();
      });
    } else {
      this.initWeb3Subscriptions();
    }
  }

  onMessageReceived = data => {
    const messages = this.state.messages;
    messages.push(data);
    this.setState({ messages });
  };

  updateWeb3Info = () => {
    const { coinbase, setMetaBalance } = this.props;

    // Get and set user FastXToken balance
    FastXTokenContract.methods.getBalance(coinbase).call({
      from: coinbase
    }).then(result => {
      setMetaBalance(result);
    }, err => {
      console.error(err);
    });

    // Also load past transactions array
    this.loadPastTransactionsAndAddresses();
  }

  initWeb3Subscriptions = () => {
    const { coinbase, loadContractABI } = this.props;

    loadContractABI('FastXToken').then(result => {
      // Create an instance of the contract
      FastXTokenContract = new web3.eth.Contract(
        result.abi,
        contractAddress.FastXToken,
        {
          from: coinbase,
          // gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
        }
      );

      web3.eth.subscribe('newBlockHeaders', err => {
        if (err) {
          console.error('There was an error subscribing to the block headers:');
          console.error(err);
        }
        this.updateWeb3Info();
      });

      // Initial call
      this.updateWeb3Info();
    });
  }

  loadPastTransactionsAndAddresses = () => {
    const { setPastTransactions, setUserBalances } = this.props;
    return async.waterfall([
      callback => {
        // First we obtain all of the past transactions events
        FastXTokenContract.getPastEvents('Transfer', {
          fromBlock: 0,
          toBlock: 'latest'
        }, (err, results) => callback(err, results));
      },
      (results, callback) => {
        // Save past transactions to redux
        setPastTransactions(results);
        // Check if the results were empty (in which case the loop won't run)
        if (results.length === 0) {
          return callback(null, {});
        }
        // We also want to create an object of balances and their corresponding
        // balances.
        // First we iterate over all transactions and collect the unique addresses
        const userBalances = {};
        for (let inc = 0; inc < results.length; inc += 1) {
          const txn = results[inc];
          userBalances[txn.returnValues.from.toLowerCase()] = 0;
          userBalances[txn.returnValues.to.toLowerCase()] = 0;
          if (inc === results.length - 1) {
            return callback(null, userBalances);
          }
        }
      },
      (userBalances, callback) => {
        const addresses = Object.keys(userBalances);
        // Check if addresses is empty (in which case the loop won't run)
        if (addresses.length === 0) {
          return callback(null, {});
        }
        console.log(FastXTokenContract);
        // Now we iterate over each address and obtain each one's balance
        return async.eachSeries(addresses, (address, addrCallback) => { // Async loop
          setTimeout(() => (/* Trick to prevent strange bluebird.js warning:
                               "a promise was created in a handler but was
                               not returned from it" */
            FastXTokenContract.methods.balanceOf(address).call().then(bal => {
              userBalances[address] = bal;
              return addrCallback();
            }, err => addrCallback(err))
          ), 1)
        }, err => callback(err, userBalances));
      }
    ], (err, userBalances) => {
      if (err) {
        throw err;
      }
      setUserBalances(userBalances); // Now we update the redux userBalances
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { amountToSend, addressToSend, coinbase } = this.props;

    FastXTokenContract.methods.transfer(addressToSend, amountToSend).send({
      from: coinbase
    }).then(() => {}, err => {
      console.error('There was an error sending the transaction!');
      console.error(err);
    });
  };

  render() {
    const {
      coinbase,
      metaBalance,
      amountToSend,
      setAmountToSend,
      addressToSend,
      setAddressToSend,
      pastTransactions,
      userBalances
    } = this.props;

    return (
      <div className='FastXToken-wrap'>
        <h1>FastXToken (MTC)</h1>

        <div>
          <h4>You:</h4>
          <ul><li>
            <AddressBlock
              address={coinbase.toLowerCase()}
              balance={metaBalance}
              currency={'MTC'}
            />
          </li></ul>
          {(pastTransactions.length > 0) && <h4>Transactions:</h4>}
          <ul>
            {pastTransactions.map(txn =>
              (<li key={`metacoin.txn.${txn.id}`}>
                <div className='FastXToken-txnAddress'>
                  <AddressBlock
                    address={txn.returnValues.from.toLowerCase()}
                    noBalance
                  />
                </div>
                <div className='FastXToken-txnAmountWrap'>
                  <FontAwesome
                    name="arrow-circle-right"
                    size="2x"
                  />
                  <div className='FastXToken-txnValue'>
                    {txn.returnValues._value} <span>MTC</span>
                  </div>
                </div>
                <div className='FastXToken-txnAddress'>
                  <AddressBlock
                    address={txn.returnValues.to.toLowerCase()}
                    noBalance
                  />
                </div>
              </li>)
            )}
          </ul>
          <h4>Accounts:</h4>
          <ul>
            {Object.keys(userBalances).map(address =>
              (<li key={`metacoin.bals.${address}`}>
                <AddressBlock
                  address={address.toLowerCase()}
                  balance={userBalances[address]}
                  currency={'MTC'}
                />
              </li>)
            )}
          </ul>
          <h4>Send:</h4>
          <form onSubmit={this.handleSubmit}>
            <ul>
              <li>
                <input
                  type="text"
                  placeholder="0x000..."
                  value={addressToSend}
                  onChange={event => {
                    setAddressToSend(event.target.value);
                  }}
                />
              </li>
              <li>
                <input
                  type="text"
                  placeholder="0.00"
                  value={amountToSend}
                  onChange={event => {
                    setAmountToSend(event.target.value);
                  }}
                />
              </li>
              <li>
                <button onClick={this.handleSubmit}>
                  Send
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
    );
  }
}

FastXToken.propTypes = {
  coinbase: PropTypes.string.isRequired,
  setCoinbase: PropTypes.func.isRequired,
  loadContractABI: PropTypes.func.isRequired,
  setAmountToSend: PropTypes.func.isRequired,
  setAddressToSend: PropTypes.func.isRequired,
  amountToSend: PropTypes.string.isRequired,
  addressToSend: PropTypes.string.isRequired,
  metaBalance: PropTypes.string.isRequired,
  setMetaBalance: PropTypes.func.isRequired,
  pastTransactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPastTransactions: PropTypes.func.isRequired,
  userBalances: PropTypes.objectOf(PropTypes.string).isRequired,
  setUserBalances: PropTypes.func.isRequired
};

export default connect(
  state => ({
    coinbase: state.blockchain.coinbase,
    amountToSend: state.metaCoin.amountToSend,
    addressToSend: state.metaCoin.addressToSend,
    metaBalance: state.metaCoin.metaBalance,
    pastTransactions: state.metaCoin.pastTransactions,
    userBalances: state.metaCoin.userBalances
  }),
  {
    ...blockchainActions,
    ...metaCoinActions
  }
  // dispatch => ({
  //   setSelectedCountry: bindActionCreators(countriesAndVillagesActions.setSelectedCountry, dispatch)
  // })
)(FastXToken);
