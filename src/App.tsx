import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectFormPage from './pages/ProjectFormPage'
import PostsPage from './pages/PostsPage'
import PostFormPage from './pages/PostFormPage'
import SkillsPage from './pages/SkillsPage'
import TagsPage from './pages/TagsPage'
import MessagesPage from './pages/MessagesPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id" element={<ProjectFormPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/new" element={<PostFormPage />} />
        <Route path="posts/:id" element={<PostFormPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
