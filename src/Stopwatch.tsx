import React, { Component } from 'react';
import { Form, FormGroup, Button, ButtonGroup } from 'react-bootstrap';

// Define a type for component state
interface StopwatchState {
  tick: NodeJS.Timeout | null;
  totalSeconds: number;
}

// Responsive Separator component
const Separator: React.FC = () => (
  <span className='text-4xl sm:text-5xl md:text-7xl text-[#61dafb] mx-2'>
    :
  </span>
);

class Stopwatch extends Component<{}, StopwatchState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tick: null,
      totalSeconds: 0,
    };
  }

  incrementCount = () => {
    this.setState((prevState) => ({
      totalSeconds: prevState.totalSeconds + 1,
    }));
  };

  getHours = (): number => {
    return Math.floor(this.state.totalSeconds / 3600) % 24;
  };

  getMinutes = (): number => {
    return Math.floor(this.state.totalSeconds / 60) % 60;
  };

  getSeconds = (): number => {
    return this.state.totalSeconds % 60;
  };

  startCounter = () => {
    this.stopCounter();
    const tick = setInterval(this.incrementCount, 1000);
    this.setState({ tick });
  };

  stopCounter = () => {
    if (this.state.tick) {
      clearInterval(this.state.tick);
      this.setState({ tick: null });
    }
  };

  resetCounter = () => {
    this.stopCounter();
    this.setState({ totalSeconds: 0 });
  };

  resumeCounter = () => {
    this.startCounter();
  };

  leadingZero = (num: number): string => {
    return num < 10 ? '0' + num : num.toString();
  };

  render() {
    const started =
      this.getHours() > 0 || this.getMinutes() > 0 || this.getSeconds() > 0;

    let buttons = null;

    // Responsive button classes
    const baseBtn =
      'rounded-md shadow-lg transition px-4 py-2 text-base sm:text-lg md:text-xl w-full max-w-[200px] md:max-w-[140px] text-center hover:opacity-90 active:translate-y-[1px]';

    if (!this.state.tick && !started) {
      buttons = (
        <ButtonGroup className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <Button
            className={`${baseBtn} bg-[#28a745] text-white`}
            onClick={this.startCounter}>
            Start
          </Button>
        </ButtonGroup>
      );
    } else if (!this.state.tick && started) {
      buttons = (
        <ButtonGroup className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <Button
            className={`${baseBtn} bg-[#007bff] text-white`}
            onClick={this.resumeCounter}>
            Resume
          </Button>
          <Button
            className={`${baseBtn} bg-[#ffc107] text-[#282c34]`}
            onClick={this.resetCounter}>
            Reset
          </Button>
        </ButtonGroup>
      );
    } else {
      buttons = (
        <ButtonGroup className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <Button
            className={`${baseBtn} bg-[#dc3545] text-white`}
            onClick={this.stopCounter}>
            Stop
          </Button>
          <Button
            className={`${baseBtn} bg-[#ffc107] text-[#282c34]`}
            onClick={this.resetCounter}>
            Reset
          </Button>
        </ButtonGroup>
      );
    }

    return (
      <div className='w-[95vw] max-w-xl h-full flex flex-col justify-center items-center bg-[#282c34] text-white font-sans p-5 rounded-xl shadow-2xl'>
        <Form className='flex-1 self-stretch flex flex-col justify-center items-center flex-wrap'>
          <FormGroup className='flex flex-row items-center justify-center flex-wrap'>
            <span className='text-4xl sm:text-5xl md:text-7xl text-[#61dafb] mx-2'>
              {this.leadingZero(this.getHours())}
            </span>
            <Separator />
            <span className='text-4xl sm:text-5xl md:text-7xl text-[#61dafb] mx-2'>
              {this.leadingZero(this.getMinutes())}
            </span>
            <Separator />
            <span className='text-4xl sm:text-5xl md:text-7xl text-[#61dafb] mx-2'>
              {this.leadingZero(this.getSeconds())}
            </span>
          </FormGroup>
          <FormGroup>{buttons}</FormGroup>
        </Form>
      </div>
    );
  }
}

export default Stopwatch;
