import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { contactMessages } from '../../hooks/resources'

const nav = [
  { to: '/', label: 'Overview', end: true },
  { to: '/profile', label: 'Profile' },
  { to: '/projects', label: 'Projects' },
  { to: '/posts', label: 'Posts' },
  { to: '/skills', label: 'Skills' },
  { to: '/tags', label: 'Tags' },
  { to: '/messages', label: 'Messages' },
]

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: messages } = contactMessages.useList()

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      {/* Top bar: phones only */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-background px-4 md:hidden">
        <Brand />
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium hover:bg-sunken"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Sidebar: always visible from md up, toggled on phones */}
      <aside
        id="sidebar"
        className={`${menuOpen ? 'block' : 'hidden'} fixed inset-x-0 top-14 bottom-0 z-10 border-r border-line bg-sunken p-4 md:sticky md:top-0 md:block md:h-dvh`}
      >
        <div className="mb-6 hidden md:block">
          <Brand />
        </div>
        <nav className="grid gap-0.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:bg-surface/60 hover:text-foreground'
                }`
              }
            >
              {item.label}
              {item.to === '/messages' && messages && messages.length > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-background">{messages.length}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="mt-6 block px-3 text-sm text-muted hover:text-foreground"
        >
          View public site ↗
        </a>
      </aside>

      <main className="min-w-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function Brand() {
  return (
    <span className="font-mono text-base font-semibold">
      alex<span className="text-accent">.</span> <span className="font-sans text-sm font-normal text-muted">cms</span>
    </span>
  )
}
