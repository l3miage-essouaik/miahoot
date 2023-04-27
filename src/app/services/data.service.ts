import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { userConverter } from 'app/converters/userConverter';
import { miahootUser } from 'app/models/miahootUser';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { docData, Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { updateDoc } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  obsMiUser: Observable<miahootUser | undefined>

  constructor(private auth: Auth, private fs: Firestore) {
        
    this.obsMiUser = authState(this.auth).pipe(
      switchMap((user) => {
        if(user == null) {
          return of(undefined);
        }else{
          const docId = `users/${user.uid}`;
          const docUser = doc(this.fs,docId).withConverter(userConverter);
          
          return docData(docUser);
        }
      })
    )

    authState(this.auth).subscribe(async (user) => {
      if(user != null){
        const docId = `users/${user.uid}`;
        const docUser = doc(this.fs,docId).withConverter(userConverter);
        const snap = await getDoc(docUser);

        if(!snap.exists()){          
          setDoc(docUser, {
            name: user.displayName ?? user.email ?? user.uid,
            photoURL: user.photoURL ?? "https://conservativeenthusiast.com/wp-content/uploads/2020/09/Arthur_Schopenhauer_colorized.png"
          })
        }
      }  
    });
  }

  updateUser = (user: Partial<miahootUser>) => {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error("Utilisateur inexistant!");
    }
    const docId = `users/${uid}`;
    const docUser = doc(this.fs, docId).withConverter(userConverter);
    return updateDoc(docUser,user);
  }
 

}
