import * as types from '../actions/leaderboard-types';

const initialState = {
    projects: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.SET_PROJECTS:
            return {
                ...state,
                projects: action.projects
            }
        default:
            return state;
    }
};