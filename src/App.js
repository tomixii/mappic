import React from 'react';
import './App.css';
import { Main } from './Components/main';
import { Header } from './Components/header';
import { withFirebase } from './Components/Firebase';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
	return (
		<Provider store={store}>
			<div className="App">
				<Header />
				<Main />
			</div>
		</Provider>
	);
}

export default withFirebase(App);
