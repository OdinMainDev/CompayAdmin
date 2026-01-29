import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

interface CopyTextareaProps {
  value?: string;
}

export function RenderCopyTextarea({ value }: CopyTextareaProps) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <div className="position-relative w-100">
      <div
        className="form-control"
        aria-readonly="true"
        style={{
          backgroundColor: '#f9fafb',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          lineHeight: 1.5,
          padding: '0.375rem 0.75rem',
          minHeight: 'calc((1.5em * 3) + (0.375rem * 2) + 2px)',
          minWidth: '200px',
        }}
      >
        <Button
          variant={copied ? 'warning' : 'outline-warning'}
          onClick={() => void handleCopy()}
          className="text-black flex-shrink-0"
          aria-label="Copy"
          style={{
            float: 'right',
            width: 36,
            height: 36,
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
        </Button>

        {value}
      </div>
    </div>
  );
}
