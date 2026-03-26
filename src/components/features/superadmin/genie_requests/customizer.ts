import type { ActionMenuConfig } from '@/types/types';
import { Mails } from 'lucide-react';

const actionMenuItems: ActionMenuConfig = {
  tableTitle: 'All Requests',
  titleIcon: Mails,
  willCellWrap: true,
  isVisibilityTogglable: false,
  isSearchable: true,
  searchPlaceholder: 'Search Requests ...',
  searchColumns: ['name', 'email', 'requester_name'],
  showFilter: false,
  showCreateButton: false,
  creationOptions: {
    title: 'Create Genie Request',
    description: '',
    // component: CreateAction,
  },
  showDeleteButton: false,
  deleteConfirmationOptions: {
    title: 'Are you sure you want to delete this Genie Request?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Yes, delete',
  },
  showEditButton: false,
  updateOptions: {
    title: 'Edit Genie Request',
    description: '',
  },
  showViewButton: true,
  viewOptions: {
    title: 'Genie Request details',
    description: '',
  },
};

export default actionMenuItems;
