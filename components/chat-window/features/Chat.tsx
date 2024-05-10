import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

import { formatTimeAgo } from '@/utils/utils';
import { TChat } from '@/types'

type ChatProps = {
  chat: TChat
};

const Chat = ({ chat }: ChatProps) => {
  const { dispatch } = useAppState();

  const enterChat = async () => {
    if (auth) {
      const statusRef = collection(db, 'status_board');
      await addDoc(statusRef, {
        cid: chat.id,
        displayName: auth.currentUser?.displayName,
        profilePicUrl: auth.currentUser?.photoURL,
        uid: auth.currentUser?.uid
      });
  
      dispatch({ type: 'ENTER_CHAT', chatId: chat.id });
    }
  };

  return (
    <div onClick={enterChat} className='
      px-3 py-2 rounded-lg bg-stone-100
      flex flex-col gap-1
    '>
      {/* name */}
      <div>
        <p className='line-clamp-1'>{ chat.name }</p>
      </div>
      
      {/* chat info: created_at */}
      <div className='flex justify-end'>
        <p className='text-sm'>{ formatTimeAgo(chat.createdAt) }</p>
      </div>

      {/* topic, buttons */}
      <div className='h-6 flex justify-between'>
        { chat.tag.length > 0 && (
          // bubble
          <div className='
            rounded-full px-4 py-1 bg-amber-500
            text-xs text-white
          '>
            <span>{ chat.tag }</span>
          </div>
        )}
      </div>
    </div>
  )
};

export default Chat;