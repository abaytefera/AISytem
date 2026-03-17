import { APi } from "./CenteralAPI"

const dashboard=APi.injectEndpoints({
  endpoints: (builder) => ({

    getDashboardData: builder.query({
      query: () => '/analytics/dashboard-stats',
      // Polling: Refresh every 30 seconds for "Live" feel
      pollingInterval: 30000, 
    }),
    getSystemStats: builder.query({
      query: () => '/analytics/system-stats',
     
      providesTags: ['SystemStats'],
      pollingInterval: 60000, 
    }),
  })
})
export const  {useGetDashboardDataQuery,useGetSystemStatsQuery}=dashboard