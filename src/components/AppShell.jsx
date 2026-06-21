import FitnessIcon from './FitnessIcon';

export function BrandLockup({ compact = false }) {
  return (
    <div className={`brand-lockup${compact ? ' brand-lockup--compact' : ''}`}>
      <span className="brand-lockup__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand-lockup__copy">
        <strong>Elite</strong>
        <span>Tracker</span>
      </span>
    </div>
  );
}

export function AppHeader({ profileInitial, onOpenProfile }) {
  return (
    <header className="app-header">
      <BrandLockup compact />
      <button
        type="button"
        className="profile-trigger"
        onClick={onOpenProfile}
        aria-label="Open profile and account settings"
      >
        <span className="profile-trigger__copy">
          <small>Account</small>
          <strong>My profile</strong>
        </span>
        <span className="profile-trigger__avatar" aria-hidden="true">{profileInitial}</span>
      </button>
    </header>
  );
}

export function PrimaryNavigation({ items, activeTab, visible, onSelect }) {
  return (
    <nav
      className={`bottom-nav${visible ? ' bottom-nav--visible' : ''}`}
      aria-label="Primary navigation"
      aria-hidden={!visible}
    >
      {items.map(item => {
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={[
              'bottom-nav__item',
              item.isPrimary ? 'bottom-nav__item--primary' : '',
              isActive ? 'bottom-nav__item--active' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? 'page' : undefined}
            tabIndex={visible ? 0 : -1}
          >
            <span className="bottom-nav__icon" aria-hidden="true">
              <FitnessIcon name={item.icon} size={item.isPrimary ? 26 : 23} />
            </span>
            <span className="bottom-nav__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-heading__action">{action}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, children, action }) {
  return (
    <div className="empty-state">
      {icon && (
        <span className="empty-state__icon" aria-hidden="true">
          <FitnessIcon name={icon} size={24} />
        </span>
      )}
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
