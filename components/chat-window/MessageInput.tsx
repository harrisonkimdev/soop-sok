import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppState } from '@/utils/AppStateProvider';

import { auth, db } from '@/utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import {
  ChevronDoubleLeftIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';

type MessageinputProps = {
  cid: string,
};

const MessageInput = ({ cid }: MessageinputProps) => {
  const [messageInput, setMessageInput] = useState('');

  const params = useParams();

  const { state, dispatch } = useAppState();

  const [signedInUser] = useAuthState(auth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // check if the user is signed in and the length of the input is greater than 0.
    if (auth.currentUser && messageInput.length > 0) {
      const uid = signedInUser?.uid;

      // TODO: channel id or chat id
      // const cid = state.chatId ? state.chatId : state.channelId; 
      await addDoc(collection(db, 'messages'), {
        chatId: cid,
        createdAt: serverTimestamp(),
        sentBy: uid,
        text: messageInput
      })

      setMessageInput('');
    }
  };

  return (
    <div className='flex gap-3 items-center'>

      {/* search input field */}
      <div className='grow p-0.5 rounded-lg border border-black bg-white'>
        <form onSubmit={(e) => handleSubmit(e)}
          className='h-8 flex items-center justify-between'>
          <input type="text"
            value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
            className='grow px-2 py-1 outline-none'
          />
          <button type='submit' className='mr-2'>
            <PaperAirplaneIcon className='h-5 w-5'/>
          </button>
        </form>
      </div>
    </div>
  )
};

export default MessageInput;