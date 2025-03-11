import React, { Component } from 'react';
import { Form, FormGroup, Button, ButtonGroup } from 'react-bootstrap';
import './Stopwatch.css';

// Define a type for component state
interface StopwatchState {
   tick: NodeJS.Timeout | null;
   totalSeconds: number;
}

// Define a functional component for Separator
const Separator: React.FC = () => {
   return <span className='Stopwatch-number'>:</span>;
};

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

      if (!this.state.tick && !started) {
         buttons = (
            <ButtonGroup className='Stopwatch-button-group'>
               <Button
                  className='Stopwatch-button Stopwatch-button-start'
                  onClick={this.startCounter}>
                  Start
               </Button>
            </ButtonGroup>
         );
      } else if (!this.state.tick && started) {
         buttons = (
            <ButtonGroup className='Stopwatch-button-group'>
               <Button
                  className='Stopwatch-button Stopwatch-button-resume'
                  onClick={this.resumeCounter}>
                  Resume
               </Button>
               <Button
                  className='Stopwatch-button Stopwatch-button-reset'
                  onClick={this.resetCounter}>
                  Reset
               </Button>
            </ButtonGroup>
         );
      } else {
         buttons = (
            <ButtonGroup className='Stopwatch-button-group'>
               <Button
                  className='Stopwatch-button Stopwatch-button-stop'
                  onClick={this.stopCounter}>
                  Stop
               </Button>
               <Button
                  className='Stopwatch-button Stopwatch-button-reset'
                  onClick={this.resetCounter}>
                  Reset
               </Button>
            </ButtonGroup>
         );
      }

      return (
         <div className='Stopwatch'>
            <Form className='Stopwatch-display'>
               <FormGroup>
                  <span className='Stopwatch-number'>
                     {this.leadingZero(this.getHours())}
                  </span>
                  <Separator />
                  <span className='Stopwatch-number'>
                     {this.leadingZero(this.getMinutes())}
                  </span>
                  <Separator />
                  <span className='Stopwatch-number'>
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
