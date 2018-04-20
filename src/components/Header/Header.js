import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import logo from './logo.svg';

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <Navbar collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">
                        {/* <img src={logo} className="App-logo" alt="logo" /> */}
                        LongHash Hackathon</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem eventKey={1} href="leaderboard">
                            投票
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            Link
                        </NavItem>
                        </Nav>
                        <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            {this.props.networkId}
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            {this.props.coinbase}
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
                </Navbar>
          </header>
        );
    }
}

export default connect(
    state => ({
        online: state.online,
        networkId: state.blockchain.networkId,
        coinbase: state.blockchain.coinbase
    })
)(Header);