import { miahootUser } from "app/models/miahootUser";
import { FirestoreDataConverter, QueryDocumentSnapshot } from "@firebase/firestore";
import firebase from 'firebase/compat/app';

export const userConverter : FirestoreDataConverter<miahootUser> = {
    toFirestore(user: miahootUser) {
        return { name: user.name, photoURL: user.photoURL };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<firebase.firestore.DocumentData>,
        options: firebase.firestore.SnapshotOptions ): miahootUser {
        const data = snapshot.data(options);
        const user : miahootUser = {
            ['name']: data['name'] ?? "",
            ['photoURL']: data['photoURL'] ?? ""
        };
        return user;
      }
}