import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Table} from 'react-bootstrap';
import axios from 'axios';
import io    from 'socket.io-client';

import * as leaderboardActions from '../../actions/leaderboard';
import * as fastXChainActions from '../../actions/FastXChain';
import { host, fastXRpc, goldContractAddress } from '../../config';
import './Leaderboard.css';
import {store} from '../../store'

let Button = require('react-bootstrap').Button;
let Modal = require('react-bootstrap').Modal;
let userAddress;
let socket = io(host, { forceNew: true });

let makeFastXChainRpcRequest = (params) => {
    return axios.post(fastXRpc, {
        "method": "get_balance",
        "params": params,
        "jsonrpc": "2.0",
        "id": 0
    })
}

class MyLargeModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        console.log(this.props)
    }

    updateName(event) {
        this.state.name = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        event.preventDefault();
        var name = this.state.name;

        if (!name) {
            this.setState({
                alertInfo: "请输入内容"
            })
            return;
        }

        axios({
          method: 'post',
          url: host+'/api/polls',
          data: {
            'name':name,
            'coinbase_address':userAddress
          }
        })
        .then((res) => {
            this.props.onHide();
            this.props.onLoad();
        })
    }

  render() {
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">创建项目</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea style={{width:'100%',height:'200px'}} onChange={this.updateName.bind(this)}></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
          <Button onClick={this.props.onHide}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};

export class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: ''
        }
    }

    loadProjects() {
        const {setProjects} = this.props;
        let address = this.props.user.account;
        console.log('loading projects for: '+address);
        axios({
          method: 'get',
          url: host+'/api/polls',
          params: {'limit':999}
        })
        .then((res) => {
            setProjects(res['data']);
        })

        socket.on('vote', function(data) {
            if(data['detail']){
                alert(data['detail']);
            }else{
                setProjects(data);
            }
        });
    };
    
    loadBalance() {
        const {setBalances} = this.props;
        let address = this.props.user.account;
        console.log('loading balances for: '+address);
        makeFastXChainRpcRequest([address, "latest"])
        .then((res) => {
            setBalances(res.data.result);
        })
    }
    
    needMoreGold() {
        const self = this;
        let address = this.props.user.account;
        axios.post(host+'/api/golds', {
          address: address
        })
        .then((res) => {
            self.loadBalance();
        })
    }

    componentDidMount() {
        let loadProjects = this.loadProjects.bind(this);
        let loadBalance = this.loadBalance.bind(this);

        const unsubscribe = store.subscribe(function(){
            if(store.getState().user.account){
                userAddress = store.getState().user.account;
                loadProjects();
                unsubscribe();
            }
        })  
    };

    vote(pollId) {
        let key = this.state.key;
        if(key == null || key == ""){
            alert("Set key first");
            return;
        }
        let voteObj = { id: pollId, coinbase_address: userAddress, key:key, gold: 1};
        socket.emit('send:vote', voteObj);
    }

    showModel() {
        const {setShowModel} = this.props;
        setShowModel(!this.props.isShow);
    }

    render() {
        const self = this;
        const {projects, fastxchain} = this.props;
        const balances = fastxchain.balances;
        let gold_balance = 0;
        if(balances.FT){
            balances.FT.forEach((ft) => {
                if(ft[0].toLowerCase() == goldContractAddress.toLowerCase()){
                    gold_balance = ft[1];
                }
            });
        }
        const elProjectList = projects.map((project, i) => {
            let votes = 0;
            for(let i in project.choices){
                votes += parseFloat(project.choices[i]['votes'] || 0);
            }

            return (
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{project.name}</td>
                    <td>{votes}</td>
                    <td><Button bsSize="small" onClick={this.vote.bind(this, project._id)}>Vote</Button></td>
                </tr>
            );
        });
        
        if(window.loadFastXTokenBalance == null){
            window.loadFastXTokenBalance = ()=>{
                window.setTimeout(()=>{
                    self.loadBalance();
                    window.loadFastXTokenBalance()
                }, 1000);
            }
            window.loadFastXTokenBalance();
        }
        
        let lgClose = () => {
            this.showModel();
        }
        let load = () => {
            this.loadProjects();
        }
        return (
            <div className='Leaderboard-wrap container'>
                <div>
                    <span>Gold Balance: {gold_balance}</span>
                    <Button bsStyle="primary" bsSize="small" onClick={this.needMoreGold.bind(this)} style={{margin: "2px 10px"}}>I Need More Gold</Button>
                    <Button bsSize="small" onClick={()=>{
                        var key = prompt("Set your key, FOR TEST USE ONLY!");
                        self.setState({
                            ...self.state,
                            key: key,
                        });
                    }} style={{margin: "2px 10px"}}>Set Key ( FOR TEST USE ONLY )</Button>
                </div>
                <br />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Votes</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elProjectList}
                    </tbody>
                </Table>
                <Button bsStyle="primary" bsSize="small" onClick={this.showModel.bind(this)}>Create Project</Button>
                <MyLargeModal show={this.props.isShow} onLoad={load} onHide={lgClose} />
            </div>
        );
    }
}

Leaderboard.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default connect(
    state => ({
        projects: state.leaderboard.projects,
        isShow: state.leaderboard.isShow,
        user: state.user,
        fastxchain: state.fastxchain,
    }),
    {
      ...leaderboardActions,
      ...fastXChainActions
    }
  )(Leaderboard);