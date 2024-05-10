'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';

const Settings = () => {
  const router = useRouter();
  
  const [signedInUser] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const handleSignout = async () => {
    if (signedInUser) {
      try {
        const userRef = doc(db, 'users', signedInUser.uid);
        await updateDoc(userRef, { isOnline: false });
      } catch (err) {
        console.error(err);
      }

      const res = await signOut();
      if (res) router.push('/');
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center'>
      <Link href={`/profile/${signedInUser?.uid}`} className='
        w-full py-4 rounded-lg shadow-md bg-green-800
        font-medium text-center text-base text-white
        transition duration-300 ease-in-out hover:bg-green-600
      '> Profile </Link>

      <button onClick={handleSignout} className='
        w-full py-4 rounded-lg shadow-md bg-green-800
        font-medium text-base text-white
        transition duration-300 ease-in-out hover:bg-red-500
      '> Sign Out </button>
    </div>
  )
};

export default Settings;