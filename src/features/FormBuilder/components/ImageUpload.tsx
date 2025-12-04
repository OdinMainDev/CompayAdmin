import { useEffect, useState } from 'react';
import { Button, Form, Image, Stack } from 'react-bootstrap';

interface ImageUploadProps {
  label: string;
  value?: File | string | null;
  onChange: (file: File | null) => void;
  helperText?: string;
  required?: boolean;
}

const ImageUpload = ({ label, value, onChange, helperText, required }: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof value === 'string') {
      setPreviewUrl(value);
      return () => undefined;
    }
    setPreviewUrl(null);
    return () => undefined;
  }, [value]);

  const clear = () => onChange(null);

  return (
    <div className="image-input">
      <Form.Label className="fw-semibold">{label}</Form.Label>
      <Stack direction="horizontal" gap={3} className="align-items-center flex-wrap">
        <div className="rounded bg-light p-2 d-flex align-items-center justify-content-center">
          <Image
            src={
              previewUrl ??
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="12" fill="%23edf1f7"/><path d="M48 20c15.464 0 28 12.536 28 28S63.464 76 48 76 20 63.464 20 48 32.536 20 48 20Zm0 4C34.745 24 24 34.745 24 48s10.745 24 24 24 24-10.745 24-24S61.255 24 48 24Zm0 10a2 2 0 0 1 1.994 1.85L50 36v10h10a2 2 0 0 1 1.994 1.85L62 48a2 2 0 0 1-1.85 1.994L60 50H50v10a2 2 0 0 1-1.85 1.994L48 62a2 2 0 0 1-1.994-1.85L46 60V50H36a2 2 0 0 1-1.994-1.85L34 48a2 2 0 0 1 1.85-1.994L36 46h10V36a2 2 0 0 1 2-2Z" fill="%232e3650"/></svg>'
            }
            alt={label}
            width={96}
            height={96}
            className="rounded border"
          />
        </div>
        <div className="flex-grow-1">
          <Form.Control
            type="file"
            accept="image/*"
            required={required}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
          {helperText && <Form.Text className="text-muted">{helperText}</Form.Text>}
        </div>
        {previewUrl && (
          <Button variant="outline-secondary" size="sm" onClick={clear}>
            Очистить
          </Button>
        )}
      </Stack>
    </div>
  );
};

export default ImageUpload;
