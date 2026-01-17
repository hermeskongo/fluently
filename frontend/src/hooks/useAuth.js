import {axiosInstance} from "../lib/axios.js";
import {API_PATHS, getAuthUser} from "../lib/api.js";
import {useQuery} from "@tanstack/react-query";

export const useAuth = () => {

    const {data:authData, isLoading, error} = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false
    })
    return {authUser: authData?.user, isLoading, error}
}