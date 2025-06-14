import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/authStore'

/**
 * URL base para as requisições à API (modo mock)
 * Base URL for API requests (mock mode)
 */
const API_BASE_URL = 'http://localhost:3001' // URL mock para desenvolvimento local

/**
 * Classe que gerencia as requisições HTTP para a API
 * Class that manages HTTP requests to the API
 */
class ApiClient {
  private api: AxiosInstance
  private mockMode: boolean = true // Modo mock ativado por padrão
  
  constructor() {
    /**
     * Criação da instância do Axios com configurações padrão
     * Creation of Axios instance with default settings
     */
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // Timeout de 5 segundos
    })
    
    this.setupInterceptors()
  }
  
  /**
   * Configura os interceptors para adicionar token e tratar erros
   * Sets up interceptors to add token and handle errors
   */
  private setupInterceptors(): void {
    // Interceptor de requisição para adicionar token de autenticação
    // Request interceptor to add authentication token
    this.api.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState()
        
        if (accessToken && !this.mockMode) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return config
      },
      (error) => Promise.reject(error)
    )
    
    // Interceptor de resposta para tratar erros e refresh token
    // Response interceptor to handle errors and refresh token
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Em modo mock, não tenta refresh token
        // In mock mode, don't try refresh token
        if (this.mockMode) {
          return Promise.reject(error)
        }
        
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
        
        // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
        // If the error is 401 (Unauthorized) and not a refresh attempt
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const { refreshToken } = useAuthStore.getState()
            
            if (!refreshToken) {
              // Se não houver refresh token, faz logout
              // If there is no refresh token, logout
              useAuthStore.getState().logout()
              return Promise.reject(error)
            }
            
            // Tenta obter novos tokens com o refresh token
            // Try to get new tokens with the refresh token
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            })
            
            const { accessToken, refreshToken: newRefreshToken } = response.data
            
            // Atualiza os tokens no store
            // Update tokens in the store
            useAuthStore.getState().updateTokens({
              accessToken,
              refreshToken: newRefreshToken,
            })
            
            // Refaz a requisição original com o novo token
            // Retry the original request with the new token
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${accessToken}`,
            }
            
            return this.api(originalRequest)
          } catch (refreshError) {
            // Se falhar o refresh, faz logout
            // If refresh fails, logout
            useAuthStore.getState().logout()
            return Promise.reject(refreshError)
          }
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  /**
   * Ativa ou desativa o modo mock
   * Enables or disables mock mode
   */
  public setMockMode(enabled: boolean): void {
    this.mockMode = enabled
  }
  
  /**
   * Verifica se está em modo mock
   * Checks if in mock mode
   */
  public isMockMode(): boolean {
    return this.mockMode
  }
  
  /**
   * Realiza uma requisição GET
   * Performs a GET request
   * 
   * @param url - URL da requisição / Request URL
   * @param config - Configurações adicionais / Additional settings
   * @returns Promise com a resposta / Promise with the response
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.mockMode) {
      console.warn(`Mock mode: GET ${url} - returning mock data`)
      return Promise.resolve({
        data: {} as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      } as AxiosResponse<T>)
    }
    return this.api.get<T>(url, config)
  }
  
  /**
   * Realiza uma requisição POST
   * Performs a POST request
   * 
   * @param url - URL da requisição / Request URL
   * @param data - Dados a serem enviados / Data to be sent
   * @param config - Configurações adicionais / Additional settings
   * @returns Promise com a resposta / Promise with the response
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.mockMode) {
      console.warn(`Mock mode: POST ${url} - returning mock data`)
      return Promise.resolve({
        data: {} as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      } as AxiosResponse<T>)
    }
    return this.api.post<T>(url, data, config)
  }
  
  /**
   * Realiza uma requisição PUT
   * Performs a PUT request
   * 
   * @param url - URL da requisição / Request URL
   * @param data - Dados a serem enviados / Data to be sent
   * @param config - Configurações adicionais / Additional settings
   * @returns Promise com a resposta / Promise with the response
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.mockMode) {
      console.warn(`Mock mode: PUT ${url} - returning mock data`)
      return Promise.resolve({
        data: {} as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      } as AxiosResponse<T>)
    }
    return this.api.put<T>(url, data, config)
  }
  
  /**
   * Realiza uma requisição DELETE
   * Performs a DELETE request
   * 
   * @param url - URL da requisição / Request URL
   * @param config - Configurações adicionais / Additional settings
   * @returns Promise com a resposta / Promise with the response
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (this.mockMode) {
      console.warn(`Mock mode: DELETE ${url} - returning mock data`)
      return Promise.resolve({
        data: {} as T,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {}
      } as AxiosResponse<T>)
    }
    return this.api.delete<T>(url, config)
  }
}

// Exporta uma instância única do ApiClient para ser usada em toda a aplicação
// Exports a single instance of ApiClient to be used throughout the application
export const apiClient = new ApiClient()

