import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
		this.db = app.firestore();

		this.db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
			console.log(err);
			if (err.code === 'failed-precondition') {
				// Multiple tabs open, persistence can only be enabled
				// in one tab at a a time.
				// ...
			} else if (err.code === 'unimplemented') {
				// The current browser does not support all of the
				// features required to enable persistence
				// ...
			}
		});

		this.storage = app.storage();
		this.firestore = app.firestore;
		if (app.messaging.isSupported()) {
			this.messaging = app.messaging();
			this.messaging.getToken({
				vapidKey:
					'BBtRGGPWogpmWdmdnqpq8IQouLEwsG8iiu6r3LXHuDYvFhtDJwyRp06VlKMhDbGUCsGMJtuCYKlcm28Z4pk7duQ',
			});
			this.messaging.onMessage((payload) => {
				console.log('Message received. ', payload);
				// [START_EXCLUDE]
				// Update the UI to include the received message.
				// [END_EXCLUDE]
			});
		} else {
			console.log('messaging is not supported');
		}
	}

	// *** Auth API ***

	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = (password) =>
		this.auth.currentUser.updatePassword(password);

	getCurrentUser = () => this.auth.currentUser;

	// *** User API ***

	users = () => this.db.collection('users');

	//pictures api
	pictures = (pictureId) => this.db.document(`pictures/${pictureId}`);
	pictures = () => this.db.collection('pictures');
}

export default Firebase;
