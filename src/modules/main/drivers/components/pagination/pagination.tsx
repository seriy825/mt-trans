import {Table} from '@tanstack/react-table'
import clsx from 'clsx'
import React, { useMemo } from 'react'
import {Button} from 'shared/components/button/button'
import {Input} from 'shared/components/input/input'
import styles from './pagination.module.scss'
import Select, { SingleValue } from 'react-select'
import { IDriver } from 'shared/types/api-types/driver'

interface IPaginationComponent {
  table: Table<IDriver>
  currentPageSize:number
  currentPageIndex:number
}

interface IOption{
    value:number,
    label:string
}
const PaginationComponent: React.FC<IPaginationComponent> = (
  props: IPaginationComponent
) => {
  const {table, currentPageSize} = props
  const pageOptions:IOption[] = [
    {value: 2, label: '2'},
    {value: 5, label: '5'},
    {value: 10, label: '10'},
    {value: 20, label: '20'},
    {value: 30, label: '30'},
    {value: 40, label: '40'},
    {value: 50, label: '50'},
  ]
  const pageOption = useMemo(()=>{
    if (!currentPageSize) return null
    return pageOptions.find(option=>option.value===currentPageSize)
  },[currentPageSize])

  return (
    <div className='d-flex align-items-center gap-2'>
      <Button
        type='button'
        mode='text'
        label='<<'
        className={clsx('rounded text-primary', styles.paginationButtom)}
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      />
      <Button
        type='button'
        mode='text'
        label='<'
        className={clsx('rounded text-primary', styles.paginationButtom)}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      />
      <Button
        type='button'
        mode='text'
        label='>'
        className={clsx('rounded text-primary', styles.paginationButtom)}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      />
      <Button
        type='button'
        mode='text'
        label='>>'
        className={clsx('rounded text-primary', styles.paginationButtom)}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      />
      <span className='d-flex align-items-center gap-1'>
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className='d-flex align-items-center gap-1'>
        | Go to page:
        <Input
          type='number'
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            table.setPageIndex(page)
          }}
          className={clsx('border p-1 rounded w-50', styles.pageInput)}
        />
      </span>
      <Select       
        className={styles.select}
        value={pageOption}        
        onChange={(newValue:SingleValue<IOption>) => {    
          table.setPageSize(newValue.value)
        }}
        options={pageOptions}
        defaultValue={pageOption}
      />
    </div>
  )
}

export const Pagination = React.memo(PaginationComponent)
