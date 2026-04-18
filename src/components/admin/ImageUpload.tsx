"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({ onUpload, value }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, GIF allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File exceeds 5MB limit.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Try again.");
        return;
      }

      const url = data.secure_url || data.url;
      if (!url) { setError("No URL returned."); return; }
      console.log("[Upload] Success, URL:", url);
      onUpload(url);
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-start gap-4 flex-wrap">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => { setError(null); inputRef.current?.click(); }}
          disabled={loading}
          className="border-dashed border-2 border-white/10 h-32 w-40 flex flex-col items-center justify-center bg-white/5 text-white/40 hover:text-[#2D31FA] hover:border-[#2D31FA] transition-all rounded-[24px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-[#2D31FA]" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">UPLOADING...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-8 h-8" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">UPLOAD MEDIA</span>
            </>
          )}
        </button>

        {value && (
          <div className="relative w-32 h-32 rounded-[24px] overflow-hidden border-2 border-white/10 flex-shrink-0 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            <button
              title="Remove image"
              type="button"
              onClick={() => { onUpload(""); setError(null); }}
              className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-xl shadow-lg hover:bg-red-600 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-wide">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
        JPG · PNG · WEBP · GIF · Max 5MB
      </p>
    </div>
  );
}
