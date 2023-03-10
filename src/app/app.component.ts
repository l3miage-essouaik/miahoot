import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { Auth, authState,onAuthStateChanged, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup, } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(MatProgressSpinner) spinner: MatProgressSpinner | undefined;
  title = 'miahoot';

  public isLoading = new BehaviorSubject<boolean>(false);

  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;
  public user$: Observable<User | null>; // an observable that emits the currently logged in user or null
  public userPhotoUrl: string; 

  showLoginButton = false;
  showLogoutButton = false;
  //optional : pour le cas ou on ne puisse pas faire l'injection 
  constructor(@Optional() private auth: Auth) {
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
      });
    }
  }

  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  ngOnDestroy(): void {
    if(this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
    
  }
  
  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.userPhotoUrl = user.photoURL ?? ''; // si c'est null on retourne ""
      } else {
        this.userPhotoUrl = ''; // set to empty string if no user is logged in
      }
    });
  }

  async login() {
    try {
      this.isLoading.next(true);
      await signInWithPopup(this.auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      this.isLoading.next(false);
    }
  }
  

  async loginAnonymously() {
    try {
      this.isLoading.next(true);
      await signInAnonymously(this.auth);
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      this.isLoading.next(false);
    }
  }

  async logout() {
    return await signOut(this.auth);
  }

}
