import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const productionConfig = {
    apiKey: "AIzaSyDo6ahsl_OdNv9ZGn3KUe726N1wDqOgjoo",
    authDomain: "anemia-4b966.firebaseapp.com",
    databaseURL: "https://anemia-4b966.firebaseio.com",
    projectId: "anemia-4b966",
    storageBucket: "anemia-4b966.appspot.com",
    messagingSenderId: "908932827340"
};

firebase.initializeApp(productionConfig);

firebase.firestore().settings({timestampsInSnapshots: true});

const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export {
    storage,
    firestore,
    auth,
};
