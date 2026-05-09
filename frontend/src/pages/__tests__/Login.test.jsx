import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Login from '../Login'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api'

vi.mock('../../api')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderLogin = () => {
  const mockLogin = vi.fn()
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  )
  return { mockLogin }
}

describe('Login', () => {
  it('renders login form', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('shows error on failed login', async () => {
    api.post.mockRejectedValue({ response: { status: 401 } })
    renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bad@example.com' } })
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(screen.getByText(/ошибка входа/i)).toBeInTheDocument()
    })
  })

  it('logs in and navigates on success', async () => {
    api.post.mockResolvedValue({
      data: { access_token: 'token123', role: 'user' }
    })
    const { mockLogin } = renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'user123' } })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('token123', 'user', 'user@example.com')
      expect(mockNavigate).toHaveBeenCalledWith('/my-decks')
    })
  })

  it('navigates admin to admin page', async () => {
    api.post.mockResolvedValue({
      data: { access_token: 'admintoken', role: 'admin' }
    })
    const { mockLogin } = renderLogin()

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@example.com' } })
    fireEvent.change(screen.getByLabelText(/пароль/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/users')
    })
  })
})
