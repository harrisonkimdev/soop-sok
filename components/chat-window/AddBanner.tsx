'use client';

import { useState } from 'react';

import { useAppState } from '@/utils/AppStateProvider';
import { auth, db } from '@/utils/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import {
  BackspaceIcon
} from '@heroicons/react/24/outline';

const AddBanner = () => {
  const [content, setContent] = useState('');
  const [tagOption, setTagOption] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  const { state, dispatch } = useAppState();

  const addToList = () => {
    if (tagOptions.length < 5) {
      setTagOptions((prev) => {
        if (!prev.includes(tagOption)) {
          return [ ...prev, tagOption ];
        } else return [ ...prev ];
      });
    }
    else {
      // too many tag options
    }
  };

  const deleteFromList = (tagOption: string) => {
    if (tagOptions.length > 0) {
      setTagOptions((prev) => prev.filter(option => option !== tagOption));
    }
  };

  const redirectToFeaturesPage = () => {
    dispatch({ type: 'CURRENT_CHANNEL_COMPONENT', channelComponent: 'features' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (auth.currentUser && content.length > 0) {
      try {
        const bannerRef = await addDoc(collection(db, 'banners'), {
          cid: state.channelId,
          content,
          createdAt: serverTimestamp(),
          selected: false,
          tagOptions,
        });

        if (bannerRef) {
          dispatch({ type: 'ENTER_CHANNEL', channelId: state.channelId });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto
        border border-black rounded-lg bg-white
        flex flex-col gap-6
      '>
        {/* name */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="name">Content</label>
          <input type="text" id='name' name='name'
            value={ content } onChange={(e) => setContent(e.target.value)}
            className='
              border border-black px-2 py-1 rounded-lg
          '/>
        </div>

        {/* tag options */}
        <div>
          <div>
            <label htmlFor="tagOption">Tag Options</label>
            <div className='mt-2 flex gap-2'>
              <input type="text" id='tagOption' name='tagOption'
                value={tagOption} onChange={(e) => setTagOption(e.target.value)}
                className='grow border rounded-lg px-2 py-1'
              />
              <button type='button' onClick={() => { addToList(); setTagOption(''); }}
                className='px-2 py-1 border rounded-lg'
              >Add</button>
            </div>
          </div>

          {/* container for tag options */}
          <div>
            <div className='min-h-12 mt-3 p-3 border rounded-lg'>
              <div className='flex flex-col items-start gap-3'>
                { tagOptions.map((tagOption, index) => (
                  <div key={tagOption} className='w-full flex items-center justify-between'>
                    <p className='whitespace-nowrap'>
                      { `${index+1}. ${tagOption}` }
                    </p>
                    <div onClick={() => deleteFromList(tagOption)}>
                      <BackspaceIcon className='h-5 text-gray-500' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* instruction */}
            { tagOptions.length > 0 && (
              <p className='mt-2 px-1 text-gray-400 text-sm'>Other users would only be able to choose one of the avilable options</p>
            )}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2.5'>
        <div onClick={redirectToFeaturesPage} className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm text-center
        '> Cancel </div>

        <button type='submit' className='
          w-full py-2 bg-white
          border border-black rounded-lg shadow-sm
        '> Create </button>
      </div>
    </form>
  );
};

export default AddBanner;