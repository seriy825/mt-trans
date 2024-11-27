import React from 'react'
import {DriversTable} from './components/table/drivers-table'
import {useDriversPage} from './useDriversPage'
import {CreateOrUpdateDriver} from './components/updateWindow/update-driver'
import { ConfirmModal } from './components/confim-modal/confirm-modal'

export const DriversPage: React.FC = () => {
  const {models, commands} = useDriversPage()
  return (
    <>
      <h2>Drivers</h2>
      <DriversTable
        updatingActiveStatusDriverId={models.updatingActiveStatusDriverId}
        drivers={models.drivers}
        isAfterUpdate={models.isAfterUpdate}
        onActivate={commands.handleActivateClick}
        onDeactivateAll={commands.handleDeactivateAllClick}
        onDeactivate={commands.handleDectivateClick}
        onEditClick={commands.handleOpenEdit}
        onCreateClick={commands.handleOpenCreate}
      />
      <CreateOrUpdateDriver
        onDeleteClick={commands.handleDeleteClick}
        onCreateOrEdit={commands.createClick}
        isEdit={models.isEditMode}
        isVisible={models.isEditMode || models.isCreateMode}
        onHide={commands.handleCloseEdit}
        formik={models.formik}
        isLoading={models.isLoading}
        isDeleting={models.isDeleting}
      />
      <ConfirmModal />
    </>
  )
}
