import Swal from "sweetalert2";

export interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "default" | "destructive" | "warning" | "success" | "info";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export class ConfirmationModal {
  static async show({
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default",
    onConfirm,
    onCancel,
  }: ConfirmationOptions): Promise<boolean> {
    
    let icon: "warning" | "error" | "success" | "info" | "question" = "question";
    
    // Define button styles based on type
    let confirmBtnClass = "px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all transform active:scale-95 focus:ring-2 focus:ring-offset-1 text-white";
    
    switch (type) {
      case "destructive":
        icon = "warning";
        confirmBtnClass += " bg-red-600 hover:bg-red-700 focus:ring-red-500 shadow-red-500/20";
        break;
      case "warning":
        icon = "warning";
        confirmBtnClass += " bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 shadow-amber-500/20";
        break;
      case "success":
        icon = "success";
        confirmBtnClass += " bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-500/20";
        break;
      case "info":
        icon = "info";
        confirmBtnClass += " bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-500/20";
        break;
      default:
        icon = "question";
        confirmBtnClass += " bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-blue-500/20";
    }

    const result = await Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      focusCancel: true,
      width: '24rem',
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-100 font-sans p-6 bg-white",
        title: "text-gray-900 text-xl font-bold mb-2 tracking-tight",
        htmlContainer: "text-gray-600 text-sm leading-relaxed mb-6",
        confirmButton: confirmBtnClass,
        cancelButton: "px-5 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all transform active:scale-95 hover:bg-gray-100 text-gray-700 bg-white border border-gray-300 hover:shadow-sm focus:ring-2 focus:ring-gray-200",
        actions: "gap-3 w-full flex justify-end mt-2",
        icon: "mb-4 border-0" // remove default border if any
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      if (onConfirm) {
        await onConfirm();
      }
      return true;
    } else {
      if (onCancel) {
        onCancel();
      }
      return false;
    }
  }

  static showDestructive(
    options: Omit<ConfirmationOptions, "type">
  ): Promise<boolean> {
    return this.show({
      ...options,
      type: "destructive",
      confirmText: options.confirmText || "Delete",
      title: options.title || "Confirm Deletion",
    });
  }

  static showWarning(
    options: Omit<ConfirmationOptions, "type">
  ): Promise<boolean> {
    return this.show({
      ...options,
      type: "warning",
      confirmText: options.confirmText || "Proceed",
      title: options.title || "Warning",
    });
  }

  static showSuccess(
    options: Omit<ConfirmationOptions, "type">
  ): Promise<boolean> {
    return this.show({
      ...options,
      type: "success",
      confirmText: options.confirmText || "OK",
      title: options.title || "Success",
    });
  }
}

export default ConfirmationModal;