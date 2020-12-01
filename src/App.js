import React from 'react';
import './App.css';
import Main from './Components/main';
import Header from './Components/header';
import { withFirebase } from './Components/Firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';

const App = (props) => {
	React.useEffect(() => {
		navigator.serviceWorker.register('/firebase-messaging-sw.js');
		serviceWorker.register(props.firebase);
	}, []);

	return (
		<Provider store={store}>
			<div className="App">
				<Header />
				<Main />
			</div>
		</Provider>
	);
};

export default withFirebase(App);
