import axios from 'axios';
import type {
  CreateTaskPayload,
  MetricsSummary,
  TaskItem,
  TasksQueryParams,
  TasksResponse,
} from '@task-processing-engine/shared';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Health ───────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  mongodb: { status: 'connected' | 'disconnected' };
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const { data } = await http.get<HealthResponse>('/health');
    return data;
  },
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  getAll: async (params?: TasksQueryParams): Promise<TasksResponse> => {
    const { data } = await http.get<TasksResponse>('/tasks', { params });
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

  retry: async (id: string): Promise<TaskItem> => {
    const { data } = await http.patch<TaskItem>(`/tasks/${id}/retry`);
    return data;
  },

  cancel: async (id: string): Promise<TaskItem> => {
    const { data } = await http.patch<TaskItem>(`/tasks/${id}/cancel`);
    return data;
  },
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  send: async (payload: ContactPayload): Promise<{ message: string }> => {
    const { data } = await http.post<{ message: string }>('/contact', payload);
    return data;
  },
};

// ─── Metrics ──────────────────────────────────────────────────────────────────

export const metricsApi = {
  getSummary: async (): Promise<MetricsSummary> => {
    const { data } = await http.get<MetricsSummary>('/metrics/summary');
    return data;
  },
};
