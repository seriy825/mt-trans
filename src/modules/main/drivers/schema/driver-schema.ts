import { IDriver } from 'shared/types/api-types/driver';
import * as Yup from 'yup'

export const driverSchema = (drivers:IDriver[],isCreateMode:boolean) => Yup.object().shape({
  active: Yup.boolean(),
  id: Yup.number().required('Id is required').test('is-unique', 'ID must be unique', function(value) {
    if (isCreateMode){
      if (!value) return true;
      return (
          drivers.findIndex(driver => driver.id === value) === -1
      );
    }
    return true
  }),
  name: Yup.string().required('Name is required'),
  status: Yup.string().required('Status is required'),
  home:Yup.string().nullable(),
  note:Yup.string().nullable(),
  owner:Yup.string().nullable(),
  phone:Yup.string().required('Phone is required'),
  typeCar:Yup.string().required('Type car is required'),
  zipCode:Yup.string().required('Zip code is required'),
  dimension:Yup.string().required('Dimension is required'),
  dateAvailable:Yup.date().required('Date available is required'),
  capacity:Yup.date().required('Capacity is required'),
  telegram:Yup.string().nullable(),
})
