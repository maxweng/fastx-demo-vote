import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Table} from 'react-bootstrap';
import axios from 'axios';
import io    from 'socket.io-client';

import * as leaderboardActions from '../../actions/leaderboard';
import * as userActions from '../../actions/leaderboard';
import { host } from '../../config';
import './Leaderboard.css';

let socket = io(host, { forceNew: true });

export class Leaderboard extends Component {
    loadProjects() {
        let address = this.props.user.account;
        console.log('loading projects for: '+address);
        //这里是测试，之后需要修改
        return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: host+'/api/polls/5ad73213c979e45789431322',
          params: {
             
          }
        })
        .then((res) => {
            resolve(res.data.choices)
        })
            
        });
    };

    componentDidMount() {
        const {setProjects} = this.props;
        this.loadProjects().then( projects => {
            setProjects(projects);
        })

        socket.on('vote', function(data) {
            if(data['detail']){
                alert(data['detail']);
            }else{
                setProjects(data.choices);
            }
        });
    };

    vote(choiceId) {
        let pollId = '5ad73213c979e45789431322';
        let coinbase_address = "0x7a0c61edd8b5c0c5c1437aeb571d7ddbf8022be4";
        let gold = 1;
        let voteObj = { id: pollId, choice: choiceId, coinbase_address: coinbase_address, gold: gold};
        
        socket.emit('send:vote', voteObj);
    }

    render() {
        const {projects} = this.props;
        const elProjectList = projects.map((project, i) => {
            let votes = 0;
            for(let i in project.votes){
                votes += parseFloat(project.votes[i]['votes'] || 0);
            }

            return (
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{project.text}</td>
                    <td>{votes}</td>
                    <td onClick={this.vote.bind(this, project._id)}>投票</td>
                </tr>
            );
        });
        return (
            <div className='Leaderboard-wrap container'>
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
        user: state.user
    }),
    {
      ...leaderboardActions,
      ...userActions
    }
    // dispatch => ({
    //   setSelectedCountry: bindActionCreators(countriesAndVillagesActions.setSelectedCountry, dispatch)
    // })
  )(Leaderboard);