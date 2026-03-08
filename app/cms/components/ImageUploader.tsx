"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  currentUrl?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ currentUrl, onUpload, label = "Upload Image" }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);
    setError(null);

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>{label}</label>
      
      {currentUrl && (
        <div style={{ marginBottom: "10px" }}>
          <img 
            src={currentUrl} 
            alt="Preview" 
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ fontSize: "14px" }}
      />
      {uploading && <span style={{ marginLeft: "10px", color: "#666" }}>Uploading...</span>}
      {error && <div style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>{error}</div>}
    </div>
  );
}
