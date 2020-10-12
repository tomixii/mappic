import React from 'react';
import './App.css';
import AddPicture from './Components/Pictures/AddPicture'
import { withFirebase } from './Components/Firebase';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AddPicture></AddPicture>
      </header>
    </div>
  );
}

export default withFirebase(App);
