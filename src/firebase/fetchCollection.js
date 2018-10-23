import firebase from "@firebase/app"
import {snapshotToArray} from "../utils";

export const fetchCollection = (collection, name, func) => {
    firebase.firestore()
        .collection(collection)
        .onSnapshot(snapshot => {
            const data =  snapshotToArray(snapshot);
                return func(name, data);
        })
};