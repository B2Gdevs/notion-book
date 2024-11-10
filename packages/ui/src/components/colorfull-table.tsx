'use client';

import { Row, Table as TanStackTable, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { ReactElement, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DEFAULT_TABLE_PAGE_SIZE, TableControlHeader } from '..';
import { DataTablePagination } from './datatable-pagination';
import { PageTitleDisplay } from './page-title-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface CellRefs {
    [rowIndex: number]: {
        [cellIndex: number]: React.RefObject<HTMLTableCellElement>;
    };
}

export interface ColorfullTableProps<T> {
    tableInstance: TanStackTable<T>;
    subtitle?: string;
    title?: string;
    isTitleHidden?: boolean;
    globalFilter?: string;
    setGlobalFilter?: (filter: string) => void;
    isLoading: boolean;
    globalFilterEnabled?: boolean;
    enableDownload?: boolean;
}

export const ColorfullTable = <T,>({
    tableInstance,
    title,
    isTitleHidden = false,
    globalFilter,
    setGlobalFilter,
    isLoading,
    globalFilterEnabled = false,
    enableDownload = false,
}: ColorfullTableProps<T>): ReactElement => {
    const tableBodyContainerRef = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<CellRefs>({});

    const rowVirtualizer = useVirtualizer({
        count: tableInstance.getRowModel().rows.length,
        estimateSize: () => 50,
        getScrollElement: () => tableBodyContainerRef.current,
    });

    const { rows } = tableInstance.getRowModel();
    const tableBodyHeight = Math.min(rows.length * 50, 64);

    useEffect(() => {
        const newCellRefs: CellRefs = {};
        rows.forEach((row, rowIndex) => {
            if (!newCellRefs[rowIndex]) {
                newCellRefs[rowIndex] = {};
            }
            row.getVisibleCells().forEach((_, cellIndex) => {
                if (!newCellRefs[rowIndex][cellIndex]) {
                    newCellRefs[rowIndex][cellIndex] = React.createRef<HTMLTableCellElement>();
                }
            });
        });
        cellRefs.current = newCellRefs;
    }, [rows]);

    const downloadCSV = () => {
        const csvData = rows.map((row, rowIndex) => {
            return row.getVisibleCells().map((_, cellIndex) => {
                const cellRef = cellRefs.current[rowIndex][cellIndex];
                const textContent = cellRef.current ? cellRef.current.innerText : '';
                return `"${textContent.replace(/"/g, '""')}"`;
            }).join(',');
        }).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'table-data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div ref={tableBodyContainerRef}>
            {!isTitleHidden && <PageTitleDisplay overrideTitle='Home' additionalText={title} />}
            <TableControlHeader
                value={globalFilter ?? ''}
                onChange={(value: string) => setGlobalFilter?.(value)}
                tableInstance={tableInstance}
                enableDownload={enableDownload}
                enableFilter={globalFilterEnabled}
                downloadCSV={downloadCSV}
            />

            {isLoading ? (
                <Skeleton count={10} />
            ) : (
                <Table>
                    <TableHeader>
                        {tableInstance.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead
                                        key={header.id + 'a1'}
                                        className='py-2 font-righteous text-primary-almost-black-light'>
                                        <>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody style={{ height: `${tableBodyHeight}px` }} className='overflow-y-auto w-full'>
                        {rowVirtualizer.getVirtualItems().map((virtualRow, _) => {
                            const row = rows[virtualRow.index] as Row<T>;
                            if (!row) return null;
                            return (
                                <TableRow key={row.id}>
                                    {/* Modify the rendering of TableCell to handle potentially undefined refs */}
                                    {row.getVisibleCells().map((cell, cellIndex) => {
                                        const cellRef = cellRefs.current[row.index] && cellRefs.current[row.index][cellIndex];
                                        return (
                                            <TableCell ref={cellRef} key={cell.id} className="text-primary-almost-black">
                                                <>{flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
            <div className="flex items-center gap-2 py-2">
                <DataTablePagination
                    defaultNumPagesProps={{
                        table: tableInstance,
                        defaultPageSize: DEFAULT_TABLE_PAGE_SIZE
                    }}
                    table={tableInstance} />
            </div>
        </div>
    );
}