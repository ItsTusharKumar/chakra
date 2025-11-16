import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Custom query function for auth endpoint that returns null on 401
const authQueryFn: QueryFunction = async ({ queryKey }) => {
  const url = queryKey.join("/") as string;
  
  // Special handling for auth endpoint
  if (url === "/api/auth/user") {
    const res = await fetch(url, { credentials: "include" });
    if (res.status === 401) {
      return null; // Return null instead of throwing on auth endpoint
    }
    await throwIfResNotOk(res);
    return await res.json();
  }
  
  // Default behavior for other endpoints
  return getQueryFn({ on401: "throw" })({ queryKey });
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: authQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
