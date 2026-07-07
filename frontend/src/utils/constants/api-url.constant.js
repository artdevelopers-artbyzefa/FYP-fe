/**
 * Authentication Endpoints
 */
export const LOGIN_API_URL = '/auth/login';
export const REGISTER_API_URL = '/auth/register';
export const LOGOUT_API_URL = '/auth/logout';
export const REFRESH_TOKEN_API_URL = '/auth/refresh-token';

/**
 * User Endpoints
 */
export const GET_USER_PROFILE_API_URL = '/user/profile';
export const UPDATE_USER_PROFILE_API_URL = '/user/profile';

/**
 * Dashboard / Other
 */
export const DASHBOARD_STATS_API_URL = '/dashboard/stats';

/**
 * Student Endpoints
 */
export const STUDENT_GET_PROFILE_URL = '/student/profile';
export const STUDENT_UPDATE_PROFILE_URL = '/student/profile/update';

export const STUDENT_SEARCH_PARTNERS_URL = '/student/partners/search';
export const STUDENT_SEND_REQUEST_URL = '/student/partners/request';
export const STUDENT_GET_INCOMING_REQUESTS_URL = '/student/partners/incoming';
export const STUDENT_RESPOND_REQUEST_URL = '/student/partners/respond';

export const STUDENT_GET_SUPERVISORS_URL = '/student/supervisors';
export const STUDENT_REQUEST_SUPERVISOR_URL = '/student/supervisors/request';

export const STUDENT_SUBMIT_IDEA_URL = '/student/ideas/submit';
export const STUDENT_TASKS_API_URL = '/student/tasks';
export const STUDENT_PAST_PROJECTS_API_URL = '/student/past-projects';
export const STUDENT_SUGGESTIONS_API_URL = '/student/suggestions';
export const STUDENT_SUBMIT_GROUP_IDEA_URL = '/student/ideas/group/submit';
export const STUDENT_GET_GROUP_IDEAS_URL = '/student/ideas/group';
export const STUDENT_VOTE_GROUP_IDEA_URL = '/student/ideas/group';

/**
 * HOD Endpoints
 */
export const HOD_DASHBOARD_API_URL = '/hod/dashboard';
export const HOD_ESCALATIONS_API_URL = '/hod/escalations';
export const HOD_FACULTY_API_URL = '/hod/faculty-oversight';
export const HOD_GOVERNANCE_API_URL = '/hod/governance';
export const HOD_ANALYTICS_API_URL = '/hod/analytics';
export const HOD_STUDENTS_API_URL = '/hod/students';
export const HOD_COMMITTEES_API_URL = '/hod/committees';
export const HOD_FACULTY_LIST_API_URL = '/hod/faculty';

/**
 * FYP Office Assistant Endpoints
 */
export const OFFICE_DASHBOARD_API_URL = '/office-assistant/dashboard';
export const OFFICE_USERS_API_URL = '/office-assistant/users';
export const OFFICE_STUDENTS_API_URL = '/office-assistant/students';
export const OFFICE_FACULTY_API_URL = '/office-assistant/faculty';
export const OFFICE_PROJECTS_API_URL = '/office-assistant/projects';
export const OFFICE_CONTENT_API_URL = '/office-assistant/content';
export const OFFICE_PROPOSAL_COMM_API_URL = '/office-assistant/proposal-committee';
export const OFFICE_EVAL_COMM_API_URL = '/office-assistant/eval-committee';
export const OFFICE_EXTERNAL_API_URL = '/office-assistant/external';
export const OFFICE_RESULTS_API_URL = '/office-assistant/results';
export const OFFICE_CREATE_STUDENT_API_URL = '/office-assistant/students';
export const OFFICE_CREATE_FACULTY_API_URL = '/office-assistant/faculty';
export const OFFICE_PAST_PROJECTS_API_URL = '/office-assistant/past-projects';

/**
 * Faculty Supervisor Endpoints
 */
export const FACULTY_DASHBOARD_API_URL = '/faculty/dashboard';
export const FACULTY_PROFILE_API_URL = '/faculty/profile';
export const FACULTY_AVAILABILITY_API_URL = '/faculty/availability';
export const FACULTY_PROPOSALS_API_URL = '/faculty/proposals';
export const FACULTY_SUPERVISION_API_URL = '/faculty/supervision';
export const FACULTY_MESSAGING_API_URL = '/faculty/messaging';
export const FACULTY_EVALUATIONS_API_URL = '/faculty/evaluations';
export const FACULTY_HEAD_DUTIES_API_URL = '/faculty/head-duties';
export const FACULTY_SUPERVISOR_REQUESTS_API_URL = '/faculty/supervisor-requests';
export const FACULTY_SUGGEST_IDEA_API_URL = '/faculty/suggest-idea';
export const FACULTY_SUGGESTIONS_API_URL = '/faculty/suggestions';

