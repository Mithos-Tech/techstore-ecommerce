import { useState, useEffect, useCallback } from 'react';
import { getCollection } from '../firebase';

const FETCH_TIMEOUT = 2000; // 2 seconds

export const useFirebaseData = <T extends { id: string }>(collectionName: string, fallbackData?: T[]) => {
  const [data, setData] = useState<T[]>(fallbackData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let didTimeout = false;

    const timeoutId = setTimeout(() => {
      didTimeout = true;
      if (fallbackData) {
        console.warn(`Firebase fetch for '${collectionName}' timed out. Using fallback data.`);
        setData(fallbackData);
      }
      setLoading(false);
    }, FETCH_TIMEOUT);

    try {
      const result = await getCollection<T>(collectionName);
      clearTimeout(timeoutId);
      
      if (!didTimeout) {
        if (result && result.length > 0) {
          setData(result);
        } else {
          if (fallbackData) {
            console.warn(`Firebase collection '${collectionName}' is empty or invalid. Using fallback data.`);
            setData(fallbackData);
          } else {
            setData([]);
          }
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (!didTimeout) {
        console.error(`Error fetching from Firebase for '${collectionName}'.`, err);
        setError(err as Error);
        if (fallbackData) {
          console.warn('Using fallback data due to Firebase error.');
          setData(fallbackData);
        }
      }
    } finally {
      if (!didTimeout) {
        setLoading(false);
      }
    }
  }, [collectionName, fallbackData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};