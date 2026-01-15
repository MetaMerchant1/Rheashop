"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X, User, LogOut, Settings, Package } from "lucide-react";
import { TR } from "@/lib/constants";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navigation: { name: string; href: string }[];
}

export function MobileMenu({ open, onClose, navigation }: MobileMenuProps) {
  const { data: session } = useSession();

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <DialogPanel className="fixed inset-y-0 left-0 w-full max-w-xs bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700">
                  <span className="text-xl font-bold text-white">R</span>
                </div>
                <span className="text-xl font-bold text-stone-900">
                  Rhea Coffee
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-stone-700 hover:bg-stone-100"
                onClick={onClose}
              >
                <span className="sr-only">Menüyü kapat</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-stone-200">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-stone-900 hover:bg-stone-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  {session ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-sm text-stone-500">
                        {session.user?.name || session.user?.email}
                      </div>
                      <Link
                        href="/hesabim"
                        onClick={onClose}
                        className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-stone-900 hover:bg-stone-50"
                      >
                        <User className="h-5 w-5 text-stone-500" />
                        {TR.account.myAccount}
                      </Link>
                      <Link
                        href="/hesabim/siparislerim"
                        onClick={onClose}
                        className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-stone-900 hover:bg-stone-50"
                      >
                        <Package className="h-5 w-5 text-stone-500" />
                        {TR.account.orders}
                      </Link>
                      <Link
                        href="/hesabim/ayarlar"
                        onClick={onClose}
                        className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-stone-900 hover:bg-stone-50"
                      >
                        <Settings className="h-5 w-5 text-stone-500" />
                        {TR.account.settings}
                      </Link>
                      {session.user?.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={onClose}
                          className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-amber-700 hover:bg-amber-50"
                        >
                          <Settings className="h-5 w-5" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          onClose();
                        }}
                        className="-mx-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        {TR.common.logout}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/giris"
                        onClick={onClose}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-stone-900 hover:bg-stone-50"
                      >
                        {TR.common.login}
                      </Link>
                      <Link
                        href="/kayit"
                        onClick={onClose}
                        className="-mx-3 block rounded-lg bg-amber-700 px-3 py-2.5 text-center text-base font-medium text-white hover:bg-amber-800"
                      >
                        {TR.common.register}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
