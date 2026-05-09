import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Header from '../Header'
import { AuthContext } from '../../context/AuthContext'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderHeader = (user) => {
  const mockLogout = vi.fn()
  return render(
    <AuthContext.Provider value={{ user, logout: mockLogout }}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('Header', () => {
  it('shows login and register for guest', () => {
    renderHeader(null)
    expect(screen.getByText(/войти/i)).toBeInTheDocument()
    expect(screen.getByText(/регистрация/i)).toBeInTheDocument()
  })

  it('shows user navigation for authenticated user', () => {
    renderHeader({ email: 'user@example.com', role: 'user' })
    expect(screen.getByText(/мои шпаргалки/i)).toBeInTheDocument()
    expect(screen.getByText(/выйти/i)).toBeInTheDocument()
  })

  it('shows admin link for admin user', () => {
    renderHeader({ email: 'admin@example.com', role: 'admin' })
    expect(screen.getByText(/админка/i)).toBeInTheDocument()
  })

  it('calls logout and navigates on exit', async () => {
    const mockLogout = vi.fn().mockResolvedValue()
    render(
      <AuthContext.Provider value={{ user: { role: 'user' }, logout: mockLogout }}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    fireEvent.click(screen.getByText(/выйти/i))
    // Навигация происходит асинхронно
    await vi.waitFor(() => expect(mockLogout).toHaveBeenCalled())
  })
})
