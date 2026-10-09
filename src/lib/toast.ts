export type ToastType = "success" | "error" | "info";

export type ToastOptions = {
  title?: string;
  duration?: number;
  action?: { label: string; href: string };
};

function show(type: ToastType, message: string, options: ToastOptions = {}) {
  document.dispatchEvent(
    new CustomEvent("toast:show", { detail: { type, message, ...options } }),
  );
}

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    show("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    show("error", message, options),
  info: (message: string, options?: ToastOptions) =>
    show("info", message, options),
};
