import { TicketsSchema } from "@/components/CreateVM";

export interface LoginFormProps {
  setLogin: (isLogin: boolean) => void;
}

export interface RegFormProps {
  setLogin: (isLogin: boolean) => void;
}

export interface User {
  username: string;
  password: string;
}

export interface TableTickets {
  user: any;
  index: number;
  _id: string;
  title: string;
  description: string;
  status: string;
}

export type VmTableProps = {
  data: TableVehchile[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  isPending: boolean;
  isError: boolean;
  totalPages: number;
};

export type getvehicles = {
  page: number;
  limit: number;
};

export type deletevehicle = {
  id: string;
};

export type TicketsFormInputs = z.infer<typeof TicketsSchema>;

export type updateprops = {
  id: string;
  data: VehicleFormInputs;
};
