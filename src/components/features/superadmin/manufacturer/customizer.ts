import type { ActionMenuConfig } from '@/types/types';
// import CreateAction from './CreateAction';
import { Cog } from 'lucide-react';

const actionMenuItems: ActionMenuConfig = {
  tableTitle: 'Manufacturers',
  titleIcon: Cog,
  willCellWrap: true,
  isVisibilityTogglable: false,
  isSearchable: true,
  searchPlaceholder: 'Search Manufacturers ...',
  searchColumns: ['name', 'sftp_username', 'store_location.name'],
  showFilter: false,
  showCreateButton: true,
  creationOptions: {
    title: 'Create Manufacturer',
    description: '',
    // component: CreateAction,
  },
  showDeleteButton: true,
  deleteConfirmationOptions: {
    title: 'Are you sure you want to delete this Manufacturer?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Yes, delete',
  },
  showEditButton: true,
  updateOptions: {
    title: 'Edit Manufacturer',
    description: '',
  },
  showViewButton: true,
  viewOptions: {
    title: 'Manufacturer details',
    description: '',
  },
};

export default actionMenuItems;
