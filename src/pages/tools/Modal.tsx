import { useState, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import UnifiedFormBuilder from '../../features/form-platform/packages/form-react-adapter/UnifiedFormBuilder';
import type { RawFormSection } from '../../features/form-platform/packages/form-core/domain/field/RawFormSection';

const FiltersButtonTest = () => {
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const sections = useMemo<RawFormSection[]>(() => [
    {
      title: '',
      description: '',
      fields: [
        { name: 'id', type: 'text', helperText: 'helperText', placeholder: 'placeholder' },
        { name: 'user_id', type: 'text', placeholder: 'placeholder' },
        { name: 'provider_id', type: 'text', placeholder: 'placeholder' },
        { name: 'selector', type: 'text', label: 'label', placeholder: 'placeholder' },
        { name: 'hash',  type: 'text', placeholder: 'placeholder' },
        { name: 'is_active', helperText: 'helperText', type: 'switch', defaultValue: false },
        { name: 'is_active_disabled', helperText: 'disalbed', disabled: true, type: 'switch', defaultValue: false },
        {
          name: 'status',
          type: 'select',
          helperText: 'helpertext',
          options: [
            { label: 'Новый', value: 'new' },
            { label: 'В обработке', value: 'processing' },
            { label: 'Завершен', value: 'done' },
          ],
        },
      ],
    },
  ], []);

  const handleApply = () => {
    setShow(false);
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setShow(true)}>
        Фильтры
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Фильтры</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UnifiedFormBuilder
            json={sections}
            formData={filters}
            setFormData={setFilters}
            handleSubmit={handleApply}
            submitLabel="Применить"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FiltersButtonTest;
