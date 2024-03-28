//是一个上下文提供者，管理着钱包锁的状态，可能是指用户的加密钱包是否被锁定的状态。
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import { INACTIVITY_LIMIT } from '../utils/constants';



export interface WalletLockContextProps {
  isLocked: boolean;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  lockWallet: () => void;
}


export const WalletLockContext = createContext<WalletLockContextProps | undefined>(undefined);

interface WalletLockProviderProps {
  children: ReactNode;
}
export const WalletLockProvider = (props: WalletLockProviderProps) => {
  const { children } = props;
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const lockWallet = () => {
    const timestamp = Date.now();
    // const twentyMinutesAgo = timestamp - 20 * 60 * 1000;
    const twentyMinutesAgo = timestamp - INACTIVITY_LIMIT;
    storage.set({ lastActiveTime: twentyMinutesAgo });
    storage.remove('appState');
    setIsLocked(true);
  };

  useEffect(() => {
    const checkLockState = () => {
      storage.get(['lastActiveTime', 'encryptedKeys'], (result) => {
        const currentTime = Date.now();
        const lastActiveTime = result.lastActiveTime;

        if (!result.encryptedKeys) {
          setIsLocked(false);
          return;
        }

        if (currentTime - lastActiveTime > INACTIVITY_LIMIT) {
          storage.remove('paymentUtxos');
          // console.log('fresh');
          lockWallet();
        } else {
          setIsLocked(false);
        }
      });
    };

    checkLockState();

    const interval = setInterval(checkLockState, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <WalletLockContext.Provider value={{ isLocked, setIsLocked, lockWallet }}>{children}</WalletLockContext.Provider>
  );
};
