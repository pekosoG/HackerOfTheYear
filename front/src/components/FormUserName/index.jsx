import React, { Component } from 'react';

class FormUserName extends Component {
    state = {
        username: '' 
    }

    onSubmit = () => {
        const { username } = this.state;
        this.props.socket.emit('setAlias', username);
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
