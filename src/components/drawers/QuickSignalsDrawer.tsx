import React from 'react';
import { IntentSignalsView } from '../IntentSignalsView';
import type { DrawerType } from '../../types';

interface QuickSignalsDrawerProps {
  onOpenDrawer?: (type: DrawerType, data: any) => void;
  onSelectSignal?: (signal: any) => void;
}

export const QuickSignalsDrawer: React.FC<QuickSignalsDrawerProps> = ({
  onOpenDrawer,
  onSelectSignal
}) => {
  const handleOpenDrawer = (type: DrawerType, data: any) => {
    if (onOpenDrawer) {
      onOpenDrawer(type, data);
    } else if (onSelectSignal) {
      onSelectSignal(data);
    }
  };

  return (
    <div className="space-y-3">
      <IntentSignalsView onOpenDrawer={handleOpenDrawer} />
    </div>
  );
};
