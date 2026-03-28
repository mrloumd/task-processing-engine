import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { metricsApi, tasksApi } from '@/lib/api';
import type {
  CreateTaskPayload,
  TaskStatus,
  TasksQueryParams,
} from '@task-processing-engine/shared';
import { TERMINAL_STATUSES } from '@task-processing-engine/shared';

// ─── Task list (paginated + filterable) ───────────────────────────────────────

export function useTasks(params?: TasksQueryParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksApi.getAll(params),
  });
}

// ─── Single task (auto-polling until terminal) ────────────────────────────────

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getById(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status as TaskStatus | undefined;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return 2000;
    },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useRetryTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.retry(id),
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks', data._id], data);
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCancelTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.cancel(id),
    onSuccess: (data) => {
      queryClient.setQueryData(['tasks', data._id], data);
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: metricsApi.getSummary,
    refetchInterval: 5000,
  });
}
