// src/contexts/SidePanelContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useGlobalMode } from './GlobalModeContext';

interface SidePanelState {
  isOpen: boolean;
  isMinimized: boolean;
  content: ReactNode | null;
  openPanel: (title: string, content: ReactNode) => void;
  closePanel: () => void;
  minimizePanel: () => void;
  restorePanel: () => void;
}

const SidePanelContext = createContext<SidePanelState | undefined>(undefined);

export function SidePanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const { isEditMode } = useGlobalMode();

  const openPanel = (newContent: ReactNode) => {
    setContent(newContent);
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closePanel = () => {
    setIsOpen(false);
    setIsMinimized(false);
    // Opsional: delay 300ms biar animasi transisi tutupnya mulus sebelum DOM form dihancurkan
    setTimeout(() => setContent(null), 300);
  };

  const minimizePanel = () => setIsMinimized(true);
  
  const restorePanel = () => setIsMinimized(false);

  useEffect(() => {
    // Jika mode edit dimatikan secara global, paksa panel untuk menutup diri
    if (!isEditMode && isOpen) {
      closePanel();
    }
  }, [isEditMode, isOpen]);

  return (
    <SidePanelContext.Provider
      value={{ isOpen, isMinimized, content, openPanel, closePanel, minimizePanel, restorePanel }}
    >
      {children}
    </SidePanelContext.Provider>
  );
}

export function useSidePanel() {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error('useSidePanel harus digunakan di dalam SidePanelProvider');
  }
  return context;
}