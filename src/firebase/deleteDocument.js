import firebase from "@firebase/app";

export const deleteDocument = (collection, id) => {
    firebase.firestore()
        .collection(collection)
        .doc(id)
        .delete();
};