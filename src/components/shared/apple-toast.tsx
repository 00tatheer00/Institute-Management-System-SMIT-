"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

// Global Event Dispatcher for Toasts
const listeners: Array<(toast: ToastMessage) => void> = [];

export const toast = {
  success: (title: string, description?: string, duration = 4000) => {
    emit({ id: Math.random().toString(36).substring(2, 9), type: "success", title, description, duration });
  },
  error: (title: string, description?: string, duration = 4500) => {
    emit({ id: Math.random().toString(36).substring(2, 9), type: "error", title, description, duration });
  },
  info: (title: string, description?: string, duration = 3500) => {
    emit({ id: Math.random().toString(36).substring(2, 9), type: "info", title, description, duration });
  },
  warning: (title: string, description?: string, duration = 4000) => {
    emit({ id: Math.random().toString(36).substring(2, 9), type: "warning", title, description, duration });
  },
};

function emit(toast: ToastMessage) {
  listeners.forEach((listener) => listener(toast));
}

export function AppleToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (newToast: ToastMessage) => {
      setToasts((prev) => [newToast, ...prev].slice(0, 4));

      // Auto dismiss
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration || 4000);
    };

    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-[#0071e3] shrink-0" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full select-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="pointer-events-auto w-full rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-[0_12px_30px_rgba(0,0,0,0.12)] p-3.5 flex items-start gap-3 relative overflow-hidden"
          >
            {/* Top Micro Accent Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-0.5 ${
                t.type === "success"
                  ? "bg-emerald-500"
                  : t.type === "error"
                  ? "bg-rose-500"
                  : t.type === "warning"
                  ? "bg-amber-500"
                  : "bg-[#0071e3]"
              }`}
            />

            <div className="mt-0.5">{getIcon(t.type)}</div>

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {t.title}
              </h4>
              {t.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {t.description}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
