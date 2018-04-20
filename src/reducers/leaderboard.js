import * as types from '../actions/leaderboard-types';

const initialState = {
    projects: [],
    isShow: false
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case types.SET_PROJECTS:
            return {
                ...state,
                projects: action.projects
            }
        case types.SET_SHOW_MODEL:
            return {
                ...state,
                isShow: action.isShow
            }
        default:
            return state;
    }
};