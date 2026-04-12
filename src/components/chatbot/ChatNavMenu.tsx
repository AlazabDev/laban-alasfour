import { useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./types";

interface ChatNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseChat: () => void;
}

export const ChatNavMenu = ({ isOpen, onClose, onCloseChat }: ChatNavMenuProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-3 top-[calc(100%-2px)] z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <div className="border-b border-border/70 bg-muted/40 px-4 py-3 text-right" dir="rtl">
        <p className="text-sm font-semibold text-foreground">انتقل سريعاً داخل المتجر</p>
        <p className="mt-1 text-xs text-muted-foreground">الخشب، الإضاءة، وتجربة المنتج قبل الشراء.</p>
      </div>
      <div className="max-h-72 overflow-y-auto py-1" dir="rtl">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            onClick={() => {
              onClose();
              onCloseChat();
              navigate(item.href);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-right text-sm text-foreground transition-colors hover:bg-muted"
          >
            <span className="text-base">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
