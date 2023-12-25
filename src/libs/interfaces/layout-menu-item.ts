import { ReactElement } from 'react';

export interface LayoutMenuItem {
  path: string;
  label: string;
  activeKey: string;
  icon: ReactElement;
}
