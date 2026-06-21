const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

const IconPaths = ({ name }) => {
  switch (name) {
    case 'home':
      return (
        <>
          <path d="M4.5 10.6 12 4l7.5 6.6" />
          <path d="M6.7 9.2v9.2a1.6 1.6 0 0 0 1.6 1.6h7.4a1.6 1.6 0 0 0 1.6-1.6V9.2" />
          <path d="M10 20v-5.4h4V20" />
        </>
      );
    case 'workout':
      return (
        <>
          <path d="M4 12h16" />
          <path d="M7 8v8" />
          <path d="M17 8v8" />
          <path d="M2.8 10v4" />
          <path d="M21.2 10v4" />
          <path d="M9.6 6.6v10.8" />
          <path d="M14.4 6.6v10.8" />
        </>
      );
    case 'tdee':
      return (
        <>
          <path d="M12 3.8c3.7 3.4 5.5 6.5 5.5 9.2a5.5 5.5 0 0 1-11 0c0-2.7 1.8-5.8 5.5-9.2Z" />
          <path d="M9.8 14.2c.5 1.5 1.8 2.2 3.4 1.8 1.2-.4 2-1.4 2.1-2.8" />
          <path d="M12 10.2v4.1" />
        </>
      );
    case 'nutrition':
      return (
        <>
          <path d="M7.4 3.8v16.4" />
          <path d="M4.8 3.8v5.1a2.6 2.6 0 1 0 5.2 0V3.8" />
          <path d="M16.4 4.2c1.8 1.4 2.8 3.3 2.8 5.5v10.1" />
          <path d="M16.4 4.2v8.1h3.2" />
        </>
      );
    case 'progress':
      return (
        <>
          <path d="M4.2 19.4h15.6" />
          <path d="M6.4 15.8l3.1-3.4 2.8 2.3 5.2-7" />
          <path d="M15.2 7.7h2.3v2.3" />
        </>
      );
    case 'history':
      return (
        <>
          <path d="M5.8 7.2A8 8 0 1 1 4.4 12" />
          <path d="M3.8 7.2h2.9V4.3" />
          <path d="M12 8.2v4.5l3.1 1.9" />
        </>
      );
    case 'templates':
      return (
        <>
          <rect x="5" y="4" width="14" height="17" rx="2.2" />
          <path d="M8.2 8h7.6" />
          <path d="M8.2 12h7.6" />
          <path d="M8.2 16h4.3" />
        </>
      );
    case 'exerciseLibrary':
      return (
        <>
          <path d="M5.2 5.4h10.6a2.8 2.8 0 0 1 2.8 2.8v12H7a2.8 2.8 0 0 1-2.8-2.8V6.4a1 1 0 0 1 1-1Z" />
          <path d="M7 20.2V8.4a2.4 2.4 0 0 1 2.4-2.4" />
          <path d="M10.2 11.2h5" />
          <path d="M10.2 14.6h4" />
        </>
      );
    case 'timer':
      return (
        <>
          <circle cx="12" cy="13" r="7" />
          <path d="M9.4 3.8h5.2" />
          <path d="M12 3.8v2" />
          <path d="M12 13V9.4" />
          <path d="m12 13 2.6 2.1" />
        </>
      );
    case 'coaching':
      return (
        <>
          <path d="M6.3 13.3a5.7 5.7 0 0 1 11.4 0v1.1a3.2 3.2 0 0 1-3.2 3.2h-1.2" />
          <path d="M6.3 13.2H4.8a1.4 1.4 0 0 0-1.4 1.4v1.2a1.4 1.4 0 0 0 1.4 1.4h1.5v-4Z" />
          <path d="M17.7 13.2h1.5a1.4 1.4 0 0 1 1.4 1.4v1.2a1.4 1.4 0 0 1-1.4 1.4h-1.5v-4Z" />
          <path d="M10 20h3.3" />
        </>
      );
    case 'importImage':
      return (
        <>
          <rect x="4.5" y="5" width="15" height="14" rx="2.2" />
          <path d="M8.2 15.6 11 12.8l2.1 2 1.7-1.6 3 2.8" />
          <circle cx="9" cy="9" r="1.2" />
          <path d="M12 3.2v5.2" />
          <path d="m9.8 5.4 2.2-2.2 2.2 2.2" />
        </>
      );
    case 'profile':
      return (
        <>
          <circle cx="12" cy="8.2" r="3.3" />
          <path d="M5.6 20c.9-3.5 3.1-5.3 6.4-5.3s5.5 1.8 6.4 5.3" />
        </>
      );
    case 'settings':
      return (
        <>
          <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z" />
          <path d="M19 12a7.6 7.6 0 0 0-.1-1l2-1.5-1.9-3.2-2.4 1a8 8 0 0 0-1.7-1L14.6 4H9.4l-.4 2.3a8 8 0 0 0-1.7 1l-2.4-1-1.9 3.2 2 1.5a7.8 7.8 0 0 0 0 2l-2 1.5 1.9 3.2 2.4-1a8 8 0 0 0 1.7 1l.4 2.3h5.2l.4-2.3a8 8 0 0 0 1.7-1l2.4 1 1.9-3.2-2-1.5c.1-.3.1-.7.1-1Z" />
        </>
      );
    case 'calendar':
      return (
        <>
          <rect x="4.4" y="5.4" width="15.2" height="15.2" rx="2.2" />
          <path d="M8.2 3.8v3.7" />
          <path d="M15.8 3.8v3.7" />
          <path d="M4.4 10h15.2" />
          <path d="M8 14h.1" />
          <path d="M12 14h.1" />
          <path d="M16 14h.1" />
          <path d="M8 17h.1" />
          <path d="M12 17h.1" />
        </>
      );
    case 'favorites':
      return (
        <>
          <path d="m12 4.6 2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 15.6 7.7 18l.8-4.8L5 9.7 9.8 9 12 4.6Z" />
        </>
      );
    case 'analytics':
      return (
        <>
          <path d="M4.6 19.4h14.8" />
          <rect x="6" y="11.8" width="2.8" height="5.8" rx="1" />
          <rect x="10.6" y="8" width="2.8" height="9.6" rx="1" />
          <rect x="15.2" y="5.4" width="2.8" height="12.2" rx="1" />
        </>
      );
    case 'bodyWeight':
      return (
        <>
          <rect x="4.8" y="5.2" width="14.4" height="15" rx="3" />
          <path d="M8.8 9.7a4.7 4.7 0 0 1 6.4 0" />
          <path d="M12 9.2v3.2" />
          <path d="M10.2 16.5h3.6" />
        </>
      );
    case 'macros':
      return (
        <>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 4.5V12l5.3 5.3" />
          <path d="M12 12H4.5" />
          <path d="M12 12l4.1-6.2" />
        </>
      );
    case 'search':
      return (
        <>
          <circle cx="10.8" cy="10.8" r="6.1" />
          <path d="m15.4 15.4 4.2 4.2" />
        </>
      );
    case 'notifications':
      return (
        <>
          <path d="M18 15.2H6l1.4-2.1V9.9a4.6 4.6 0 0 1 9.2 0v3.2l1.4 2.1Z" />
          <path d="M10 18.2a2.2 2.2 0 0 0 4 0" />
          <path d="M17.8 7.2c.8.8 1.2 1.7 1.3 2.8" />
        </>
      );
    case 'arrowLeft':
      return (
        <>
          <path d="M19 12H5" />
          <path d="m10.5 6.5-5.5 5.5 5.5 5.5" />
        </>
      );
    case 'arrowRight':
      return (
        <>
          <path d="M5 12h14" />
          <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
        </>
      );
    case 'chevronDown':
      return <path d="m6.5 9 5.5 5.5L17.5 9" />;
    case 'close':
      return (
        <>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </>
      );
    case 'plus':
      return (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      );
    case 'check':
      return <path d="m5.5 12.5 4.1 4.1 8.9-9.1" />;
    case 'play':
      return <path d="m9 7 8 5-8 5V7Z" />;
    case 'edit':
      return (
        <>
          <path d="M5 19h3.4L19 8.4 15.6 5 5 15.6V19Z" />
          <path d="m13.8 6.8 3.4 3.4" />
        </>
      );
    case 'delete':
      return (
        <>
          <path d="M5.5 7h13" />
          <path d="M9 7V4.8h6V7" />
          <path d="m7.2 7 .8 12h8l.8-12" />
          <path d="M10.2 10.5v5" />
          <path d="M13.8 10.5v5" />
        </>
      );
    default:
      return null;
  }
};

export default function FitnessIcon({
  name,
  size = 24,
  strokeWidth = 1.9,
  className,
  'aria-hidden': ariaHidden = true,
}) {
  return (
    <svg
      aria-hidden={ariaHidden}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...iconProps}
      strokeWidth={strokeWidth}
    >
      <IconPaths name={name} />
    </svg>
  );
}
