import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

export const useAuth = () => {

    const {data:authData, isLoading, error} = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false
    })
    console.log(authData?.user)
    return {authUser: authData?.user, isLoading, error}
}