import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

import { Canvas, FormUserName } from './components'

class App extends Component {
  state = {
    gameStarted: false,
    map: [],
    me: {},
    socket: socketIOClient(process.env.REACT_APP_SOCKET_BACKEND)
  }

  componentDidMount = () => {
    const { socket } = this.state;
    socket.on('gameStart', data => {
      this.setState({ gameStarted: true, map: data.map, me: data.me });
    });
  }

  render() {
    const { gameStarted, map, me, socket } = this.state;

    return (
      <div className="App">
        {gameStarted ? <Canvas map={map} me={me} socket={socket} gameEnded={this.gameEnded} /> : <FormUserName socket={socket} />}
      </div>
    );
  }
}

export default App;
