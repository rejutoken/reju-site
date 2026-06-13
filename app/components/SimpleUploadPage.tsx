"use client";

import { useState } from "react";

type Props = {
  title: string;
  type: string;
  description: string;
};

export default function SimpleUploadPage({
  title,
  type,
  description,
}: Props) {
  const [selectedFile, setSelectedFile] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Uploading...");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", type);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setStatus(data?.error || "Upload failed.");
        return;
      }

      setStatus("Upload successful. Your verification has been submitted.");
      setSelectedFile("");
      form.reset();
    } catch (error) {
      console.error("CLIENT UPLOAD ERROR:", error);
      setStatus("Upload failed. Please try again.");
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img src="/logo.png" alt="REJU" style={logoStyle} />

          <h1 style={titleStyle}>{title}</h1>

          <p style={descriptionStyle}>{description}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            style={inputStyle}
          />

          <textarea
            name="notes"
            placeholder="Notes, transaction ID, wallet, or reference"
            rows={5}
            style={{
              ...inputStyle,
              minHeight: "160px",
              resize: "vertical",
            }}
          />

          <label htmlFor="fileUpload" style={buttonStyle}>
            1. Choose File
            {selectedFile ? `, ${selectedFile}` : ", No file chosen"}
          </label>

          <input
            id="fileUpload"
            type="file"
            name="file"
            required
            style={{ display: "none" }}
            onChange={(e) => {
              const fileName = e.target.files?.[0]?.name || "";
              setSelectedFile(fileName);
            }}
          />

          <p style={helperTextStyle}>
            Upload receipt, screenshot, transaction confirmation, or verification proof.
          </p>

          <button type="submit" style={buttonStyle}>
            2. Submit Upload
          </button>
        </form>

        {status && (
          <p
            style={{
              color: status.toLowerCase().includes("successful")
                ? "#86efac"
                : "#f5d27a",
              marginTop: "20px",
              textAlign: "center",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#050505",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  fontFamily: "Arial",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "700px",
  backgroundColor: "#120d08",
  border: "1px solid #6f5320",
  borderRadius: "20px",
  padding: "40px",
  boxSizing: "border-box",
};

const logoStyle: React.CSSProperties = {
  width: "220px",
  maxWidth: "100%",
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  color: "#f5d27a",
  fontSize: "34px",
  marginBottom: "12px",
};

const descriptionStyle: React.CSSProperties = {
  color: "#d6b96b",
  fontSize: "18px",
  lineHeight: "1.5",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: "18px",
  border: "1px solid rgba(245,194,107,0.35)",
  background: "#120700",
  color: "#d1d5db",
  fontSize: "16px",
  outline: "none",
  boxShadow: "0 0 15px rgba(245,194,107,0.08)",
  marginBottom: "18px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "18px",
  backgroundColor: "#f5d27a",
  color: "black",
  border: "none",
  borderRadius: "14px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  textAlign: "center",
  boxSizing: "border-box",
  marginBottom: "18px",
};

const helperTextStyle: React.CSSProperties = {
  marginTop: "-6px",
  marginBottom: "18px",
  color: "#9ca3af",
  fontSize: "14px",
  textAlign: "center",
};