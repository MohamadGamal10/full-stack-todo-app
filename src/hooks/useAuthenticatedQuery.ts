import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import axiosInstance from "../config/axios.config";

interface IAuthenticatedQuery {
    queryKey: string[];
    url: string;
    config?: AxiosRequestConfig;
  }
const useCustomQuery = ({queryKey, url, config}: IAuthenticatedQuery) => {

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url, config)
      return data
    }
  })

}

export default useCustomQuery
