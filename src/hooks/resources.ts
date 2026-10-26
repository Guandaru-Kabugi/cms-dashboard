import type {
  ContactMessageResponse,
  PostRequest,
  PostResponse,
  ProfileRequest,
  ProfileResponse,
  ProjectRequest,
  ProjectResponse,
  SkillGroupRequest,
  SkillGroupResponse,
  TagRequest,
  TagResponse,
} from '../api/types'
import { createCrudHooks } from './useCrud'

// One line per resource. The path matches the Spring controller's @RequestMapping.
export const profiles = createCrudHooks<ProfileResponse, ProfileRequest>('profiles')
export const projects = createCrudHooks<ProjectResponse, ProjectRequest>('projects')
export const posts = createCrudHooks<PostResponse, PostRequest>('posts')
export const skillGroups = createCrudHooks<SkillGroupResponse, SkillGroupRequest>('skill-groups')
export const tags = createCrudHooks<TagResponse, TagRequest>('tags')
// Messages are only read and deleted here (visitors create them), so TRequest is never used
export const contactMessages = createCrudHooks<ContactMessageResponse, never>('contact-messages')
