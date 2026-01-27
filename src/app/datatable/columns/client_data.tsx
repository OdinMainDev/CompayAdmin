import React from 'react';
import { ClientData } from '@/app/entities/client_data';
import { useTranslation } from 'react-i18next';
import { Accordion } from 'react-bootstrap';

interface Props {
  clientData: ClientData;
  hideBaseData?: boolean;
}

export function RenderClientData({ clientData, hideBaseData }: Props) {
  const { t } = useTranslation();

  const { ip, fingerprint, user_agent, ip_data } = clientData;

  const city = ip_data?.City?.Names?.en;
  const country = ip_data?.Country?.Names?.en;
  const continent = ip_data?.Continent?.Names?.en;
  const region = ip_data?.Subdivisions?.Names?.en;
  const postalCode = ip_data?.Postal?.Code;
  const timezone = ip_data?.Location?.TimeZone;

  const traits = ip_data?.Traits;

  const renderRow = (label: string, value?: React.ReactNode) =>
    value ? (
      <div style={{ display: 'flex', gap: 8 }}>
        <strong>{label}:</strong>
        <span>{value}</span>
      </div>
    ) : null;

  return (
    <Accordion className="mb-4">
      <Accordion.Item eventKey="0">
        <Accordion.Header>{t('datatable.client_data')}</Accordion.Header>

        <Accordion.Body className="shadow-sm p-3">
          <h5>{t('datatable.client_data')}</h5>

          {!hideBaseData && (
            <>
              {renderRow('IP Address', ip)}
              {renderRow('Fingerprint', fingerprint)}
              {renderRow('User Agent', user_agent)}
            </>
          )}

          <hr />

          {renderRow('Continent', continent)}
          {renderRow('Country', country)}
          {renderRow('Region', region)}
          {renderRow('City', city)}
          {renderRow('Postal Code', postalCode)}
          {renderRow('Time Zone', timezone)}

          {traits && (
            <>
              <hr />
              <h6>Network Traits</h6>
              {renderRow('Anonymous Proxy', traits.IsAnonymousProxy ? 'Yes' : 'No')}
              {renderRow('Anycast', traits.IsAnycast ? 'Yes' : 'No')}
              {renderRow('Satellite Provider', traits.IsSatelliteProvider ? 'Yes' : 'No')}
            </>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}
