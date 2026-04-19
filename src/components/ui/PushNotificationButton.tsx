"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";

export default function PushNotificationButton({ studentId }: { studentId?: string }) {
  const [status, setStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) { setStatus("unsupported"); return; }
    setStatus(Notification.permission as any);
  }, []);

  const enable = async () => {
    if (!("Notification" in window)) {
      console.warn("[Push] Notifications not supported by this browser.");
      return;
    }
    
    // Safety check for non-localhost/non-https
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      console.error("[Push] Notifications require HTTPS or Localhost.");
      alert("Browser notifications only work on HTTPS or Localhost.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("[Push] Requesting permission...");
      const permission = await Notification.requestPermission();
      setStatus(permission as any);
      console.log("[Push] Permission status:", permission);

      if (permission === "granted") {
        // Show a test notification immediately
        new Notification("Gurukul Classes", {
          body: "Notifications enabled! You'll get updates about schedules and events.",
          icon: "/logo.png",
        });

        // Register with server if service worker available
        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            console.log("[Push] ServiceWorker ready. Subscribing...");
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
                "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
              ),
            });
            
            console.log("[Push] Subscription successful. Sending to server...");
            await fetch("/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscription: sub.toJSON(), student_id: studentId }),
            });
            console.log("[Push] Server sync complete.");
          } catch (err) {
            console.error("[Push] Subscription failed:", err);
          }
        } else {
          console.warn("[Push] Service Worker not found in navigator.");
        }
      } else if (permission === "denied") {
        alert("Notifications are blocked in your browser settings. Please click the lock icon in the URL bar to unblock them.");
      }
    } catch (e) {
      console.error("[Push] Critical Error:", e);
    }
    setLoading(false);
  };

  if (status === "unsupported") return null;

  return (
    <button
      onClick={status === "granted" ? undefined : enable}
      disabled={loading || status === "denied"}
      className={`press flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
        status === "granted"
          ? "bg-green-500/10 border border-green-500/20 text-green-400 cursor-default"
          : status === "denied"
          ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
          : "bg-[#2D31FA]/10 border border-[#2D31FA]/20 text-[#2D31FA] hover:bg-[#2D31FA]/20"
      }`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-[#2D31FA]/30 border-t-[#2D31FA] rounded-full animate-spin" />
      ) : status === "granted" ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Bell className="w-3.5 h-3.5" />
      )}
      {status === "granted" ? "Notifications On" : status === "denied" ? "Notifications Blocked" : "Enable Notifications"}
    </button>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}
