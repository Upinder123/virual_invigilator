import React from 'react';
import AnimatedText from './AnimatedText';

class ProgressRing extends React.Component {
  constructor(props) {
    super(props);

    const { radius, stroke, final } = props;
    this.normalizedRadius = radius - stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
    this.final = final;

    this.initialInrement = 0.4;
    this.afterInrement = 0.3;
    this.percentageCompleteBeforeAfterIncrement = 0.8;
    this.timeRequired = this.final * 30;

    this.state = {
      progress: 0,
    };
  }

  componentDidMount() {
    this.setState({ progress: 0 });
    const interval = setInterval(() => {
      if (
        this.state.progress <=
        this.final * this.percentageCompleteBeforeAfterIncrement
      )
        this.setState(prevState => ({
          ...prevState,
          progress: this.state.progress + this.initialInrement,
        }));
      else
        this.setState(prevState => ({
          ...prevState,
          progress: this.state.progress + this.afterInrement,
        }));

      if (this.state.progress >= this.final) {
        clearInterval(interval);
      }
    }, 10);
  }

  render() {
    const { radius, stroke } = this.props;
    const strokeDashoffset =
      this.circumference - (this.state.progress / 100) * this.circumference;

    return (
      <>
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke={
              this.state.progress < 33
                ? '#fc7b03'
                : this.state.progress < 80
                ? '#fcdb03'
                : '#00cc07'
            }
            fill='transparent'
            strokeWidth={stroke}
            strokeDasharray={`${this.circumference} ${this.circumference}`}
            style={{ strokeDashoffset }}
            r={this.normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap='round'
          />
          <text
            x='50%'
            y='50%'
            textAnchor='middle'
            stroke='#000'
            strokeWidth='1px'
            dy='.3em'
          >
            <AnimatedText end={this.final} duration={this.timeRequired} />
          </text>
        </svg>
      </>
    );
  }
}

export default ProgressRing;
