import React, { Component } from 'react';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import { DeviceOrientation,  } from 'react-event-components';

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
      return (
        <Rect
          x={this.props.x}
          y={this.props.y}
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

    clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    handleDeviceOrientation = ({beta, gamma, alpha, absolute}) => {
      const { x, y } = this.state;
      // const { coloredRect, rectGroup, groupLayer } = this.refs;
        // const target = coloredRect.getClientRect();
        // groupLayer.children.each((group) => {
        //   alert('group', JSON.stringify())
        //   // do not check intersection with itself
        //   if (group === target) {
        //     return;
        //   }
        //   // if (haveIntersection(group.getClientRect(), targetRect)) {
        //   //   group.findOne('.fillShape').fill('red');
        //   // } else {
        //   //   group.findOne('.fillShape').fill('grey');
        //   // }
        //   // do not need to call layer.draw() here
        //   // because it will be called by dragmove action
        // });
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
    return (
      <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGTH}>
        <Layer ref={'rect-layer'}>
          <Text text="" />
          <ColoredRect ref={'coloredRect'} x={this.state.x} y={this.state.y} />
        </Layer>
        <Layer ref={'groupLayer'}>
          <DeviceOrientation do={this.handleDeviceOrientation} />
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
      </Stage>
    );
  }
}

export default Canvas;
