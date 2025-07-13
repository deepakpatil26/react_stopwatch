import React, { Component } from 'react';

interface StopwatchState {
  tick: NodeJS.Timeout | null;
  totalMs: number;
}

const Separator: React.FC = () => (
  <span className='text-4xl sm:text-5xl md:text-7xl text-cyan-400 mx-2 font-mono'>
    :
  </span>
);

export default class Stopwatch extends Component<{}, StopwatchState> {
  constructor(props: {}) {
    super(props);
    this.state = { tick: null, totalMs: 0 };
  }

  incrementMs = () => this.setState((prev) => ({ totalMs: prev.totalMs + 16 }));

  startCounter = () => {
    this.stopCounter();
    const tick = setInterval(this.incrementMs, 16);
    this.setState({ tick });
  };

  stopCounter = () => {
    if (this.state.tick) clearInterval(this.state.tick);
    this.setState({ tick: null });
  };

  resetCounter = () => {
    this.stopCounter();
    this.setState({ totalMs: 0 });
  };

  resumeCounter = () => this.startCounter();

  getHours = () => Math.floor(this.state.totalMs / 3600000);
  getMinutes = () => Math.floor(this.state.totalMs / 60000) % 60;
  getSeconds = () => Math.floor(this.state.totalMs / 1000) % 60;
  getMs = () => this.state.totalMs % 1000;

  leading2 = (n: number) => (n < 10 ? '0' + n : n.toString());
  leading3 = (n: number) => n.toString().padStart(3, '0');

  // Generate tick marks
  renderTickMarks = () => {
    const ticks = [];

    // Major ticks (every 5 seconds = 30 degrees)
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      ticks.push(
        <div
          key={`major-${i}`}
          className='absolute bg-[#61dafb] rounded-sm'
          style={{
            width: '2px',
            height: '12px',
            top: '8px',
            left: '50%',
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: '50% 136px',
          }}
        />
      );
    }

    // Minor ticks (every 1 second = 6 degrees)
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        // Skip positions where major ticks are
        const angle = i * 6;
        ticks.push(
          <div
            key={`minor-${i}`}
            className='absolute bg-gray-500 rounded-sm'
            style={{
              width: '1px',
              height: '8px',
              top: '12px',
              left: '50%',
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: '50% 132px',
            }}
          />
        );
      }
    }

    return ticks;
  };

  // Generate numbers
  renderNumbers = () => {
    const numbers = [] as React.ReactNode[];
    const radius = 100; // Distance from center
    const displayNumbers = [60, 15, 30, 45]; // Only show these 4 numbers
    const positions = [0, 3, 6, 9]; // Corresponding positions (0=top, 3=right, 6=bottom, 9=left)

    positions.forEach((pos, index) => {
      const angle = (pos * 30 - 90) * (Math.PI / 180); // -90 to start from top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      numbers.push(
        <div
          key={`number-${pos}`}
          className='absolute text-cyan-400 text-base font-bold select-none'
          style={{
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: 'translate(-50%, -50%)',
          }}>
          {displayNumbers[index]}
        </div>
      );
    });

    return numbers;
  };

  render() {
    const { tick, totalMs } = this.state;
    const h = this.getHours(),
      m = this.getMinutes(),
      s = this.getSeconds(),
      ms = this.getMs();
    const started = totalMs > 0;

    const minuteAngle = m * 6 + s * 0.1;
    const secondAngle = s * 6 + ms * 0.006;
    const msAngle = (ms / 1000) * 360;

    const baseBtn =
      'rounded-md shadow-lg transition px-4 py-2 text-base sm:text-lg md:text-xl w-full max-w-[200px] md:max-w-[140px] text-center hover:opacity-90 active:translate-y-[1px]';
    const buttons =
      !tick && !started ? (
        <div className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <button
            className={`${baseBtn} bg-[#28a745] text-white`}
            onClick={this.startCounter}>
            Start
          </button>
        </div>
      ) : !tick && started ? (
        <div className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <button
            className={`${baseBtn} bg-[#007bff] text-white`}
            onClick={this.resumeCounter}>
            Resume
          </button>
          <button
            className={`${baseBtn} bg-[#ffc107] text-[#282c34]`}
            onClick={this.resetCounter}>
            Reset
          </button>
        </div>
      ) : (
        <div className='my-5 mx-auto flex flex-col gap-2 items-center md:flex-row'>
          <button
            className={`${baseBtn} bg-[#dc3545] text-white`}
            onClick={this.stopCounter}>
            Stop
          </button>
          <button
            className={`${baseBtn} bg-[#ffc107] text-[#282c34]`}
            onClick={this.resetCounter}>
            Reset
          </button>
        </div>
      );

    return (
      <div className='w-[95vw] max-w-xl h-full flex flex-col justify-center items-center bg-[#282c34] text-white font-sans p-5 rounded-xl shadow-2xl'>
        {/* Analog face */}
        <div 
          className='relative rounded-full mb-6 bg-gray-900 flex items-center justify-center border-4 border-gray-600 overflow-hidden'
          style={{
            width: '288px',
            height: '288px',
            minWidth: '288px',
            minHeight: '288px',
            maxWidth: '288px',
            maxHeight: '288px',
            aspectRatio: '1 / 1'
          }}
        >
          {/* Tick marks */}
          {this.renderTickMarks()}

          {/* Numbers */}
          {this.renderNumbers()}

          {/* Hands */}
          {/* Minute hand */}
          <div
            className='absolute bg-cyan-400 rounded-sm z-10'
            style={{
              width: '3px',
              height: '70px',
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              transformOrigin: '50% 100%',
              transition: 'transform 0.1s ease-out',
            }}
          />
          {/* Second hand */}
          <div
            className='absolute bg-yellow-400 rounded-sm z-20'
            style={{
              width: '2px',
              height: '90px',
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              transformOrigin: '50% 100%',
              transition: 'transform 0.1s ease-out',
            }}
          />
          {/* Millisecond hand */}
          <div
            className='absolute bg-white bg-opacity-60 rounded-sm z-10'
            style={{
              width: '1px',
              height: '100px',
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${msAngle}deg)`,
              transformOrigin: '50% 100%',
              transition: 'transform 0.05s ease-out',
            }}
          />

          {/* Center pivot */}
          <div className='absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 border border-gray-800' />
        </div>

        {/* Digital display */}
        <div className='flex flex-col items-center'>
          <div className='flex flex-row items-center justify-center flex-wrap'>
            <span className='text-4xl sm:text-5xl md:text-6xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(h)}
            </span>
            <Separator />
            <span className='text-4xl sm:text-5xl md:text-6xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(m)}
            </span>
            <Separator />
            <span className='text-4xl sm:text-5xl md:text-6xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(s)}
            </span>
            <span className='text-3xl sm:text-4xl md:text-5xl text-cyan-400 mx-1 font-mono'>
              .{this.leading3(ms)}
            </span>
          </div>
          {buttons}
        </div>
      </div>
    );
  }
}
