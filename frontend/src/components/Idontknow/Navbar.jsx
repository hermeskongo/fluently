import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon, Globe, LogOutIcon } from "lucide-react";
import toast from 'react-hot-toast';
import { Link, useLocation } from "react-router";
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../lib/api';
import { ThemeSelector } from './ThemeSelector';

export const Navbar = () => {
    const { authUser } = useAuth();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");

    const queryClient = useQueryClient();

    const { mutate: logoutMutation } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success("Déconnexion réussi !")
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
    });

    return (
        <nav className={`bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center `}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* LOGO - ONLY IN THE CHAT PAGE */}
                    {isChatPage && (
                        <div className="mb-4 flex items-center justify-center gap-3 my-3">
                            <Globe className="size-9 text-primary" />
                            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Fluently
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to={"/notifications"}>
                            <button className="btn btn-ghost btn-circle">
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    {/* TODO */}
                    <ThemeSelector/>

                    <div className="avatar">
                        <div className="w-9 rounded-full">
                            <img src={authUser?.picture} alt="User Avatar" rel="noreferrer" />
                        </div>
                    </div>

                    {/* Logout button */}
                    <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                        <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;