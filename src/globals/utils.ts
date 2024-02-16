import { URL_CONFIG } from "~/config";

type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchParams {
  path: string;
  method?: HTTP_METHOD;
  body?: any;
  cacheResult?: boolean;
}

interface CachedData<T> {
  data: T;
  expiryTime: number;
}

const cache = new Map<string, CachedData<any>>();
const CACHE_TIME = 2 * 60 * 1000; // 2 minutes

export async function fetchData<T>({
  path,
  method,
  body,
  cacheResult = true,
}: FetchParams): Promise<T> {
  const cacheKey = `${method}-${path}-${JSON.stringify(body)}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.expiryTime > Date.now()) {
    // Return cached data if it's still valid
    return cached.data as T;
  }

  const response = await fetch(`${URL_CONFIG.BASE_URL}/${path}`, {
    method,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const res = await response.json();

  if (res) {
    // Cache the fetched data 
    const newCachedData: CachedData<any> = {
      data: res,
      expiryTime: Date.now() + CACHE_TIME,
    };
    if (cacheResult) {
      cache.set(cacheKey, newCachedData);
    }

    return res as T;
  } else {
    throw new Error('Error fetching data');
  }
}


export function formatNumber(value: any, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    ...options,
  }).format(Number(value));
}