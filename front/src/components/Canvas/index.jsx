import React, { Component } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import { DeviceOrientation,  } from 'react-event-components';
import socketIOClient from 'socket.io-client';

class ColoredRect extends Component {
    state = {
      color: 'green',
    };

    changePosition = () => {
      // to() is a method of `Konva.Node` instances
      this.rect.to({
        scaleX: Math.random() + 0.8,
        scaleY: Math.random() + 0.8,
        duration: 0.2
      });
    };

    render() {
      return (
        <Rect
          x={this.state.x}
          y={this.state.y}
          width={50}
          height={50}
          fill={this.state.color}
          shadowBlur={5}
          onClick={this.handleClick}
          ref={'rect'}
        />
      );
    }
  }

class Canvas extends Component {
    state = {
        x: 20,
        y: 20,
        deviceOrientation: {}
    };

    componentDidMount = () => {
        this.socket = socketIOClient(process.env.REACT_APP_SOCKET_BACKEND);
        this.socket.emit('setAlias', 'willsnake');
        this.socket.on('gameStart', data => {
          console.log('data', data);
        });
    };

    clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    handleDeviceOrientation = ({beta, gamma, alpha, absolute}) => {
        const { x, y } = this.state;
        let newX = x + Number(gamma.toFixed());
        let newY = y + Number(beta.toFixed());
        this.refs["rect-layer"].children[1].setAttrs({
            x,
            y
        });

        this.refs["rect-layer"].draw();
        this.setState({
            x: this.clamp(newX, 0, parseInt(window.innerWidth - this.refs["rect-layer"].children[1].attrs.width)),
            y: this.clamp(newY, 0, parseInt(window.innerHeight - this.refs["rect-layer"].children[1].attrs.height)),
          deviceOrientation: {
            beta,
            gamma,
            alpha,
            absolute
          }
        })
      };

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={'rect-layer'}>
          <Text text="Try click on rect" />
          <ColoredRect x={this.state.x} y={this.state.y} />
        </Layer>
        <Layer
            x={50}
            y={50}
        >
            <DeviceOrientation do={this.handleDeviceOrientation} />
            <Text text="DeviceOrientation" />
        </Layer>
        <Layer
            x={50}
            y={100}
        >
            <Text text={`beta ${this.state.deviceOrientation.beta}`} />
        </Layer>
        <Layer
            x={50}
            y={150}
        >
            <Text text={`gamma ${this.state.deviceOrientation.gamma}`} />
        </Layer>
        <Layer
            x={50}
            y={200}
        >
            <Text text={`alpha ${this.state.deviceOrientation.alpha}`} />
        </Layer>
        <Layer
            x={50}
            y={250}
        >
            <Text text={`absolute ${this.state.deviceOrientation.absolute}`} />
        </Layer>
        <Layer
            x={50}
            y={300}
        >
            <Text text={`x ${this.state.x}`} />
        </Layer>
        <Layer
            x={50}
            y={350}
        >
            <Text text={`y ${this.state.y}`} />
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;
