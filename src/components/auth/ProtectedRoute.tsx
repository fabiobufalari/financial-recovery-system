import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

/**
 * Protected Route Component Props
 * 
 * EN: Interface defining the properties for the ProtectedRoute component,
 * which secures routes that require authentication.
 * 
 * PT: Interface que define as propriedades para o componente ProtectedRoute,
 * que protege rotas que exigem autenticação.
 */
interface ProtectedRouteProps {
  /**
   * EN: Child components to render if authenticated
   * PT: Componentes filhos a serem renderizados se autenticado
   */
  children: ReactNode
  
  /**
   * EN: Path to redirect to if not authenticated
   * PT: Caminho para redirecionamento se não autenticado
   */
  redirectPath?: string
}

/**
 * Protected Route Component
 * 
 * EN: This component protects routes that require authentication.
 * It automatically redirects unauthenticated users to the login page
 * or another specified path, enhancing usability by preventing access
 * to restricted content without proper authentication.
 * 
 * PT: Este componente protege rotas que exigem autenticação.
 * Ele redireciona automaticamente usuários não autenticados para a página de login
 * ou outro caminho especificado, melhorando a usabilidade ao impedir o acesso
 * a conteúdo restrito sem a devida autenticação.
 * 
 * @param children - EN: Child components to render if authenticated / PT: Componentes filhos a serem renderizados se autenticado
 * @param redirectPath - EN: Path to redirect to if not authenticated (default: /login) / PT: Caminho para redirecionamento se não autenticado (padrão: /login)
 * @returns The child components or a redirect
 */
const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  // Get authentication status from the auth store
  // EN: Uses the authentication store to check if the user is logged in
  // PT: Usa o store de autenticação para verificar se o usuário está logado
  const { isAuthenticated } = useAuthStore()

  // If not authenticated, redirect to the specified path
  // EN: Redirects unauthenticated users to prevent access to protected routes
  // PT: Redireciona usuários não autenticados para impedir acesso a rotas protegidas
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  // If authenticated, render the child components
  // EN: Allows authenticated users to access the protected content
  // PT: Permite que usuários autenticados acessem o conteúdo protegido
  return <>{children}</>
}

export default ProtectedRoute
