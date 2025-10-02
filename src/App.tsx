import { useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from './PhaserGame';

const App = () => {
  const phaserRef = useRef<IRefPhaserGame | null>(null);

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={() => {}} />
    </div>
  );
};

export default App;
