import {DriverApi} from 'app/api/driver-api/driver-api'
import {selectDrivers, selectIsAfterUpdate} from 'app/store/driver/selects'
import {useDriverState} from 'app/store/driver/state'
import {AxiosError} from 'axios'
import {FormikProps, useFormik} from 'formik'
import {useState} from 'react'
import {useMutation} from 'react-query'
import {toast} from 'react-toastify'
import {IDriver} from 'shared/types/api-types/driver'
import {driverSchema} from './schema/driver-schema'
import moment from 'moment'

export const useDriversPage = () => {
  const drivers = selectDrivers()
  const [isEditMode, setIsEditMode] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [editableDriver, setEditableDriver] = useState<IDriver | null>(null)
  const {updateDriver, deleteDriver} = useDriverState()
  const [updatingActiveStatusDriverId, setUpdatingActiveStatusDriverId] =
    useState<number>(null)
  const isAfterUpdate = selectIsAfterUpdate()

  const updateDriverMutation = useMutation<
    IDriver,
    AxiosError<{message: string}>,
    IDriver
  >(DriverApi.updateDriver, {
    onSuccess: (data: IDriver) => {
      setIsEditMode(false)
      updateDriver(data)
      setIsCreateMode(false)
      setEditableDriver(null)
      setUpdatingActiveStatusDriverId(null)
      toast.success('Driver was updated successfully!')
    },
    onError: (error: AxiosError<{message: string}>) => {
      setIsEditMode(false)
      setEditableDriver(null)
      setUpdatingActiveStatusDriverId(null)
      toast.error(error.response.data.message)
    },
  })

  const createDriverMutation = useMutation<
    IDriver,
    AxiosError<{message: string}>,
    IDriver
  >(DriverApi.createDriver, {
    onSuccess: (data: IDriver) => {
      setIsEditMode(false)
      setIsCreateMode(false)
      updateDriver(data)
      setEditableDriver(null)
      toast.success('Driver was created successfully!')
    },
    onError: (error: AxiosError<{message: string}>) => {
      setIsEditMode(false)
      setEditableDriver(null)
      toast.error(error.response.data.message)
    },
  })

  const deleteDriverMutation = useMutation<
    void,
    AxiosError<{message: string}>,
    number
  >(DriverApi.deleteDriver, {
    onSuccess: (data: void, id: number) => {
      setIsEditMode(false)
      setEditableDriver(null)
      setUpdatingActiveStatusDriverId(null)
      deleteDriver(id)
      toast.success('Driver was deleted successfully!')
    },
    onError: (error: AxiosError<{message: string}>) => {
      setIsEditMode(false)
      toast.error(error.response.data.message)
    },
  })

  const initialValues: IDriver = {
    active: editableDriver?.active ? editableDriver.active : false,
    dateAvailable: editableDriver?.dateAvailable
      ? editableDriver.dateAvailable
      : null,
    id: editableDriver?.id ? editableDriver.id : null,
    name: editableDriver?.name ? editableDriver.name : '',
    owner: editableDriver?.owner ? editableDriver.owner : '',
    phone: editableDriver?.phone ? editableDriver.phone : '',
    telegram: editableDriver?.telegram ? editableDriver.telegram : '',
    typeCar: editableDriver?.typeCar ? editableDriver.typeCar : null,
    dimension: editableDriver?.dimension ? editableDriver.dimension : '',
    capacity: editableDriver?.capacity ? editableDriver.capacity : null,
    status: editableDriver?.status ? editableDriver.status : null,
    home: editableDriver?.home ? editableDriver.home : '',
    position: editableDriver?.position ? editableDriver.position : null,
    zipCode: editableDriver?.zipCode ? editableDriver.zipCode : null,
    locationName: editableDriver?.locationName
      ? editableDriver.locationName
      : '',
    note: editableDriver?.note ? editableDriver.note : '',
  }

  const formik: FormikProps<IDriver> = useFormik({
    initialValues,
    validationSchema: driverSchema(drivers, !isEditMode),
    enableReinitialize: true,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      try {
        if (!isEditMode && isCreateMode) createDriverMutation.mutate(values)
        if (!isCreateMode && isEditMode) updateDriverMutation.mutate(values)
      } catch (error) {
        console.error(error)
        setStatus('Something is went wrong! Try again later.')
        setSubmitting(false)
      }
    },
  })

  const createClick = () => {
    formik.submitForm()
  }

  const handleOpenEdit =
    (driver: IDriver) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setEditableDriver(driver)
      setIsEditMode(true)
    }
  const handleOpenCreate = () => {
    setIsCreateMode(true)
  }
  const handleCloseEdit = () => {
    setEditableDriver(null)
    setUpdatingActiveStatusDriverId(null)
    formik.resetForm()
    setIsEditMode(false)
    setIsCreateMode(false)
  }

  const handleDeleteClick = () => {
    deleteDriverMutation.mutate(editableDriver.id)
  }

  const handleActivateClick =
    (driver: IDriver) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const updatedDriver: IDriver = {
        ...driver,
        active: true,
        dateAvailable: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
      }
      setUpdatingActiveStatusDriverId(driver.id)
      updateDriverMutation.mutate(updatedDriver)
    }

  const handleDectivateClick =
    (driver: IDriver) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const updatedDriver = {...driver, active: false}
      setUpdatingActiveStatusDriverId(driver.id)
      updateDriverMutation.mutate(updatedDriver)
    }

  const isLoading =
    createDriverMutation.isLoading || updateDriverMutation.isLoading

  return {
    models: {
      drivers,
      isEditMode,
      isCreateMode,
      editableDriver,
      isLoading,
      formik,
      updatingActiveStatusDriverId,
      isDeleting: deleteDriverMutation.isLoading,
      isAfterUpdate,
    },
    commands: {
      handleOpenEdit,
      handleCloseEdit,
      handleOpenCreate,
      createClick,
      handleDeleteClick,
      handleActivateClick,
      handleDectivateClick,
    },
  }
}
