import { useEffect, useMemo } from 'react';
import { Button, Form, Image, Stack } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { IField } from '../../form-core/domain/field/IField';
import type { ImageFieldExtra } from '../../form-core/domain/extra/ImageFieldExtra';
import type { ImageValue } from '../../form-core/domain/field';

export function ImageInput(
  value: IField<ImageValue, ImageFieldExtra>,
  onChange: (value: ImageValue) => void,
) {
  const { t } = useTranslation();

  const previewUrl = useMemo(() => {
    const image = value.value;
    if (image instanceof File) return URL.createObjectURL(image);
    if (typeof image === 'string') return image;
    return null;
  }, [value]);

  useEffect(() => {
    if (value instanceof File && previewUrl) {
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl, value]);

  return (
    <Stack direction="horizontal" gap={3} className="align-items-center flex-wrap">
      <div className="rounded bg-light p-2 d-flex align-items-center justify-content-center">
        <Image
          src={
            previewUrl ??
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="12" fill="%23edf1f7"/><path d="M48 20c15.464 0 28 12.536 28 28S63.464 76 48 76 20 63.464 20 48 32.536 20 48 20Zm0 4C34.745 24 24 34.745 24 48s10.745 24 24 24 24-10.745 24-24S61.255 24 48 24Zm0 10a2 2 0 0 1 1.994 1.85L50 36v10h10a2 2 0 0 1 1.994 1.85L62 48a2 2 0 0 1-1.85 1.994L60 50H50v10a2 2 0 0 1-1.85 1.994L48 62a2 2 0 0 1-1.994-1.85L46 60V50H36a2 2 0 0 1-1.994-1.85L34 48a2 2 0 0 1 1.85-1.994L36 46h10V36a2 2 0 0 1 2-2Z" fill="%232e3650"/></svg>'
          }
          width={96}
          height={96}
          className="rounded border"
        />
      </div>

      <div className="flex-grow-1">
        <Form.Control
          type="file"
          accept={value.extra?.accept}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            onChange(target.files?.[0] ?? null);
          }}
        />
      </div>

      {previewUrl && (
        <Button variant="outline-secondary" size="sm" onClick={() => onChange(null)}>
          {t('form.clear')}
        </Button>
      )}
    </Stack>
  );
}
