// Mirrors the Spring Boot DTOs in personalwebsitebackend/src/main/java/.../data.
// *Request = what we send, *Response = what the API returns.
// Dates arrive as ISO strings, e.g. "2026-10-26T09:15:30.123".

// ---------- Profile & social links ----------

export interface SocialLinkRequest {
  label: string
  url: string
}

export interface SocialLinkResponse extends SocialLinkRequest {
  id: number
  profileId: number | null
  createdDate: string
  updatedDate: string
}

export interface ProfileRequest {
  name: string
  role: string
  pitch: string
  location: string
  email: string
  cvUrl: string
  socials: SocialLinkRequest[]
}

export interface ProfileResponse {
  id: number
  name: string
  role: string
  pitch: string
  location: string | null
  email: string
  cvUrl: string | null
  socialLinks: SocialLinkResponse[]
}

// ---------- Projects ----------

export interface ProjectRequest {
  slug: string
  title: string
  summary: string
  featured: boolean
  repoUrl: string | null
  liveUrl: string | null
  projectUrl: string | null
  tags: string[]
}

export interface ProjectResponse {
  id: number
  slug: string
  title: string
  summary: string | null
  featured: boolean
  repoUrl: string | null
  liveUrl: string | null
  projectUrl: string | null
  createdAt: string
  updatedAt: string
  tags: string[]
}

// ---------- Posts ----------

export interface PostRequest {
  slug: string
  title: string
  excerpt: string
  readingMinutes: number | null
  tags: string[]
}

export interface PostResponse {
  id: number
  slug: string
  title: string
  excerpt: string | null
  publishedAt: string | null
  readingTime: number
  updatedAt: string
  tags: string[]
}

// ---------- Skills ----------

export interface SkillGroupRequest {
  group: string
  items: string[]
}

export interface SkillGroupResponse {
  id: number
  skillGroupName: string
  skills: string[]
  createdAt: string
  updatedAt: string
}

// ---------- Tags ----------

export interface TagRequest {
  name: string
}

export interface TagResponse {
  id: number
  name: string
  created: string
  updated: string
}

// ---------- Contact messages ----------

export interface ContactMessageResponse {
  id: number
  name: string
  email: string
  message: string
  created: string
  updated: string
}
