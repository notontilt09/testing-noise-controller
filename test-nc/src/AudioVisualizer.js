import React from 'react';

class AudioVisualiser extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }
 
  render() {
    return <canvas width="300" height="300" ref={this.canvas} />;
  }
}

export default AudioVisualiser;