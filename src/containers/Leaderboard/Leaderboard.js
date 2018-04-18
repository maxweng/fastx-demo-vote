import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Table} from 'react-bootstrap';
import axios from 'axios';

import * as leaderboardActions from '../../actions/leaderboard';
import * as userActions from '../../actions/leaderboard';
import { host } from '../../config';
import './Leaderboard.css';

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
            console.log(res)
            resolve(res.data.choices)
        })
            
        });
    };

    componentDidMount() {

        const {setProjects} = this.props;
        this.loadProjects().then( projects => {
            console.log(projects);
            setProjects(projects);
        })
    };

    render() {
        const {projects} = this.props;
        const elProjectList = projects.map((project, i) => {
            return (
                <tr key={i}>
                <td>{i+1}</td>
                <td>{project.text}</td>
                <td>{project.votes}</td>
                <td>@mdo</td>
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