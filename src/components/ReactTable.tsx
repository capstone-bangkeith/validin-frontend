import clsx from 'clsx';
import * as React from 'react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { HiSearch } from 'react-icons/hi';
import ReactPaginate from 'react-paginate';
import {
  Column,
  PluginHook,
  TableOptions,
  useGlobalFilter,
  useSortBy,
  useTable,
} from 'react-table';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props<T extends object = {}> = {
  data: readonly T[];
  columns: readonly Column<T>[];
  options?: Omit<TableOptions<T>, 'data' | 'columns'>;
  plugins?: PluginHook<T>[];
  className?: string;
  withFooter?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export default function ReactTable<T extends object>({
  data,
  columns,
  options,
  plugins = [],
  className,
  withFooter = true,
}: Props<T>) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>(
      { ...options, data, columns },
      useGlobalFilter,
      useSortBy,
      ...plugins
    );

  return (
    <div className={clsx('flex w-full flex-col', className)}>
      <div>
        <label className='sr-only text-gray-500'>Filter</label>
        <div className='relative'>
          <input
            placeholder='Find...'
            className={clsx(
              'w-full rounded-md dark:bg-dark sm:max-w-xs',
              'px-4 py-2 pl-9',
              'placeholder-gray-400',
              'text-sm md:text-base',
              'border border-gray-300 dark:border-gray-600',
              'focus:border-primary-300 focus:outline-none dark:focus:border-primary-300'
            )}
          />
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
            <HiSearch className='text-xl text-gray-400' />
          </div>
        </div>
      </div>

      <div className='-my-2 mt-2 overflow-x-auto'>
        <div className='inline-block min-w-full py-2 align-middle'>
          <div className='overflow-hidden border-b border-gray-200 shadow-sm dark:border-gray-800 sm:rounded-lg'>
            <table
              {...getTableProps()}
              className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'
            >
              <thead className='bg-gray-50 dark:bg-gray-700'>
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        key={column.id}
                        scope='col'
                        className='group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-200'
                      >
                        <div
                          className={clsx(
                            'relative flex items-center gap-4 py-1',
                            'justify-center'
                          )}
                        >
                          <p>{column.render('Header')}</p>
                          <span className='flex flex-col items-center justify-center'>
                            <GoTriangleUp
                              className={clsx(
                                'transition-opacity',
                                'text-gray-700 dark:text-gray-200'
                              )}
                            />
                            <GoTriangleDown
                              className={clsx(
                                '-mt-1 transition-opacity',
                                'text-gray-700 dark:text-gray-200'
                              )}
                            />
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows?.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={index}
                      className={clsx(
                        index % 2 === 0
                          ? 'bg-white dark:bg-dark'
                          : 'bg-gray-50 dark:bg-gray-800'
                      )}
                    >
                      {row?.cells?.map((cell, i) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className={clsx(
                              'whitespace-nowrap px-6 py-4 text-center text-sm text-gray-700',
                              i === 0
                                ? 'font-medium text-gray-900 dark:text-gray-50'
                                : 'text-gray-500  dark:text-gray-200'
                            )}
                            key={i}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              {withFooter && (
                <tfoot className='bg-gray-50 dark:bg-gray-700'>
                  {/* {footerGroups.map((footerGroup, index) => (
                    <tr
                      {...footerGroup.getFooterGroupProps()}
                      key={index}
                      className='group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-200'
                    >
                      {footerGroup.headers.map((column) => (
                        <td
                          {...column.getFooterProps()}
                          className={clsx(
                            'px-6 py-3 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-200',
                            'text-center'
                          )}
                          key={column.id}
                        >
                          {column.render('Footer')}
                        </td>
                      ))}
                    </tr>
                  ))} */}
                  <tr>
                    <td colSpan={columns.length} className='text-center'>
                      <ReactPaginate
                        pageCount={10}
                        className='flex list-none flex-row justify-between p-4 px-20'
                      />
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
