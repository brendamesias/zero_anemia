import firebase from "@firebase/app";

export const updateDocument = (collection, id, object) => {
    firebase.firestore()
        .collection(collection)
        .doc(id)
        .update(object);
};