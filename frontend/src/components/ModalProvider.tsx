"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type ModalType = 'alert' | 'confirm' | 'success' | 'error' | 'warning';

interface ModalOptions {
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const showModal = (opts: ModalOptions) => {
    setOptions({ type: 'alert', ...opts });
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setTimeout(() => setOptions(null), 300); // Wait for transition
  };

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    hideModal();
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    hideModal();
  };

  const getIcon = () => {
    switch (options?.type) {
      case 'success':
        return <CheckCircle2 className="text-green-500 w-12 h-12 mb-4 mx-auto" />;
      case 'error':
        return <AlertCircle className="text-red-500 w-12 h-12 mb-4 mx-auto" />;
      case 'warning':
      case 'confirm':
        return <AlertTriangle className="text-yellow-500 w-12 h-12 mb-4 mx-auto" />;
      default:
        return <Info className="text-blue-500 w-12 h-12 mb-4 mx-auto" />;
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCancel}
          />
          <div className="relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl transform transition-all text-center animate-in fade-in zoom-in-95 duration-200">
            {getIcon()}
            
            {options.title && (
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {options.title}
              </h3>
            )}
            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
              {options.message}
            </p>
            <div className="flex gap-3 justify-center">
              {options.type === 'confirm' && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                >
                  {options.cancelText || 'Cancel'}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 transition-colors w-full"
              >
                {options.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
