import React, { Component } from 'react';
import './App.css';

import { Canvas, FormUserName } from './components'

class App extends Component {
  state = {
    gameStarted: false,
    map: [],
    me: {}
  }

  gameStartStatus = value => {
    this.setState({ gameStarted: value })
  };

  gameUpdateData = data => {
    const { map, me } = data;
    this.setState({ map, me  })
  };

  render() {
    const { gameStarted, map, me } = this.state;
    return (
      <div className="App">
        {gameStarted ? <Canvas map={map} me={me} /> : <FormUserName gameStartStatus={this.gameStartStatus} gameUpdateData={this.gameUpdateData} />}
      </div>
    );
  }
}

export default App;
