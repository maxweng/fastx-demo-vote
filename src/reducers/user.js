import * as types from '../actions/user-types';

const initialState = {
    account: '',
    points: 0,
    profile: {}
};

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case types.SET_ACCOUNT:
            return {
                ...state,
                account: action.account
            };
        case types.SET_POINTS:
            return {
                ...state,
                points: action.points               
            };
        case types.SET_PROFILE:
            return {
                ...state,
                profile: action.profile               
            };
        default:
            return state;
    }
}