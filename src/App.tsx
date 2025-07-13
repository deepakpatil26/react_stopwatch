import React, { Component } from 'react';
import Stopwatch from './Stopwatch';

class App extends Component {
  render() {
    return (
      <div className='min-h-screen w-full flex items-center justify-center bg-black p-4'>
        <div className='w-full max-w-2xl h-auto text-center flex flex-col justify-center items-center'>
          <Stopwatch />
        </div>
      </div>
    );
  }
}

export default App;
