import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PrivateRoute from '../PrivateRoute'
import { AuthContext } from '../../context/AuthContext'

const renderWithAuth = (user, allowedRoles) => {
  return render(
    <AuthContext.Provider value={{ user, loading: false }}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PrivateRoute allowedRoles={allowedRoles} />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('PrivateRoute', () => {
  it('renders protected content for authorized user', () => {
    renderWithAuth({ id: '1', role: 'user' }, ['user', 'admin'])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth(null, ['user', 'admin'])
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects to home when role is not allowed', () => {
    renderWithAuth({ id: '1', role: 'user' }, ['admin'])
    expect(screen.getByText('Home Page')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(
      <AuthContext.Provider value={{ user: null, loading: true }}>
        <MemoryRouter>
          <PrivateRoute allowedRoles={['user']} />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
  })
})
