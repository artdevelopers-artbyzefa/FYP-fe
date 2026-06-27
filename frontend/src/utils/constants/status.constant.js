import { Clock, CheckCircle, ThumbsDown, Loader2, X, Check } from 'lucide-react';

export const STATUS_MAP = {
  voting: { label: 'Voting', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Clock },
  agreed: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  voting_rejected: { label: 'Rejected by Group', color: 'bg-gray-50 text-gray-500 border-gray-200', icon: ThumbsDown },
  supervisor_approved: { label: 'Accepted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  supervisor_rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
  fyp_office_approved: { label: 'FYP Approved', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
  fyp_office_rejected: { label: 'FYP Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
};

export const IDEA_STATUS_MAP = {
  voting: { label: 'Voting', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Clock },
  agreed: { label: 'Pending Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  voting_rejected: { label: 'Rejected by Group', color: 'bg-gray-50 text-gray-500 border-gray-200', icon: ThumbsDown },
  supervisor_approved: { label: 'Accepted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  supervisor_rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
  fyp_office_approved: { label: 'FYP Office Approved', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle },
  fyp_office_rejected: { label: 'FYP Office Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
};

export const GROUP_STATUS_MAP = {
  forming: { label: 'Forming', color: 'bg-gray-50 text-gray-500 border-gray-200', icon: Clock },
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-600 border-rose-200', icon: ThumbsDown },
  active: { label: 'Active', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Loader2 },
  completed: { label: 'Completed', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: CheckCircle },
};
