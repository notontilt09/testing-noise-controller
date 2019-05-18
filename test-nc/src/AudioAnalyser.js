import React from 'react';
import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: 300,
  },
  slider: {
    'margin-top': '100px',
    width: '80%',
    margin: '0 auto',
    padding: '22px 0px',
  },
};

class AudioAnalyser extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      audioData: new Uint8Array(0),
      maxVol: 130,
      violations: 0,
      threshDescription: 'A whisper will trigger me'
    };

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  tick = () => {
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
    if (Math.max.apply(Math, this.state.audioData) > this.state.maxVol) {
      this.setState({
        violations: this.state.violations + 1
      })
    }
  }
  
  handleChange = (e, value) => {
    this.setState({
      maxVol: value
    }, () => {
      if (this.state.maxVol < 135) {
        this.setState({ threshDescription: 'A whisper will trigger me'}) 
      }
      else if (this.state.maxVol > 135 && this.state.maxVol < 150) {
        this.setState({ threshDescription: 'Light Talking'})
      }
      else if (this.state.maxVol > 150 && this.state.maxVol < 200) {
        this.setState({ threshDescription: 'Maybe a raised voice'})
      }
      else if (this.state.maxVol > 200 && this.state.maxVol < 250) {
        this.setState({ threshDescription: 'Enough to give me a headache'})
      }
      else if (this.state.maxVol > 250 && this.state.maxVol < 299) {
        this.setState({ threshDescription: 'Jet airplane in your ear'})
      }
      else if (this.state.maxVol > 299) {
        this.setState({ threshDescription: 'Good luck setting me off'})
      }
    })
  }
  
  render() {
    const { classes } = this.props

    return (
      <>
        <div>This counter will go up if you are too loud!!! {this.state.violations}</div>
        <div>Threshold: {this.state.threshDescription} </div>

        <Slider
          className = {classes.slider}
          value={this.state.maxVol}
          aria-labelledby="label"
          onChange={this.handleChange}
          min={130}
          max={300}
        />
        <div className='levels'>

        </div>
      </>
    )
  }

}

export default withStyles(styles)(AudioAnalyser);