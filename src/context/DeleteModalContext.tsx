"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type DeleteModalContextType = {
  isOpen: boolean; // modal open/close
  item: any | null; // which item to delete
  setItem:React.SetStateAction<React.Dispatch<any | null>>;
  openModal: (item: any) => void; // function to open modal
  closeModal: () => void; // function to close modal
};

const DeleteModalContext = createContext<DeleteModalContextType | undefined>(
  undefined
);

export const DeleteModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<any | null>(null);

  const openModal = (item: any) => {
    setItem(item);
    setIsOpen(true);
  };

  const closeModal = () => {
    setItem(null);
    setIsOpen(false);
  };

  return (
    <DeleteModalContext.Provider
      value={{ isOpen, item, setItem,openModal, closeModal }}
    >
      {children}
    </DeleteModalContext.Provider>
  );
};

export const useDeleteModal = () => {
  const context = useContext(DeleteModalContext);
  if (!context) {
    throw new Error("useDeleteModal must be used within DeleteModalProvider");
  }
  return context;
};
