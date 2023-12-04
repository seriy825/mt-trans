export type DriverType = 'US CITIZEN' | 'GREEN CARD' | 'NO BORDER'

export type CarType = 'box truck' | 'sprinter' | 'large'

export interface IPosition{
  lat:number
  lng:number
}
export interface IDriver {
  id: number
  name: string
  position: number[]
  active: boolean  
  status: DriverType
  locationName?:string
  home?:string
  note?:string
  owner?:string
  phone?:string
  typeCar?:CarType
  zipCode?:number
  dimension?:string
  dateAvailable?:string
  capacity?:number
  telegram?:string
  distance?:number
}