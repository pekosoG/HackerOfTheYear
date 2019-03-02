import React, { Component } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { DeviceOrientation,  } from 'react-event-components';
import socketIOClient from 'socket.io-client';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGTH = 1000;

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
        console.log('ColoredRect this.props', this.props);
      return (
        <Rect
          x={0 | this.props.x }
          y={0 | this.props.y}
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
        x: this.props.me.x,
        y: this.props.me.y,
        deviceOrientation: {}
    };

    componentDidMount = () => {
        console.log('this.refs["rect-layer"].children', this.refs["rect-layer"].children)
        // this.socket = socketIOClient(process.env.REACT_APP_SOCKET_BACKEND);
        // this.socket.emit('setAlias', 'willsnake');
        // this.socket.on('gameStart', data => {
        //   console.log('data', data);
        // });
    };

    clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    handleDeviceOrientation = ({beta, gamma, alpha, absolute}) => {
        const { x, y } = this.state;
        // alert(JSON.stringify(this.props.me, null, 2));
        let newX = x + Number(gamma.toFixed());
        let newY = y + Number(beta.toFixed());
        this.refs["rect-layer"].children[0].setAttrs({
            x,
            y
        });

        this.refs["rect-layer"].draw();
        this.setState({
            x: this.clamp(newX, 0, parseInt(CANVAS_WIDTH - this.refs["rect-layer"].children[1].attrs.width)),
            y: this.clamp(newY, 0, parseInt(CANVAS_HEIGTH - this.refs["rect-layer"].children[1].attrs.height)),
          deviceOrientation: {
            beta,
            gamma,
            alpha,
            absolute
          }
        });
      };

  render() {
    return (
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGTH}>
        <Layer ref={'rect-layer'}>
          <ColoredRect ref={'rect-layer-tank'} x={this.state.x} y={this.state.y} />
          <DeviceOrientation do={this.handleDeviceOrientation} />
        </Layer>
        <Layer>
         <Group>
             {this.props.map.map( (square, key) => {
                 return (
                    <Rect
                        x={square.x}
                        y={square.y}
                        width={square.w}
                        height={square.h}
                        fill={'black'}
                        ref={`wall${key}`}
                        key={`wall${key}`}
                    />
                 )
             })}
         </Group>
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;