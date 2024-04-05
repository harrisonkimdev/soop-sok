'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import {
  useAuthState,
  useSignInWithGoogle,
  useSignInWithApple
} from 'react-firebase-hooks/auth';
import {
  doc,
  setDoc, getDoc, updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import Cookies from 'universal-cookie';

export default function Home() {
  const [signInWithGoogle, user, loadingGoogle, errorGoogle] = useSignInWithGoogle(auth);
  // const [signInWithApple, loadingApple, errorApple] = useSignInWithApple(auth);

  const [signedInUser, loading, error] = useAuthState(auth);

  const router = useRouter();

  const { dispatch } = useAppState();

  const cookies = new Cookies();

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  ui.start('#firebaseui-auth-container', {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID
    ]
  });

  const handleSignIn = async () => {
    const result = await signInWithGoogle();

    // store the auth token into the cookie
    // https://www.npmjs.com/package/cookies
    cookies.set('auth-token', result?.user.refreshToken);

    // check if the user is signed in
    if (result && auth.currentUser) {
      // if their profile isn't found in the database, create a new one
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const querySnapshot = await getDoc(userRef);

      // if this is the first time sign in, create a new user data and store it.)
      if (!querySnapshot.exists()) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          createdAt: serverTimestamp(),
          displayName: result.user.displayName,
          email: result.user.email,
          friendWith: [],
          honourPoints: 0,
          isEmailVerified: true,
          isOnline: true,
          lastLoginTime: serverTimestamp(),
          photoURL: result.user.photoURL,
          profile: {
            introduction: '',
            interests: []
          },
          uid: auth.currentUser.uid
        });
      }
      // otherwise, update the isOnline status
      else {
        const userSnapshot = doc(db, 'users', querySnapshot.id);
        await updateDoc(userSnapshot, {
          isOnline: true,
          lastLoginTime: serverTimestamp()
        });
      }

      if (!errorGoogle) {
        router.push('/components');
        dispatch({ type: 'SET_TO_CHANNEL' });
      }
    }
  };

  return (
    <div className="pt-24 flex flex-col gap-64 items-center">
      <div className='text-center flex flex-col gap-4'>
        <h1 className='text-4xl'>숲 속</h1>
        <p className=''>Lorem, ipsum lor sit amet consectetur adipisicing elit. Doloribus laboriosam dolor maxime suscipit tempore corrupti odit. Assumenda molestias nostrum voluptatem?</p>
      </div>

      { !signedInUser ? (
        <div className='flex flex-col gap-4 text-center'>
          <div onClick={handleSignIn}>
            <div id='firebaseui-auth-container'></div>
          </div>
        </div>
      ) : (
        <p>signed in</p>
      )}
    </div>
  );
}
