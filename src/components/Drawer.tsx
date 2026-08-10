import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import type { ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({ open, title, onClose, children }: DrawerProps) {
  return (
    <Transition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        <TransitionChild
          enter="transition-opacity duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-end sm:items-stretch sm:justify-end">
          <TransitionChild
            enter="transition duration-200 ease-out"
            enterFrom="translate-y-full sm:translate-x-full sm:translate-y-0"
            enterTo="translate-y-0 sm:translate-x-0"
            leave="transition duration-150 ease-in"
            leaveFrom="translate-y-0 sm:translate-x-0"
            leaveTo="translate-y-full sm:translate-x-full sm:translate-y-0"
          >
            <DialogPanel className="flex max-h-[90svh] w-full flex-col rounded-t-lg border border-zinc-700 bg-zinc-950 shadow-2xl sm:h-full sm:max-h-none sm:max-w-xl sm:rounded-none sm:border-y-0 sm:border-r-0 lg:max-w-2xl">
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-4">
                <DialogTitle className="font-display text-text-primary font-semibold">{title}</DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-text-primary hover:text-text-primary hover:bg-bg-hover grid size-9 place-items-center rounded transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                >
                  <IoClose />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
