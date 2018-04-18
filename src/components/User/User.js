import React, { Component } from 'react';

class User extends Component {
    /// TODO: Get the user profile from the game server.
    loadUserProfile(address) {
        console.log('loading user profile for: '+address);
        return new Promise((resolve, reject) => {
            resolve({
                name: 'Max'
            });
        });
    }
}

export default User;