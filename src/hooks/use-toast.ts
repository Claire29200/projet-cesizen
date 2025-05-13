
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

export type ToasterToast = ToastT

const toastTypes = {
  default: {
    className: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full bg-background border",
    duration: 5000,
  },
  destructive: {
    className: "destructive group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border border-destructive bg-destructive text-destructive-foreground",
    duration: 7000,
  },
  success: {
    className: "success group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border border-green-500 bg-green-100 text-green-950",
    duration: 5000,
  },
  warning: {
    className: "warning group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border border-yellow-500 bg-yellow-100 text-yellow-950",
    duration: 5000,
  },
  security: {
    className: "security group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full border border-blue-500 bg-blue-100 text-blue-950",
    duration: 10000, // Plus long pour les alertes de sécurité
  }
}

type ToastProps = Omit<ToasterToast, "type"> & {
  variant?: keyof typeof toastTypes
}

function toast(props: ToastProps) {
  const { variant = "default", ...rest } = props
  const toastType = toastTypes[variant]
  
  // Sanitization des entrées pour les toasts
  let sanitizedTitle = typeof rest.title === 'string' ? 
    rest.title.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 
    rest.title;
  
  let sanitizedDescription = typeof rest.description === 'string' ? 
    rest.description.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 
    rest.description;
  
  return sonnerToast(sanitizedTitle, {
    ...rest,
    description: sanitizedDescription,
    className: toastType.className,
    duration: rest.duration || toastType.duration,
  })
}

toast.success = (message: string, options = {}) => {
  return toast({ title: message, variant: "success", ...options })
}

toast.warning = (message: string, options = {}) => {
  return toast({ title: message, variant: "warning", ...options })
}

toast.error = (message: string, options = {}) => {
  return toast({ title: message, variant: "destructive", ...options })
}

toast.security = (message: string, options = {}) => {
  return toast({ title: "Alerte de sécurité", description: message, variant: "security", ...options })
}

export { toast }

export function useToast() {
  return {
    toast,
  }
}
