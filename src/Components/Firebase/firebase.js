import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
import * as serviceWorker from '../../serviceWorker';

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
        this.storage = app.storage()
        if (app.messaging.isSupported()){
            this.messaging = app.messaging()
            this.messaging.onMessage((payload) => {
                console.log('Message received. ', payload);
                // [START_EXCLUDE]
                // Update the UI to include the received message.
                // [END_EXCLUDE]
            });
        } else {
            console.log("messaging is not supported")
        }
        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
                this.messaging.useServiceWorker(registration);
            });
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

    //users = () => this.db.collection('users');

    //pictures api
    pictures = (pictureId) => this.db.document(`pictures/${pictureId}`);
    pictures = () => this.db.collection('pictures');

}

export default Firebase;