/**
 * FYP Office In-charge Endpoints
 */
export const INCHARGE_DASHBOARD_API_URL = '/office-incharge/dashboard';
export const INCHARGE_RUBRICS_API_URL = '/office-incharge/rubrics';
export const INCHARGE_RUBRICS_URL = '/office-incharge/rubrics';
export const INCHARGE_SESSIONS_API_URL = '/office-incharge/sessions';
export const INCHARGE_SUPERVISION_REQS_API_URL = '/office-incharge/supervision-requests';
export const INCHARGE_COMMITTEE_OVERSIGHT_API_URL = '/office-incharge/committee-oversight';
export const INCHARGE_GRIEVANCES_API_URL = '/office-incharge/grievances';
export const INCHARGE_FACULTY_REPORTS_API_URL = '/office-incharge/faculty-reports';
export const INCHARGE_STUDENT_REPORTS_API_URL = '/office-incharge/student-reports';
export const INCHARGE_AUDIT_LOG_API_URL = '/office-incharge/audit-log';

/**
 * Admin Endpoints
 */
export const ADMIN_DASHBOARD_STATS_URL = '/admin/dashboard/stats';
export const ADMIN_GET_USERS_URL = '/admin/users';
export const ADMIN_CREATE_USER_URL = '/admin/users';
export const ADMIN_RESET_PASSWORD_URL = '/admin/users/:id/reset-password';
export const ADMIN_TOGGLE_USER_STATUS_URL = '/admin/users/:id/toggle-status';
export const ADMIN_GET_RBAC_URL = '/admin/rbac';
export const ADMIN_GET_AUDIT_LOGS_URL = '/admin/audit-logs';
export const ADMIN_SYSTEM_HEALTH_URL = '/admin/system-health';
export const ADMIN_TRIGGER_BACKUP_URL = '/admin/trigger-backup';
export const ADMIN_CLEAR_CACHE_URL = '/admin/clear-cache';
export const ADMIN_NOTIFICATIONS_URL = '/admin/notifications';

/**
 * Timetable / Presentation Schedule Endpoints
 */
export const INCHARGE_TIMETABLE_API_URL = '/presentation-schedules';

/**
 * Industry Supervisor Endpoints
 */
export const INDUSTRY_ASSIGNED_PROJECTS_URL = '/industry/assigned-projects';
export const INDUSTRY_SUBMIT_SCORECARD_URL = '/industry/submit-scorecard';
export const INDUSTRY_SCORECARD_STATUS_URL = '/industry/scorecard-status';
export const INDUSTRY_NOTIFICATIONS_URL = '/industry/notifications';

/**
 * Phase 1 (10%) Evaluation Endpoints
 */
export const PHASE1_SUPERVISOR_GROUPS_URL = '/phase1/supervisor/groups';
export const PHASE1_SUPERVISOR_EVALUATE_URL = '/phase1/supervisor/evaluate';
export const PHASE1_COMMITTEE_EVALUATIONS_URL = '/phase1/committee/evaluations';
export const PHASE1_COMMITTEE_EVALUATE_URL = '/phase1/committee/evaluate';
export const PHASE1_STUDENT_REMARKS_URL = '/phase1/remarks';
export const PHASE1_MARKS_URL = '/phase1/marks';

/**
 * Phase 2 (30%) Evaluation Endpoints
 */
export const PHASE2_SUPERVISOR_GROUPS_URL = '/phase2/supervisor/groups';
export const PHASE2_SUPERVISOR_EVALUATE_URL = '/phase2/supervisor/evaluate';
export const PHASE2_COMMITTEE_EVALUATIONS_URL = '/phase2/committee/evaluations';
export const PHASE2_COMMITTEE_EVALUATE_URL = '/phase2/committee/evaluate';
export const PHASE2_STUDENT_REMARKS_URL = '/phase2/remarks';
export const PHASE2_MARKS_URL = '/phase2/marks';

/**
 * Final Calculated Marks Endpoints
 */
export const FINAL_MARKS_URL = '/final-marks';

/**
 * Meeting / Timetable Endpoints
 */
export const MEETINGS_URL = '/meetings';
export const MEETINGS_WEEK_URL = '/meetings/week';
