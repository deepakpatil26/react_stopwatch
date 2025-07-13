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
  renderTickMarks = (clockSize: number) => {
    const ticks = [];
    const majorTickHeight = clockSize * 0.042; // ~12px for 288px clock
    const minorTickHeight = clockSize * 0.028; // ~8px for 288px clock
    const majorTickTop = clockSize * 0.028; // ~8px for 288px clock
    const minorTickTop = clockSize * 0.042; // ~12px for 288px clock
    const transformOrigin = `50% ${clockSize * 0.472}px`; // ~136px for 288px clock

    // Major ticks (every 5 seconds = 30 degrees)
    for (let i = 0; i < 12; i++) {
      const angle = i * 30;
      ticks.push(
        <div
          key={`major-${i}`}
          className='absolute bg-cyan-400 rounded-sm'
          style={{
            width: '2px',
            height: `${majorTickHeight}px`,
            top: `${majorTickTop}px`,
            left: '50%',
            transform: `translateX(-50%) rotate(${angle}deg)`,
            transformOrigin: transformOrigin,
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
              height: `${minorTickHeight}px`,
              top: `${minorTickTop}px`,
              left: '50%',
              transform: `translateX(-50%) rotate(${angle}deg)`,
              transformOrigin: `50% ${clockSize * 0.458}px`, // ~132px for 288px clock
            }}
          />
        );
      }
    }

    return ticks;
  };

  // Generate numbers
  renderNumbers = (clockSize: number) => {
    const numbers = [] as React.ReactNode[];
    const radius = clockSize * 0.347; // ~100px for 288px clock
    const displayNumbers = [60, 15, 30, 45]; // Only show these 4 numbers
    const positions = [0, 3, 6, 9]; // Corresponding positions (0=top, 3=right, 6=bottom, 9=left)

    positions.forEach((pos, index) => {
      const angle = (pos * 30 - 90) * (Math.PI / 180); // -90 to start from top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      numbers.push(
        <div
          key={`number-${pos}`}
          className='absolute text-cyan-400 font-bold select-none'
          style={{
            fontSize: `${clockSize * 0.056}px`, // ~16px for 288px clock
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

    // Responsive clock size calculation
    const getClockSize = () => {
      if (typeof window !== 'undefined') {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        // Calculate based on available space, leaving room for digital display and buttons
        const availableWidth = Math.min(vw * 0.85, 400); // Max 400px
        const availableHeight = vh * 0.4; // 40% of viewport height for clock
        
        return Math.min(availableWidth, availableHeight, 288); // Max 288px
      }
      return 240; // Default fallback
    };

    const clockSize = getClockSize();
    const minuteHandLength = clockSize * 0.243; // ~70px for 288px clock
    const secondHandLength = clockSize * 0.313; // ~90px for 288px clock
    const msHandLength = clockSize * 0.347; // ~100px for 288px clock

    const minuteAngle = m * 6 + s * 0.1;
    const secondAngle = s * 6 + ms * 0.006;
    const msAngle = (ms / 1000) * 360;

    const baseBtn = 'rounded-lg shadow-lg transition-all duration-200 px-4 py-2 text-sm sm:text-base font-semibold text-center hover:opacity-90 hover:scale-105 active:scale-95 min-w-[100px] flex-1 max-w-[120px]';
    
    const buttons =
      !tick && !started ? (
        <div className='mt-4 flex gap-3 justify-center items-center'>
          <button
            className={`${baseBtn} bg-[#28a745] text-white`}
            onClick={this.startCounter}>
            Start
          </button>
        </div>
      ) : !tick && started ? (
        <div className='mt-4 flex gap-3 justify-center items-center'>
          <button
            className={`${baseBtn} bg-blue-600 text-white`}
            onClick={this.resumeCounter}>
            Resume
          </button>
          <button
            className={`${baseBtn} bg-yellow-500 text-gray-900`}
            onClick={this.resetCounter}>
            Reset
          </button>
        </div>
      ) : (
        <div className='mt-4 flex gap-3 justify-center items-center'>
          <button
            className={`${baseBtn} bg-red-600 text-white`}
            onClick={this.stopCounter}>
            Stop
          </button>
          <button
            className={`${baseBtn} bg-yellow-500 text-gray-900`}
            onClick={this.resetCounter}>
            Reset
          </button>
        </div>
      );

    return (
      <div className='w-full max-w-lg mx-auto h-full flex flex-col justify-center items-center bg-gray-800 text-white font-sans p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden'>
        {/* Analog face */}
        <div 
          className='relative rounded-full mb-4 sm:mb-6 bg-gray-900 flex items-center justify-center border-4 border-gray-600 overflow-hidden flex-shrink-0'
          style={{
            width: `${clockSize}px`,
            height: `${clockSize}px`,
            minWidth: `${clockSize}px`,
            minHeight: `${clockSize}px`,
            maxWidth: `${clockSize}px`,
            maxHeight: `${clockSize}px`,
            aspectRatio: '1 / 1'
          }}
        >
          {/* Tick marks */}
          {this.renderTickMarks(clockSize)}

          {/* Numbers */}
          {this.renderNumbers(clockSize)}

          {/* Hands */}
          {/* Minute hand */}
          <div
            className='absolute bg-cyan-400 rounded-sm z-10'
            style={{
              width: '3px',
              height: `${minuteHandLength}px`,
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
              height: `${secondHandLength}px`,
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
              height: `${msHandLength}px`,
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${msAngle}deg)`,
              transformOrigin: '50% 100%',
              transition: 'transform 0.05s ease-out',
            }}
          />

          {/* Center pivot */}
          <div 
            className='absolute top-1/2 left-1/2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-30 border border-gray-800'
            style={{
              width: `${clockSize * 0.042}px`, // ~12px for 288px clock
              height: `${clockSize * 0.042}px`
            }}
          />
        </div>

        {/* Digital display */}
        <div className='flex flex-col items-center w-full'>
          <div className='flex flex-row items-center justify-center flex-wrap mb-2'>
            <span className='text-2xl sm:text-3xl md:text-4xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(h)}
            </span>
            <span className='text-2xl sm:text-3xl md:text-4xl text-cyan-400 mx-1 font-mono'>:</span>
            <span className='text-2xl sm:text-3xl md:text-4xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(m)}
            </span>
            <span className='text-2xl sm:text-3xl md:text-4xl text-cyan-400 mx-1 font-mono'>:</span>
            <span className='text-2xl sm:text-3xl md:text-4xl text-cyan-400 mx-1 font-mono'>
              {this.leading2(s)}
            </span>
            <span className='text-xl sm:text-2xl md:text-3xl text-cyan-400 mx-1 font-mono'>
              .{this.leading3(ms)}
            </span>
          </div>
          {buttons}
        </div>
      </div>
    );
  }
}
