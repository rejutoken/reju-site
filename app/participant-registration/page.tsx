"use client";

import { useState } from "react";

type Props = {
  title: string;
  type: string;
  description: string;
};

export default function ParticipantRegistrationPage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Submitting registration...");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/register-participant", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setStatus(data?.error || "Registration failed.");
        return;
      }

      setStatus(`Registration received. Participant ID: ${data.participantId}`);
      form.reset();
    } catch (error) {
      console.error("CLIENT REGISTRATION ERROR:", error);
      setStatus("Registration failed. Please try again.");
    }
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img src="/logo.png" alt="REJU" style={logoStyle} />

          <p style={eyebrowStyle}>REJU Participant Registry</p>

          <h1 style={titleStyle}>Participant Registration</h1>

          <p style={descriptionStyle}>
            Please complete this registration once. This creates your REJU
            participant record for program access, verification, and future
            transformation tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <input
              name="firstName"
              placeholder="First Name"
              required
              style={inputStyle}
            />

            <input
              name="lastName"
              placeholder="Last Name"
              required
              style={inputStyle}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="Phone (optional)"
            style={inputStyle}
          />

          <input
            name="telegram"
            placeholder="Telegram username (optional)"
            style={inputStyle}
          />

          <input
            name="address1"
            placeholder="Address 1 (optional)"
            style={inputStyle}
          />

          <input
            name="address2"
            placeholder="Address 2 (optional)"
            style={inputStyle}
          />

          <div style={gridStyle}>
            <input
              name="city"
              placeholder="City"
              required
              style={inputStyle}
            />

            <input
              name="stateProvince"
              placeholder="State / Province"
              required
              style={inputStyle}
            />
          </div>

          <div style={gridStyle}>
            <input
              name="zipPostalCode"
              placeholder="Zip / Postal Code (optional)"
              style={inputStyle}
            />

            <input
              name="country"
              placeholder="Country"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={buttonStyle}>
            Submit Registration
          </button>
        </form>

        {status && (
          <p
            style={{
              color: status.toLowerCase().includes("received")
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
      </section>
    </main>
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
  color: "#d1d5db",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "760px",
  backgroundColor: "#120d08",
  border: "1px solid #6f5320",
  borderRadius: "20px",
  padding: "40px",
  boxSizing: "border-box",
  boxShadow: "0 0 30px rgba(245,194,107,0.08)",
};

const logoStyle: React.CSSProperties = {
  width: "220px",
  maxWidth: "100%",
  marginBottom: "20px",
};

const eyebrowStyle: React.CSSProperties = {
  color: "#f5d27a",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  marginBottom: "14px",
};

const titleStyle: React.CSSProperties = {
  color: "#f5d27a",
  fontSize: "38px",
  marginBottom: "12px",
};

const descriptionStyle: React.CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.6",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
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
  marginTop: "8px",
};
