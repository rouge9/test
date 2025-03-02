import { TableTickets, VmTableProps } from "@/types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Loader from "./Loader";
// import { deletevechile } from "@/queries";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import DeleteDialog from "./DeleteDialog";
import CreateVM from "./CreateVM";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const columnHelper = createColumnHelper<TableTickets>();

const columns = [
  columnHelper.accessor("index", {
    cell: (info) => info.row.index + 1,
    header: () => <span>#</span>,
  }),
  columnHelper.accessor("_id", {
    cell: (info) => info.getValue().slice(0, 5),
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
  }),

  columnHelper.accessor("description", {
    cell: (info) => info.getValue().slice(0, 10),
    header: () => <span>description</span>,
  }),

  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: () => <span>Status</span>,
  }),
];

export default function VmTable({
  data,
  setCurrentPage,
  currentPage,
  isPending,
  isError,
  totalPages,
}: VmTableProps) {
  // const { toast } = useToast();

  // const queryClient = useQueryClient();

  const table = useReactTable({
    data: data,
    columns,
    initialState: {
      pagination: { pageIndex: 0 },
      columnVisibility: { _id: false },
      expanded: true,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const deleteMutation = useMutation({
  //   mutationFn: deletevechile,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["tickets", currentPage] });
  //     toast({
  //       title: "Success",
  //       description: "Vehicle deleted successfully",
  //       variant: "default",
  //       className: "bg-green-500 text-white",
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete vehicle",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const handleDelete = (data: TableTickets) => {
  //   deleteMutation.mutate(data._id);
  // };
  const role = localStorage.getItem("role");
  return (
    <>
      {isPending || isError ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          {/* <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left text-white">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="3xl:pb-2 pb-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-dashed border-gray-400 text-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className=" 2xl:py-2 xl:py-1 ">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td className=" 2xl:py-2 xl:py-1">
                    <div className="flex space-x-2">
                      <CreateVM
                        currentPage={currentPage}
                        vehicleData={row.original}
                      />

                      <DeleteDialog
                        onConfirm={() => {
                          handleDelete(row.original);
                        }}
                        message="Are you sure you want to delete this vehicle?"
                        isDeleting={deleteMutation.isPending}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="text-white">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-white font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  {role === "admin" && (
                    <TableHead className="text-white font-bold">
                      Assigned To
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-dashed border-gray-400 text-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {role === "admin" && (
                    <TableCell className="text-white">
                      <span>{row.original?.user?.email}</span>
                    </TableCell>
                  )}
                  <TableCell>
                    {role === "admin" && (
                      <div className="flex space-x-2">
                        <CreateVM
                          currentPage={currentPage}
                          TicketsData={row.original}
                        />

                        {/* <DeleteDialog
                          onConfirm={() => {
                            handleDelete(row.original);
                          }}
                          message="Are you sure you want to delete this vehicle?"
                          isDeleting={deleteMutation.isPending}
                        /> */}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* pagination */}
          <div className="flex justify-center items-center space-x-5 mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              <ChevronLeft />
            </Button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
