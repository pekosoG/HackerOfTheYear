import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class FormUserName extends Component {
    state = {
        username: '' 
    }
    componentDidMount = () => {
        const { gameStartStatus, gameUpdateData } = this.props;
        this.socket = socketIOClient(process.env.REACT_APP_SOCKET_BACKEND);
        this.socket.on('gameStart', data => {
            console.log('data', data);
          gameStartStatus(true);
          gameUpdateData(data);
        });
    };

    onSubmit = (value) => {
        const { username } = this.state;
        this.socket.emit('setAlias', username);
    };

    onChange = (e) => {
        this.setState({ username: e.target.value });
    };

    render() {
      return (
        <div>
            <div>
                <label>Enter your Username</label>
            </div>
            <div>
                <input id="userName" onChange={this.onChange} name="userName" type="text" />
            </div>
            <div>
                <input id="submitForm" name="submitForm" value="Start Game" type="submit" onClick={this.onSubmit} />
            </div>
        </div>
      );
    }
  }

export default FormUserName;
