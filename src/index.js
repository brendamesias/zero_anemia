import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from "@firebase/app";
import "@firebase/firestore";

firebase.initializeApp({
  apiKey: 'AIzaSyDo6ahsl_OdNv9ZGn3KUe726N1wDqOgjoo',
  authDomain: 'anemia-4b966.firebaseapp.com',
  projectId: 'anemia-4b966'
});

firebase.firestore().settings({timestampsInSnapshots: true});
firebase.firestore().enablePersistence()
    .catch(error => console.log("ERROR enabling offline persistence", error));

let pageLoaded = false;

firebase.firestore()
    .collection("versions")
    .onSnapshot(() => {
        pageLoaded && document.location.reload();
        pageLoaded = true;
    });

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
