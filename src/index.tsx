import React from 'react'
import {createRoot} from 'react-dom/client'
// Axios
import {axios} from './app/config/axios/axios'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {BrowserRouter} from 'react-router-dom'
import {App} from './app/App'
import {LocalStorageService} from './shared/services/local-storage-service'
import {useAuthState} from './app/store/auth/state'
import {ModalManager} from 'shared/context/modal-manager'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
axios.interceptors.response.use(
  (res) => {
    const token = res.headers?.authorization
    if (token) {
      LocalStorageService.set('token', 'Bearer ' + token)
    }
    return res
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthState.getState().setUser(null, null)
      LocalStorageService.remove('token')
      LocalStorageService.remove('userId')
    }
    return Promise.reject(error)
  }
)

const container = document.getElementById('root')

if (container) {
  ;(function () {
    const savedToken = LocalStorageService.get('token')
    const userId = LocalStorageService.get('userId')
    if (savedToken && userId) {
      useAuthState.getState().setUser(savedToken, userId)
    }
  })()

  createRoot(container).render(
    <ModalManager.Provider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ModalManager.Provider>
  )
}
