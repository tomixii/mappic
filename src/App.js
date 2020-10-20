import React from 'react';
import './App.css';
import { Main } from './Components/main';
import { Header } from './Components/header';
import { withFirebase } from './Components/Firebase';

function App() {
	return (
		<div className="App">
			<Header />
			<Main />
		</div>
	);
}

export default withFirebase(App);
