import React from 'react';
import './App.css';
import { withFirebase } from './Components/Firebase';
import CameraApp from "./Components/Pictures/Camera";
import ShowPictures from "./Components/Pictures/ShowPictures";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ShowPictures/>
        <CameraApp/>
      </header>
    </div>
  );
}

export default withFirebase(App);
