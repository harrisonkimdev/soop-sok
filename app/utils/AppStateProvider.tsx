'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
} from 'react';

type TAvailableChannelComponents = (
  | 'lobby'
  | 'features'
  | 'create_chat'
  | 'chat_list'
  | 'user_list'
  | 'chat'
);

type TAvailablePrivateChatComponents = ('chat_window' | 'features');

interface AppState {
  currentPage: ('channel' | 'private_chat' | 'pages');
  activateChannelChat: boolean;
  activatePrivateChat: boolean;
  channelId: string;
  privateChatId: string;
  channelComponent: TAvailableChannelComponents;
  privateChatComponent: TAvailablePrivateChatComponents;
};

type Action = (
  | { type: 'SET_TO_CHANNEL' }
  | { type: 'SET_TO_PRIVATE_CHAT' }
  | { type: 'SET_TO_PAGES' }
  | { type: 'ENTER_CHANNEL', channelId: string }
  | { type: 'ENTER_PRIVATE_CHAT', privateChatId: string }
  | {
      type: 'CURRENT_CHANNEL_COMPONENT',
      channelComponent: TAvailableChannelComponents
    }
  | {
      type: 'CURRENT_PRIVATE_CHAT_COMPONENT',
      privateChatComponent: TAvailablePrivateChatComponents
    }
);

const initialState: AppState = {
  currentPage: 'pages',
  activateChannelChat: false,
  activatePrivateChat: false,
  channelId: '',
  privateChatId: '',
  channelComponent: 'lobby',
  privateChatComponent: 'chat_window'
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
} | undefined>(undefined);

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_TO_CHANNEL':
      return { ...state, currentPage: 'channel' };
    case 'SET_TO_PRIVATE_CHAT':
      return { ...state, currentPage: 'private_chat' };
    case 'SET_TO_PAGES':
      return { ...state, currentPage: 'pages' };
    case 'ENTER_CHANNEL':
      return {
        ...state,
        activateChannelChat: true,
        channelId: action.channelId
      };
    case 'ENTER_PRIVATE_CHAT':
      return {
        ...state,
        activatePrivateChat: true,
        channelId: action.privateChatId
      };
    case 'CURRENT_CHANNEL_COMPONENT':
      return {
        ...state,
        channelComponent: action.channelComponent
      };
    case 'CURRENT_PRIVATE_CHAT_COMPONENT':
      return {
        ...state,
        channelId: action.privateChatComponent
      };
    default:
      return state;
  }
};

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      { children }
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};