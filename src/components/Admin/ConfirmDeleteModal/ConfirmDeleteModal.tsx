import React, { useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  message?: string;
  deletingQuery?: string;
  deletingField?: any;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteModal({
  isOpen,
  message = "Are you sure you want to delete ",
  deletingQuery = "",
  deletingField = "",
  onConfirm,
  onCancel,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel(); 
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-lg">
      <div ref={modalRef} className="bg-white p-4 md:p-6 rounded-xl w-[70%] md:w-[90%] max-w-[400px] shadow-xl border border-primary">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-rosario tracking-wide font-semibold">
            Confirm Delete
          </h2>
          <button
            className="rounded-full flex justify-center items-center text-white font-semibold w-8 h-8 p-2 bg-primary hover:bg-hoverPrimary"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>
        <p className="mb-6">
          {message}
          {deletingQuery && <span> {deletingQuery}</span>}
          {deletingField && (
            <span>
              {" "}
              <span className="font-semibold tracking-loose">
                {deletingField}
              </span>
            </span>
          )}
          ?
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-primary border-primary border-2 hover:bg-hoverSecondary bg-[#EEE6EC] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-primary text-white hover:bg-hoverPrimary rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
