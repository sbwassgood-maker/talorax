// Central export point for all seed/mock data. Components and services import
// from here so the underlying data source can be swapped for a real API later.
export { skills, skillNames } from './skills';
export { interests, interestNames } from './interests';
export { users, DEMO_USER_ID, getUserById, fullName } from './users';
export { companies, getCompanyById } from './companies';
export { projects, getProjectById } from './projects';
export { opportunities, getOpportunityById } from './opportunities';
export { communities, getCommunityById } from './communities';
export { posts, getPostById } from './posts';
export { conversations } from './conversations';
export { notifications } from './notifications';
