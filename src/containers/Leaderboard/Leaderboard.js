import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Table} from 'react-bootstrap';
import * as leaderboardActions from '../../actions/leaderboard';
import * as userActions from '../../actions/leaderboard';

import './Leaderboard.css';

export class Leaderboard extends Component {
    loadProjects() {
        let address = this.props.user.account;
        console.log('loading projects for: '+address);
        return new Promise((resolve, reject) => {
            resolve([
                {
                    name: 'Proj One',
                    votes: 10
                },
                {
                    name: 'Project Two',
                    votes: 13
                }
            ]);
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
                <td>{project.name}</td>
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