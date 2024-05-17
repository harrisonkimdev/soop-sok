import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import {
  collection, doc,
  query, where, orderBy, limit,
  getDoc, getDocs
} from 'firebase/firestore';

import { formatTimeAgo } from '@/utils/utils';
import { TMessage, TPrivateChat, TUser } from '@/types';

type PrivateChatProps = {
  privateChat: TPrivateChat
};

const PrivateChat = ({ privateChat } : PrivateChatProps ) => {
  const [toUser, setToUser] = useState<TUser>();
  const [latestMessage, setLatestMessage] = useState<TMessage>();

  const router = useRouter();

  const { state, dispatch } = useAppState();

  // fetch user data based on the given user id,
  // or, store user data into the private_chat collection.
  useEffect(() => {
    const fetchToUser = async () => {
      if (auth && auth.currentUser) {
        const uid = privateChat.to === auth.currentUser.uid ?
          privateChat.from : privateChat.to;

        try {  
          const userSnapshot = await getDoc(doc(db, 'users', uid));
          if (userSnapshot.exists()) {
            const data = { ...userSnapshot.data() } as TUser;
            setToUser(data);
          }
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      }
    };
    const fetchLatestMessage = async () => {
      if (auth) {
        const messageQuery = query(collection(db, 'messages'),
          where('cid', '==', privateChat.id),
          orderBy('createdAt', 'desc'),
          limit(1)
        );

        try {
          const messageSnapshot = await getDocs(messageQuery);
          if (!messageSnapshot.empty) {
            const data = {
              id: messageSnapshot.docs[0].id,
              ...messageSnapshot.docs[0].data()
            } as TMessage
            setLatestMessage(data);
          }
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_MESSAGE_DIALOG_TYPE', payload: 'data_retrieval' });
          dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: true });
        }
      }
    };

    const fetchToUserAndLatestMessage = async () => {
      await Promise.all([fetchToUser(), fetchLatestMessage()]);
      // setIsLoading(false);
    };

    fetchToUserAndLatestMessage();
  }, [dispatch, privateChat]);

  // fetch the latest message associated with this private chat
  // to display when it is sent and the content of it.

  const enterPrivateChat = () => {
    if (auth && auth.currentUser) {
      router.push(`/chats/private-chat/${privateChat.id}`);
    }
  };

  return (
    <div onClick={enterPrivateChat}>
      <div className='
        p-4 rounded-lg shadow-sm bg-white
        flex gap-3 items-center
      '>
        { toUser && (
          <Image
            src={toUser?.photoURL} alt=''
            width={1324} height={1827}
            className='object-cover w-16 h-16 rounded-full'
          />
        )}

        <div className='grow w-min'>
          <div className='flex justify-between'>
            {/* Sender's name. */}
            <p className='font-medium'>{ toUser?.displayName }</p>

            {/* the time last message was received. */}
            { latestMessage && (
              <p>{ formatTimeAgo(latestMessage?.createdAt) }</p>
            )}
          </div>

          {/* the content of the last message. */}
          <p className='mt-1 h-[3rem] overflow-hidden line-clamp-2'>
            { latestMessage?.text }
          </p>
        </div>
      </div>
    </div>
  )
};

export default PrivateChat;