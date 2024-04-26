import {FormikProps} from 'formik'
import React, {ChangeEvent, useMemo} from 'react'
import {Form, Offcanvas} from 'react-bootstrap'
import {Button} from 'shared/components/button/button'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import {Input} from 'shared/components/input/input'
import {Toggle} from 'shared/components/toggle/toggle'
import {IDriver} from 'shared/types/api-types/driver'
import Select, {SingleValue} from 'react-select'
import moment from 'moment'
import {SELECT_STYLE_CONFIG} from './selects-config'

interface ICreateOrUpdateDriverComponent {
  formik: FormikProps<IDriver>
  isVisible: boolean
  isEdit?: boolean
  isLoading: boolean
  isDeleting: boolean
  onHide: () => void
  onCreateOrEdit: () => void
  onDeleteClick: () => void
}

interface IOption {
  value: string
  label: string
}

const CAR_TYPE_OPTIONS: IOption[] = [
  {value: 'box truck', label: 'Box truck'},
  {value: 'large', label: 'Large'},
  {value: 'sprinter', label: 'Sprinter'},
]

const STATUS_OPTIONS: IOption[] = [
  {value: 'US_CITIZEN', label: 'US CITIZEN'},
  {value: 'GREEN_CARD', label: 'GREEN CARD'},
  {value: 'NO_BORDER', label: 'NO BORDER'},
  {value: 'WORK_AUTHORIZATON', label: 'WORK AUTHORIZATON'},
  {value: 'BORDER', label: 'BORDER'},
]

const CreateOrUpdateDriverComponent: React.FC<
  ICreateOrUpdateDriverComponent
