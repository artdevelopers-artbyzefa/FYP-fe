import React from 'react';
import { Tag, Calendar, Star, Crown, LogOut, Landmark } from 'lucide-react';

// Custom Dashboard Icon matching the design reference (Screen with profile card)
export const DashboardIcon = (props) => React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: '20',
    height: '20',
    className: props.className,
    ...props
  },
  React.createElement('rect', { width: '20', height: '14', x: '2', y: '3', rx: '2' }),
  React.createElement('path', { d: 'M12 17v4' }),
  React.createElement('path', { d: 'M8 21h8' }),
  React.createElement('circle', { cx: '8', cy: '9', r: '2' }),
  React.createElement('path', { d: 'M5 14a3 3 0 0 1 6 0' }),
  React.createElement('line', { x1: '14', x2: '18', y1: '8', y2: '8' }),
  React.createElement('line', { x1: '14', x2: '18', y1: '11', y2: '11' })
);

// Custom Proposals Icon (Document with a pen drawing on it)
export const ProposalsIcon = (props) => React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: '20',
    height: '20',
    className: props.className,
    ...props
  },
  React.createElement('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
  React.createElement('polyline', { points: '14 2 14 8 20 8' }),
  React.createElement('path', { d: 'M10.42 12.58a2.1 2.1 0 1 1 2.97 2.97L7.5 21 4 21l0-3.5 5.92-5.92z' })
);

// Custom Groups Icon (Node branching to two nodes)
export const GroupsIcon = (props) => React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: '20',
    height: '20',
    className: props.className,
    ...props
  },
  React.createElement('circle', { cx: '6', cy: '12', r: '3' }),
  React.createElement('circle', { cx: '18', cy: '6', r: '3' }),
  React.createElement('circle', { cx: '18', cy: '18', r: '3' }),
  React.createElement('path', { d: 'M9 12h2a3 3 0 0 0 3-3V6' }),
  React.createElement('path', { d: 'M9 12h2a3 3 0 0 1 3 3v3' })
);

// Custom Messages Icon (Two overlapping speech bubbles)
export const MessagesIcon = (props) => React.createElement(
  'svg',
  {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    width: '20',
    height: '20',
    className: props.className,
    ...props
  },
  React.createElement('path', { d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z' }),
  React.createElement('path', { d: 'M15 15a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4', opacity: '0.6' })
);

// Mapped simple icons for Tag, Calendar, Evaluations, HeadManagement, Logout, and University
export const TagIcon = (props) => React.createElement(Tag, { className: props.className, width: '20', height: '20', ...props });
export const CalendarIcon = (props) => React.createElement(Calendar, { className: props.className, width: '20', height: '20', ...props });
export const EvaluationsIcon = (props) => React.createElement(Star, { className: props.className, width: '20', height: '20', ...props });
export const HeadManagementIcon = (props) => React.createElement(Crown, { className: props.className, width: '20', height: '20', ...props });
export const LogoutIcon = (props) => React.createElement(LogOut, { className: props.className, width: '20', height: '20', ...props });
export const UniversityIcon = (props) => React.createElement(Landmark, { className: props.className, width: '20', height: '20', ...props });
