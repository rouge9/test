import api from "@/api/client";
import { getvehicles, TicketsFormInputs, updateprops } from "@/types";

export const fetchTickets = async ({ page, limit }: getvehicles) => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    `${import.meta.env.VITE_BACKEND_API}/tickets/?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createtickets = async (data: TicketsFormInputs) => {
  const token = localStorage.getItem("token");

  const userData = {
    title: data.title,
    status: data.status,
    description: data.description,
  };

  await api.post(`${import.meta.env.VITE_BACKEND_API}/tickets`, userData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const deletevechile = async (id: string) => {
  const token = localStorage.getItem("token");
  await api.delete(`${import.meta.env.VITE_BACKEND_API}/vehicles/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const updatetickets = async ({ id, data }: updateprops) => {
  const token = localStorage.getItem("token");

  await api.put(`${import.meta.env.VITE_BACKEND_API}/tickets/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach the Bearer token
    },
  });
};

export const searchVechile = async (q: string) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const response = await api.post(
    `${import.meta.env.VITE_BACKEND_API}/vehicles/${userId}/search`,
    { q },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
