import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

interface CopyInputProps {
  value?: string;
}

export function RenderCopyInput({ value }: CopyInputProps) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Form.Control
        type="text"
        value={value}
        disabled
        style={{ backgroundColor: "#f9fafb" }}
      />

      <Button
        variant={copied ? "warning" : "outline-warning"}
        onClick={handleCopy}
        style={{ whiteSpace: "nowrap" }}
      >
        <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
      </Button>
    </div>
  );
}
