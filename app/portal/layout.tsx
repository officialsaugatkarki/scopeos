'use client';

import React from 'react';

export default function PortalLayout({ children }: { children: React.ReactNode; }) {
  // The /portal/p/[token] sub-layout provides its own shell (sidebar, header, nav).
  // This layout is a transparent passthrough so nothing double-wraps.
  return <>{children}</>;
}