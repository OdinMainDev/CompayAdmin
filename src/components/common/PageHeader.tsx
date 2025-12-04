import { ReactNode } from 'react';
import { Breadcrumb } from 'react-bootstrap';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  trail?: { label: string; href?: string }[];
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, trail, actions }: PageHeaderProps) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
      <div className="mb-3 mb-md-0">
        <Breadcrumb className="mb-1">
          {(trail || []).map((item, index) => (
            <Breadcrumb.Item key={item.label} href={item.href} active={index === (trail?.length ?? 0) - 1}>
              {item.label}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <h1 className="h3 mb-1 text-dark">{title}</h1>
        {subtitle && <div className="text-muted">{subtitle}</div>}
      </div>
      {actions && <div className="d-flex align-items-center gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
