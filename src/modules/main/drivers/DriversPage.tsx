import React from 'react'
import {DriversTable} from './components/table/drivers-table'
import {useDriversPage} from './useDriversPage'
import {CreateOrUpdateDriver} from './components/updateWindow/update-driver'

export const DriversPage: React.FC = () => {
  const {models, commands} = useDriversPage()
  return (
    <>
      <h2>Drivers</h2>
      <DriversTable
        updatingActiveStatusDriverId={models.updatingActiveStatusDriverId}
        drivers={models.drivers}
        onActivate={commands.handleActivateClick}
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
    </>
  )
}
