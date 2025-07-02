import React, { Component } from 'react';
import Stopwatch from './Stopwatch';

class App extends Component {
  render() {
    return (
      <div className='absolute w-full h-full flex items-center justify-center bg-black'>
        <div className='w-[65%] h-[75%] text-center m-auto flex flex-col justify-center items-center'>
          <Stopwatch />
        </div>
      </div>
    );
  }
}

export default App;
