'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { auth, db } from '@/utils/firebase';
import { useSignOut } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const router = useRouter();
  
  const [signOut] = useSignOut(auth);

  const handleSignout = async () => {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { isOnline: false });
      } catch (err) {
        console.error(err);
      }

      const res = await signOut();
      if (res) router.push('/');
    }
  };

  return (
    <div className='
      h-full p-5 rounded-lg bg-green-50 shadow-md
      flex flex-col gap-5 items-center
    '>
      <Link href={`/profile/${auth.currentUser?.uid}`} className='
        w-full py-4 rounded-lg bg-green-800 text-white
        font-medium shadow-md text-center transition duration-300 ease-in-out hover:bg-green-600
      '> Profile </Link>

      <button onClick={handleSignout} className='
        w-full py-4 rounded-lg bg-green-800 text-white
        font-medium shadow-md transition duration-300 ease-in-out hover:bg-red-500
      '> Sign Out </button>
    </div>
  )
};

export default Settings;