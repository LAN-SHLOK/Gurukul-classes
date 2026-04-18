"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
}

let sharedSocket: Socket | null = null;

export function useSocket(): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    // Log warning in development mode when socket URL is missing
    if (!socketUrl) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[Socket] NEXT_PUBLIC_SOCKET_URL is not configured. Real-time features are disabled. ' +
          'To enable real-time updates, add NEXT_PUBLIC_SOCKET_URL to your .env.local file.'
        );
      }
      return; // gracefully disabled if not configured
    }

    if (!sharedSocket) {
      sharedSocket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 30000,
        transports: ["websocket", "polling"],
        timeout: 10000,
      });
    }

    socketRef.current = sharedSocket;

    const onConnect = () => {
      setIsConnected(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('[Socket] Connected successfully');
      }
    };
    
    const onDisconnect = () => {
      setIsConnected(false);
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Socket] Disconnected from server');
      }
    };
    
    const onConnectError = (error: Error) => {
      console.error(
        '[Socket] Connection failed. Please check that NEXT_PUBLIC_SOCKET_URL is correctly configured ' +
        'and the socket server is running.',
        error
      );
    };
    
    const onReconnectAttempt = (attemptNumber: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Socket] Reconnection attempt ${attemptNumber}/5`);
      }
    };
    
    const onReconnectFailed = () => {
      console.error(
        '[Socket] Failed to reconnect after 5 attempts. Real-time features are unavailable. ' +
        'Please check your socket server configuration.'
      );
    };

    sharedSocket.on("connect", onConnect);
    sharedSocket.on("disconnect", onDisconnect);
    sharedSocket.on("connect_error", onConnectError);
    sharedSocket.on("reconnect_attempt", onReconnectAttempt);
    sharedSocket.on("reconnect_failed", onReconnectFailed);
    if (sharedSocket.connected) setIsConnected(true);

    return () => {
      sharedSocket?.off("connect", onConnect);
      sharedSocket?.off("disconnect", onDisconnect);
      sharedSocket?.off("connect_error", onConnectError);
      sharedSocket?.off("reconnect_attempt", onReconnectAttempt);
      sharedSocket?.off("reconnect_failed", onReconnectFailed);
    };
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef.current, isConnected, on, off };
}
