import * as types from '../actions/user-types';

export function setAccount(account) {
    return {
        type: types.SET_ACCOUNT,
        account
    }
}

export function setPoints(points) {
    return {
        type: types.SET_POINTS,
        points
    }
}

export function setProfile(profile) {
    return {
        type: types.SET_PROFILE,
        profile
    }
}
