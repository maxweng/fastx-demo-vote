import * as types from './leaderboard-types';

export function setProjects(projects) {
    return {
      type: types.SET_PROJECTS,
      projects
    };
  }

export function setShowModel(isShow) {
	return {
	  type: types.SET_SHOW_MODEL,
	  isShow
	};
}