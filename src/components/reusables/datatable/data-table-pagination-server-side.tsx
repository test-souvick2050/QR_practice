import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { type Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows ? pageIndex * pageSize + 1 : 0;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageSizes = [10, 20, 30, 40, 50];

  const generatePageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    const maxShown = 5;

    if (pageCount <= maxShown + 2) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      if (pageIndex <= 2) {
        pages.push(0, 1, 2, 3, 'dots', pageCount - 1);
      } else if (pageIndex >= pageCount - 3) {
        pages.push(0, 'dots', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1);
      } else {
        pages.push(0, 'dots', pageIndex - 1, pageIndex, pageIndex + 1, 'dots', pageCount - 1);
      }
    }

    return pages;
  };

  return (
    <div className="data-table-pagination flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
      <div className="text-muted-foreground text-sm">
        Showing <strong>{startRow}</strong> - <strong>{endRow}</strong> of{' '}
        <strong>{totalRows}</strong> {totalRows <= 1 ? 'result' : 'results'}
      </div>

      <div className="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row md:justify-end">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium md:block">Size</p>
          <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(Number(value))}>
            <SelectTrigger className="h-10 w-[70px] gap-2 rounded-md pr-2">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {generatePageNumbers().map((page, i) =>
            page === 'dots' ? (
              <span key={i} className="text-muted-foreground px-2 text-sm">
                •••
              </span>
            ) : (
              <Button
                key={i}
                variant={page === pageIndex ? 'default' : 'outline'}
                size="icon"
                onClick={() => table.setPageIndex(page)}
                className="rounded-md"
              >
                {page + 1}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            className="rounded-md"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm font-medium">
          Page {pageIndex + 1} of {pageCount || 1}
        </div>
      </div>
    </div>
  );
}
