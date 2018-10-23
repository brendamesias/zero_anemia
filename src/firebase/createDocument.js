import firebase from "@firebase/app";

export const createDocument = (collection, object) => {
    firebase.firestore()
        .collection(collection)
        .add(object);
};