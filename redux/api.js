import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const randomStringsApi = createApi({
  reducerPath: "randomStringsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["RandomStrings"],
  endpoints: (builder) => ({
    getRandomStrings: builder.query({
      query: () => "/random-strings",
      providesTags: ["RandomStrings"],
    }),
    createRandomString: builder.mutation({
      query: () => ({
        url: "/random-strings",
        method: "POST",
      }),
      invalidatesTags: ["RandomStrings"],
    }),
  }),
});

export const {
  useGetRandomStringsQuery,
  useCreateRandomStringMutation,
} = randomStringsApi;
