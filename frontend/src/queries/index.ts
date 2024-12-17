import { getvehicles, updateprops, VehicleFormInputs } from "@/types";
import axios from "axios";
import { VITE_BACKEND_API } from "./api";

export const fetchVehicles = async ({ page, limit }: getvehicles) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const response = await axios.get(
    `${VITE_BACKEND_API}/vehicles/${userId}/?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createvechiles = async (data: VehicleFormInputs) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userData = {
    name: data.name,
    status: data.status,
    userId: userId,
  };

  await axios.post(`${VITE_BACKEND_API}/vehicles`, userData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const deletevechile = async (id: string) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${VITE_BACKEND_API}/vehicles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const updatevechile = async ({ id, data }: updateprops) => {
  const token = localStorage.getItem("token");

  await axios.put(`${VITE_BACKEND_API}/vehicles/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const searchVechile = async (q: string) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const response = await axios.post(
    `${VITE_BACKEND_API}/vehicles/${userId}/search`,
    { q },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
