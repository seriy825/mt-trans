import { DriverApi } from 'app/api/driver-api/driver-api'
import { useDriverState } from 'app/store/driver/state'
import { AxiosError } from 'axios'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { Button } from 'shared/components/button/button'
import {Modal} from 'shared/components/modal-base'
import { CONFIRM_DEACTIVATE_ALL_MODAL } from 'shared/constants/modal-names'
import { useStateModalManager } from 'shared/context/modal-manager'
export const ConfirmModal = () => {
  const modalState = useStateModalManager(CONFIRM_DEACTIVATE_ALL_MODAL)
  const { getDrivers } = useDriverState()

  const handleClose = () => {
    modalState.close()
  }

  const deactivateAllDriversMutation = useMutation(
    DriverApi.deactivateAllDrivers,
    {
      onSuccess: () => {
        getDrivers()
        toast.success('Drivers was deactivated successfully!')
      },
      onError: (error: AxiosError<{message: string}>) => {
        toast.error(error.response.data.message)
      },
    }
  )

  const onConfirm = () => {
    deactivateAllDriversMutation.mutate()
  }
  
  return (
    <Modal.Root
      open={modalState.open}
      onClose={handleClose}
    >
      <div className='p-5'>
        <h2 className='text-center mb-5'>Deactivate all drivers?</h2>
        <div className='d-flex align-items-center justify-content-between gap-5'>
          <Button
            label='Cancel'
            onClick={handleClose}
          />
          <Button
            label='Deactivate'            
            mode='remove'
            mainButton
            onClick={onConfirm}
          />
        </div>
      </div>
    </Modal.Root>
  )
}