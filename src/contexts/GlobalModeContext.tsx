import React, { createContext, useState, useContext } from 'react';

const ModeContext = createContext({
  isEditMode: false,
  setEditMode: (mode: boolean) => {}, 
  toggleEditMode: () => {},
});

export const GlobalModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isEditMode, setEditMode] = useState(false);
  
  const toggleEditMode = () => setEditMode(prev => !prev);

  return (
    <ModeContext.Provider 
      value={{ 
        isEditMode, 
        setEditMode: setEditMode, // 🔥 INI OBATNYA BRO!
        toggleEditMode 
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useGlobalMode = () => useContext(ModeContext);