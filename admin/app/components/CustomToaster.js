"use client";
import { Toaster, toast } from "react-hot-toast";

const TOAST_TYPES = {
  success: {
    progress: "bg-green",
    icon: <i className="ri-verified-badge-fill text-2xl text-green"></i>,
  },
  error: {
    progress: "bg-red",
    icon: <i className="ri-close-circle-fill text-2xl text-red"></i>,
  },
};

export const showToast = (type, message) => {
  const toastType = TOAST_TYPES[type] || TOAST_TYPES.success;

  toast.custom(
    (t) => (
      <div
        onClick={() => toast.dismiss(t.id)}

        className={`relative flex items-center justify-center gap-4
          bg-white rounded-lg text-gray text-center h-16 w-xs px-4 
           transition-all duration-300 cursor-pointer overflow-hidden

          ${t.visible ? "animate-toast-in" : "animate-toast-out"} `} >

        <div>{toastType.icon}</div>
        <p className=" text-sm font-medium">{message}</p>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 overflow-hidden">
          <div className={`h-full ${toastType.progress} animate-progress`} ></div>
        </div>

      </div>
    ),
    {
      duration: 3000,
    }
  );
};

const CustomToaster = () => {

  return (
    <>
      <Toaster position="top-center"
        containerStyle={{
          top: 8,
        }}
      />
      <style jsx global>{`

        @keyframes toast-in {
          0% {
            opacity: 0;
            transform: translateX(50px) scale(0.95);
          }
          40% {
            opacity: 1;
            transform: translateX(0px) scale(1.02);
          }
          55% {
            transform: translateX(-6px);
          }
          70% {
            transform: translateX(4px);
          }
          85% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toast-out {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(60px) scale(0.95);
          }
        }

        .animate-toast-in {
          animation: toast-in 0.5s ease-out forwards;
        }
        .animate-toast-out {
          animation: toast-out 0.3s ease-in forwards;
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </>
  );
};

export default CustomToaster;
