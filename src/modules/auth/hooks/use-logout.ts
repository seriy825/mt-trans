import {useAuthState} from 'app/store/auth/state'
import {LocalStorageService} from '../../../shared/services/local-storage-service'
import {useQueryClient} from 'react-query'

export function useLogout() {
  const {setUser} = useAuthState()
  const queryClient = useQueryClient()
  const logout = () => {
    setUser(null, null)
    LocalStorageService.remove('token')
    LocalStorageService.remove('userId')
    queryClient.clear()
  }
  return {
    logout,
  }
}