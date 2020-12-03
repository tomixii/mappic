import React from 'react';
import './App.css';
import Main from './Components/main';
import Header from './Components/header';
import { withFirebase } from './Components/Firebase';
import { Provider } from 'react-redux';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';

const win = window;
const nav = navigator;
const doc = document;

const detectFeatures = (reg) => {
	console.log(nav);
	console.log(reg);
	return {
		'Offline Capabilities': 'caches' in win,
		'Push Notifications': 'pushManager' in reg,
		'Add to Home Screen':
			doc.createElement('link').relList.supports('manifest') &&
			'onbeforeinstallprompt' in win,
		'Background Sync': 'sync' in reg,
		'Navigation Preload': 'navigationPreload' in reg,
		'Silent Push': 'budget' in nav && 'reserve' in nav.budget,
		'Storage Estimation': 'storage' in nav && 'estimate' in nav.storage,
		'Persistent Storage': 'storage' in nav && 'persist' in nav.storage,
		'Web Share': 'share' in nav,
		'Media Session': 'mediaSession' in nav,
		'Media Capabilities': 'mediaCapabilities' in nav,
		'Device Memory': 'deviceMemory' in nav,
		'Getting Installed Related Apps': 'getInstalledRelatedApps' in nav,
		'Payment Request': 'PaymentRequest' in win,
		'Credential Management': 'credentials' in nav,
	};
};

const App = (props) => {
	React.useEffect(() => {
		if (serviceWorker in navigator) {
			navigator.serviceWorker
				.register('/firebase-messaging-sw.js')
				.then((reg) => console.log(detectFeatures(reg)));
			serviceWorker.register(props.firebase);
		}
	}, [props.firebase]);

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
