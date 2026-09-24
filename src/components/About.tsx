import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import type { ReactNode } from "react";

type AboutProps = {
  open: boolean;
  onClose: () => void;
};

type LinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

function Link({ href, className, children }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export function About({ open, onClose }: AboutProps) {
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            enter="transition duration-200 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <DialogPanel className="border-border-primary bg-bg-primary flex max-h-[calc(100svh-2rem)] w-full max-w-lg flex-col overflow-y-auto rounded-lg border shadow-2xl">
              <div className="border-border-muted flex min-h-14 shrink-0 items-center justify-between border-b px-4">
                <DialogTitle className="font-display text-text-primary font-semibold">About</DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-text-primary hover:bg-bg-hover border-border-primary grid size-9 place-items-center rounded border transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                >
                  <IoClose />
                </button>
              </div>
              <div className="text-text-primary space-y-4 p-5 text-sm leading-6">
                <p>
                  本ツールでは向聴(シャンテン)数や受け入れ枚数、一人麻雀の聴牌確率・和了確率・点数期待値を計算できます。確率・期待値計算では一人麻雀をマルコフ決定過程でモデル化し、モンテカルロ法ではなく動的計画法によって正確な値を計算します。
                </p>
                <dl className="space-y-2">
                  <div>
                    <dt>アルゴリズム解説</dt>
                    <dd>
                      <Link
                        href={import.meta.env.VITE_ALGORITHM_REFERENCE_URL}
                        className="text-teal-400 underline underline-offset-2"
                      >
                        tomohxx/mahjong-algorithm-book
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt>牌画像</dt>
                    <dd>
                      <Link
                        href={import.meta.env.VITE_TILE_IMAGE_SOURCE_URL}
                        className="text-teal-400 underline underline-offset-2"
                      >
                        FluffyStuff/riichi-mahjong-tiles
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>
              <footer className="border-border-muted flex flex-row items-center justify-between gap-3 border-t px-5 py-4">
                <small className="text-text-muted">Copyright &copy; 2026 tomohxx</small>
                <div className="flex items-center gap-2">
                  <Link
                    href={import.meta.env.VITE_GITHUB_REPOSITORY_URL}
                    className="text-text-primary hover:bg-bg-hover grid size-9 place-items-center rounded border border-transparent transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                  >
                    <FaGithub aria-hidden="true" className="size-5" />
                  </Link>
                  <Link
                    href={import.meta.env.VITE_CONTACT_X_URL}
                    className="text-text-primary hover:bg-bg-hover grid size-9 place-items-center rounded border border-transparent transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
                  >
                    <FaXTwitter aria-hidden="true" className="size-5" />
                  </Link>
                </div>
              </footer>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
