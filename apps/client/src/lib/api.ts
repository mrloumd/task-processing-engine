import axios from 'axios';
import type { CreateTaskPayload, TaskItem } from '@task-processing-engine/shared';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface HealthResponse {
  status: string;
  mongodb: {
    status: 'connected' | 'disconnected';
  };
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const { data } = await http.get<HealthResponse>('/health');
    return data;
  },
};

export const tasksApi = {
  getAll: async (): Promise<TaskItem[]> => {
    const { data } = await http.get<TaskItem[]>('/tasks');
    return data;
  },

  getById: async (id: string): Promise<TaskItem> => {
    const { data } = await http.get<TaskItem>(`/tasks/${id}`);
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<TaskItem> => {
    const { data } = await http.post<TaskItem>('/tasks', payload);
    return data;
  },
};
