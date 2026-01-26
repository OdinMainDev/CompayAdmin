import { Breadcrumb } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const { pathname } = useLocation();
  const { t } = useTranslation("menu");
  
  const segments = pathname
    .split('?')[0]
    .split('/')
    .filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = decodeURIComponent(segment);

    return {
      label,
      href,
      isLast: index === segments.length - 1,
      isDisabled: index === segments.length - 1 || label == "edit" || label == "logs" || label == "process"
    };
  });

  return (
    <div className="mb-4">
      <Breadcrumb className="my-4">
        {breadcrumbs.map((item) => (
          <span key={item.href} className="d-inline-flex align-items-center">
            <Breadcrumb.Item
              linkAs={item.isLast ? 'span' : Link}
              linkProps={item.isLast ? undefined : { to: item.href }}
              active={item.isDisabled}
            >
              {t(item.label)}
            </Breadcrumb.Item>

            {!item.isLast && (
              <FontAwesomeIcon
                icon={faChevronRight}
                className="mx-2 text-muted"
                size="sm"
              />
            )}
          </span>
        ))}
      </Breadcrumb>

      <h1 className="h3 mb-1 text-dark">{title}</h1>
      {subtitle && <div className="text-muted">{subtitle}</div>}
    </div>
  );
};

export default PageHeader;
