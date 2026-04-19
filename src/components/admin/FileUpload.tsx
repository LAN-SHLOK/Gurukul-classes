"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Loader2, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string) => void;
  value?: string;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export default function FileUpload({ 
  onUpload, 
  value, 
  accept = ".pdf,.doc,.docx,.zip,.txt,image/*", 
  maxSizeMB = 50,
  label = "Upload File"
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File exceeds ${maxSizeMB}MB limit.`);
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
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => { setError(null); inputRef.current?.click(); }}
          disabled={loading}
          className="border-dashed border-2 border-white/10 h-32 w-48 flex flex-col items-center justify-center bg-white/5 text-white/40 hover:text-[#2D31FA] hover:border-[#2D31FA] transition-all rounded-[24px] disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-[#2D31FA]" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">UPLOADING...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 group-hover:-translate-y-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest mt-2">{label}</span>
            </>
          )}
        </button>

        {value && (
          <div className="relative w-48 h-32 rounded-[24px] overflow-hidden border-2 border-[#2D31FA]/30 flex-shrink-0 bg-[#2D31FA]/5 flex flex-col items-center justify-center p-4">
            {isImage(value) ? (
              <img
                src={value}
                alt="Preview"
                className="object-cover w-full h-full rounded-xl"
              />
            ) : (
              <div className="flex flex-col items-center text-center">
                <FileText className="w-10 h-10 text-[#2D31FA] mb-2" />
                <span className="text-[8px] font-bold text-[#2D31FA] uppercase tracking-tighter truncate max-w-full">
                  {value.split('/').pop()}
                </span>
                <div className="flex items-center gap-1 mt-1 text-[#2D31FA]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-[8px] font-black uppercase tracking-widest">READY</span>
                </div>
              </div>
            )}
            <button
              title="Remove"
              type="button"
              onClick={() => { onUpload(""); setError(null); }}
              className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-xl shadow-lg hover:bg-red-600 transition-all z-10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-wide bg-red-500/5 border border-red-500/10 p-2 rounded-lg">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </div>
      )}

      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-1">
        PDF · DOC · ZIP · IMG · MAX {maxSizeMB}MB
      </p>
    </div>
  );
}
