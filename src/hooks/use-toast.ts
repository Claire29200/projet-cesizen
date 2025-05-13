
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

export type ToasterToast = ToastT

// Type personnalisé pour faciliter l'utilisation des toasts dans l'application
export interface ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success" | "warning" | "security"
  duration?: number
}

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

// Liste des toasts actifs pour l'intégration avec toaster.tsx
const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToasterToastWithId = ToasterToast & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToastWithId
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToastWithId>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToastWithId[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Le cas où on dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Le cas où on dismiss un toast en particulier
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }

    case "REMOVE_TOAST": {
      const { toastId } = action

      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
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
  
  // Génération d'un ID unique pour le toast
  const id = genId()
  
  // Création du nouveau toast
  const newToast: ToasterToastWithId = {
    id,
    open: true,
    ...rest,
    title: sanitizedTitle,
    description: sanitizedDescription,
    variant,
    className: toastType.className,
    duration: rest.duration || toastType.duration,
  }
  
  dispatch({ type: actionTypes.ADD_TOAST, toast: newToast })
  
  // Utilisation en parallèle de sonner pour la compatibilité
  return sonnerToast(sanitizedTitle, {
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

toast.dismiss = (toastId?: string) => {
  dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toast,
    toasts: state.toasts,
    dismiss: toast.dismiss,
  }
}

export { useToast, toast }
