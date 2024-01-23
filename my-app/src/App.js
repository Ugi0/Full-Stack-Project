import React from 'react';
import './styles/App.css';
import { FloatingImage } from './components/floatingimage.jsx'
import { ClickableNote } from './components/clickableNote.jsx';

function App() {
  return (
    <div className="App">
      <ClickableNote title="Random title" description="Some longer text to describe the note" />
    </div>
  );
}

export default App;
