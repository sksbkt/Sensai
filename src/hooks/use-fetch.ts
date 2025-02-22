/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { updateUser } from "@/actions/user";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: typeof updateUser) => {
  const [data, setData] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const fn = async (...args: Parameters<typeof updateUser>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
