import React, { Component } from 'react';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import { DeviceOrientation,  } from 'react-event-components';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGTH = 1000;

class Canvas extends Component {
    state = {
        x: this.props.me.x,
        y: this.props.me.y,
        deviceOrientation: {}
    };

    componentWillReceiveProps = (nextProps) => {
      this.refs["rect-layer"].draw();
    }

    clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);
    
    haveIntersection = (r1, r2) => {
      return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
      );
    };

    handleDeviceOrientation = ({beta, gamma, alpha, absolute}) => {
      const { socket, me: { alias } } = this.props;
      const { x, y } = this.state;
      const { rectGroup, coloredRect } = this.refs;
      rectGroup.children.each(group => {
          if (this.haveIntersection(group.attrs, coloredRect.attrs)) {
            socket.emit('dead', `${alias}`);
            return;
          }
        });
        let newX = x + Number(gamma.toFixed());
        let newY = y + Number(beta.toFixed());
        this.refs["rect-layer"].children[1].setAttrs({
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
    const { me: { points } } = this.props
    return (
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGTH}>
        <Layer ref={'rect-layer'}>
          <Text text={`Points: ${points}`} />
          <Rect
            ref={'coloredRect'}
            x={this.state.x}
            y={this.state.y}
            width={50}
            height={50}
            fill={'green'}
          />
          <Group ref={'rectGroup'}>
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
        <Layer>
          <DeviceOrientation do={this.handleDeviceOrientation} />
        </Layer>
      </Stage>
    );
  }
}

export default Canvas;
