import React from 'react';
import { ImportantRepliesView } from '../ImportantRepliesView';
import type { DrawerType } from '../../types';

interface QuickInboxDrawerProps {
  onOpenDrawer?: (type: DrawerType, data: any) => void;
  onSelectThread?: (thread: any) => void;
}

export const QuickInboxDrawer: React.FC<QuickInboxDrawerProps> = ({
  onOpenDrawer,
  onSelectThread
}) => {
  const handleOpenDrawer = (type: DrawerType, data: any) => {
    if (onOpenDrawer) {
      onOpenDrawer(type, data);
    } else if (onSelectThread) {
      onSelectThread(data);
    }
  };

  return (
    <div className="space-y-3">
      <ImportantRepliesView onOpenDrawer={handleOpenDrawer} />
    </div>
  );
};