> = (props: ICreateOrUpdateDriverComponent) => {
  const {
    isVisible,
    isEdit,
    formik,
    isLoading,
    isDeleting,
    onHide,
    onCreateOrEdit,
    onDeleteClick,
  } = props

  const onTypeChange = (type: SingleValue<IOption>) => {
    formik.setFieldValue('typeCar', type.value)
  }

  const onStatusChange = (status: SingleValue<IOption>) => {
    formik.setFieldValue('status', status.value)
  }
  const handleToggleActive = () => {
    formik.setFieldValue('active', !formik.values.active)
  }
  const onDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('dateAvailable', new Date(event.target.value))
  }
  const dateValue = useMemo(() => {
    return moment(formik.values.dateAvailable || new Date()).format(
      'YYYY-MM-DDTHH:mm'
    )
  }, [formik.values.dateAvailable])

  return (
    <Offcanvas show={isVisible} onHide={onHide} placement='end'>
      <Offcanvas.Header className='d-flex align-items-center justify-content-between'>
        <Offcanvas.Title className='d-flex flex-row-reverse align-items-center justify-content-between gap-3'>
          {isEdit ? 'Edit driver' : 'Create driver'}
          <Button
            label={<Icon icon={ICON_COLLECTION.clear} />}
            mode='text'
            onClick={onHide}
          />
        </Offcanvas.Title>
        <div className='d-flex align-items-center justify-content-between gap-3'>
          {isEdit && (
            <Button
              label='Delete'
              mode='text'
              className='text-danger'
              onClick={onDeleteClick}
              isLoading={isDeleting}
            />
          )}
          <Button label='Cancel' mode='text' onClick={onHide} />
          <Button
            label={isEdit ? 'Save' : 'Create'}
            className='text-success'
            mode='text'
            onClick={onCreateOrEdit}
            isLoading={isLoading}
          />
        </div>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className='mb-2'>
          <label>Available:</label>
          <Toggle
            isActive={formik.values.active}
            setActive={handleToggleActive}
          />
        </div>
        {!formik.values.active && (
          <div className='mb-2'>
            <label>Date available</label>
            <Input
              placeholder='Id'
              type='datetime-local'
              value={dateValue}
              onChange={onDateChange}
              error={
                formik.touched.dateAvailable && !!formik.errors.dateAvailable
              }
              errorText={
                formik.touched.dateAvailable && formik.errors.dateAvailable
              }
            />
          </div>
        )}
        <div className='mb-2'>
          <label>Id</label>
          <Input
            placeholder='Id'
            type='number'
            {...formik.getFieldProps('id')}
            error={formik.touched.id && !!formik.errors.id}
            errorText={formik.touched.id && formik.errors.id}
          />
        </div>
        <div className='mb-2'>
          <label>Name</label>
          <Input
            placeholder='Name'
            type='text'
            {...formik.getFieldProps('name')}
            error={formik.touched.name && !!formik.errors.name}
            errorText={formik.touched.name && formik.errors.name}
          />
        </div>
        <div className='mb-2'>
          <label>Owner</label>
          <Input
            placeholder='Owner'
            type='text'
            {...formik.getFieldProps('owner')}
            error={formik.touched.owner && !!formik.errors.owner}
            errorText={formik.touched.owner && formik.errors.owner}
          />
        </div>
        <div className='mb-2'>
          <label>Phone</label>
          <Input
            placeholder='Phone'
            type='text'
            {...formik.getFieldProps('phone')}
            error={formik.touched.phone && !!formik.errors.phone}
            errorText={formik.touched.phone && formik.errors.phone}
          />
        </div>
        <div className='mb-2'>
          <label>Telegram</label>
          <Input
            placeholder='Telegram'
            type='text'
            {...formik.getFieldProps('telegram')}
            error={formik.touched.telegram && !!formik.errors.telegram}
            errorText={formik.touched.telegram && formik.errors.telegram}
          />
        </div>
        <div className='mb-2'>
          <label>Type</label>
          <Select
            {...formik.getFieldProps('typeCar')}
            value={CAR_TYPE_OPTIONS.find(
              (option) => option.value === formik.values.typeCar
            )}
            options={CAR_TYPE_OPTIONS}
            placeholder='Type Car'
            onChange={onTypeChange}
            styles={SELECT_STYLE_CONFIG(
              formik.touched.status && formik.errors.typeCar,
              formik.touched.typeCar && !!formik.errors.typeCar
            )}
          />
          {formik.touched.typeCar && !!formik.errors.typeCar && (
            <Form.Control.Feedback
              style={{
                display: 'block',
                color: '#ED4343',
                fontSize: '14px',
                fontWeight: '400',
              }}
              type='invalid'
            >
              {formik.touched.typeCar && formik.errors.typeCar}
            </Form.Control.Feedback>
          )}
        </div>
        <div className='mb-2'>
          <label>Dimension</label>
          <Input
            placeholder='Dimension'
            type='text'
            {...formik.getFieldProps('dimension')}
            error={formik.touched.dimension && !!formik.errors.dimension}
            errorText={formik.touched.dimension && formik.errors.dimension}
          />
        </div>
        <div className='mb-2'>
          <label>Capacity</label>
          <Input
            placeholder='Capacity'
            type='number'
            mode='number'
            step={1}
            min={1}
            {...formik.getFieldProps('capacity')}
            error={formik.touched.capacity && !!formik.errors.capacity}
            errorText={formik.touched.capacity && formik.errors.capacity}
          />
        </div>
        <div className='mb-2'>
          <label>Status</label>
          <Select
            {...formik.getFieldProps('status')}
            value={STATUS_OPTIONS.find(
              (option) => option.value === formik.values.status
            )}
            options={STATUS_OPTIONS}
            placeholder='Status'
            onChange={onStatusChange}
            styles={SELECT_STYLE_CONFIG(
              formik.touched.status && formik.errors.status,
              formik.touched.status && !!formik.errors.status
            )}
          />
          {formik.touched.status && !!formik.errors.status && (
            <Form.Control.Feedback
              style={{
                display: 'block',
                color: '#ED4343',
                fontSize: '14px',
                fontWeight: '400',
              }}
              type='invalid'
            >
              {formik.touched.status && formik.errors.status}
            </Form.Control.Feedback>
          )}
        </div>
        <div className='mb-2'>
          <label>Home</label>
          <Input
            placeholder='Home'
            type='text'
            {...formik.getFieldProps('home')}
            error={formik.touched.home && !!formik.errors.home}
            errorText={formik.touched.home && formik.errors.home}
          />
        </div>
        <div className='mb-2'>
          <label>Zip code</label>
          <Input
            placeholder='Zip code'
            type='text'
            {...formik.getFieldProps('zipCode')}
            error={formik.touched.zipCode && !!formik.errors.zipCode}
            errorText={formik.touched.zipCode && formik.errors.zipCode}
          />
        </div>
        {isEdit && (
          <div className='mb-2'>
            <label>Location name</label>
            <Input
              placeholder='Location name'
              disabled={true}
              type='text'
              {...formik.getFieldProps('locationName')}
            />
          </div>
        )}
        <div className='mb-2'>
          <label>Note</label>
          <Input
            placeholder='Note'
            type='text'
            {...formik.getFieldProps('note')}
            error={formik.touched.note && !!formik.errors.note}
            errorText={formik.touched.note && formik.errors.note}
          />
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export const CreateOrUpdateDriver = React.memo(CreateOrUpdateDriverComponent)
