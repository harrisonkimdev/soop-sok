'use client';

import {
  TextField, Button,
} from '@mui/material';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppState } from '@/utils/AppStateProvider';
import { auth } from '@/db/firebase';
import { addBanner } from '@/db/services';

import {
  BackspaceIcon
} from '@heroicons/react/24/outline';

type pageProps = {
  params: {
    type: string,
    id: string,
  }
};

const Page = ({ params }: pageProps) => {
  const [bannerContent, setBannerContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagOptions, setTagOptions] = useState<string[]>([]);

  const router = useRouter();

  const { state, dispatch } = useAppState();

  const addToList = () => {
    if (tagOptions.length < 5) {
      setTagOptions((prev) => {
        if (!prev.includes(tagInput)) {
          return [ ...prev, tagInput ];
        } else return [ ...prev ];
      });
    }
    else {
      // TODO: dialog - too many tag options.
    }
  };

  const deleteFromList = (tagOption: string) => {
    if (auth && tagOptions.length > 0) {
      setTagOptions((prev) => prev.filter(option => option !== tagOption));
    }
  };

  const redirectToFeaturesPage = () => {
    if (auth) {
      router.push(`/chats/${params.type}/${params.id}/features`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (auth && auth.currentUser && bannerContent.length > 0) {
      try {

        const res = await addBanner(params.id, bannerContent, tagOptions);

        // 

        if (res) {
          router.push(`/chats/channel/${params.id}`);
        }
      } catch (err) {
        console.error(err);
        dispatch({ type: 'SHOW_MESSAGE_DIALOG', payload: { show: true, type: 'general' } });
      }
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='h-full flex flex-col gap-4'>
      <div className='
        grow p-4 overflow-y-auto rounded-lg bg-white
        flex flex-col gap-2
      '>
        {/* name */}
        <TextField id='outlined-basic' label='Banner' variant='outlined'
          value={bannerContent} onChange={(e) => setBannerContent(e.target.value)}
        />

        {/* tag options */}
        <div className='flex flex-col gap-4'>
          <div className='mt-2 flex gap-2'>
            <TextField id='outlined-basic' label='Tag Input' variant='outlined'
              value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              className='grow'
            />
            <Button variant='outlined' onClick={() => { addToList(); setTagInput(''); }}>
              Add
            </Button>
          </div>

          {/* container for tag options */}
          <div>
            <div className='min-h-14 p-3 border border-gray-300 rounded-sm'>
              <div className='flex flex-col items-start gap-3'>
                { tagOptions.map((tagOption, index) => (
                  <div key={`${index}-${tagOption}`} className='w-full flex items-center justify-between'>
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
        <button type='button' onClick={redirectToFeaturesPage} className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Cancel </button>

        <button type='submit' className='
          w-full py-4 rounded-lg shadow-sm bg-white
          transition duration-300 ease-in-out hover:bg-stone-200
        '> Create </button>
      </div>
    </form>
  );
};

export default Page;