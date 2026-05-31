import React, { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { animate, motion } from "framer-motion";

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`min-w-[300px] flex items-center px-6 py-4 rounded-xl shadow-2xl gap-3 ${
        toast.type === "success" 
          ? "bg-green-600 text-white" 
          : "bg-red-600 text-white"
      }`}
    >
      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
        {toast.type === "success" ? (
          <CheckCircle2 className="h-4 w-4 text-white" />
        ) : (
          <XCircle className="h-4 w-4 text-white" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">{toast.type === "success" ? "Thành công!" : "Lỗi!"}</p>
        <p className="text-xs text-white/80">{toast.message}</p>
      </div>
      <button 
        onClick={() => removeToast(toast.id)}
        className="ml-4 flex-shrink-0 text-white/50 hover:text-white transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
