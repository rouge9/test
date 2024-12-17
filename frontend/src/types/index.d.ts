import { vehicleSchema } from "@/components/CreateVM";

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

export interface TableVehchile {
  index: number;
  _id: string;
  name: string;
  status: string;
  updatedAt: string;
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

export type VehicleFormInputs = z.infer<typeof vehicleSchema>;

export type updateprops = {
  id: string;
  data: VehicleFormInputs;
};
