import { baseApi } from './baseApi';

export const vpsUserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVpsUsers: build.query({
      query: (params) => ({ url: '/vps-users', params }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: (result = []) =>
        ['VpsUser', ...result.map((r) => ({ type: 'VpsUser', id: r.id }))],
    }),
    getVpsUser: build.query({
      query: (id) => `/vps-users/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (_r, _e, id) => [{ type: 'VpsUser', id }],
    }),
    createVpsUser: build.mutation({
      query: (body) => ({ url: '/vps-users', method: 'POST', body }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['VpsUser', 'VpsServer'],
    }),
    updateVpsUser: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `/vps-users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'VpsUser', id }, 'VpsUser', 'VpsServer'],
    }),
    renewVpsUser: build.mutation({
      query: ({ id, subscriptionPlan }) => ({
        url: `/vps-users/${id}/renew`,
        method: 'POST',
        body: { subscriptionPlan },
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: 'VpsUser', id }, 'VpsUser'],
    }),
    deleteVpsUser: build.mutation({
      query: (id) => ({ url: `/vps-users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['VpsUser', 'VpsServer'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVpsUsersQuery,
  useGetVpsUserQuery,
  useCreateVpsUserMutation,
  useUpdateVpsUserMutation,
  useRenewVpsUserMutation,
  useDeleteVpsUserMutation,
} = vpsUserApi;
