import { BellIcon, Globe, HomeIcon, UsersIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { SidebarLink } from './SidebarLink'

export const Sidebar = () => {
    const { authUser, isLoading } = useAuth()
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <aside className='w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0'>
            <div className="mb-4 flex items-center justify-center gap-3 my-3">
                <Globe className="size-9 text-primary" />
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Fluently
                </span>
            </div>
            <nav className='flex-1 p-4 space-y-1'>
                <SidebarLink name="Accueil" to={"/"} currentPath={currentPath} Icon={HomeIcon}/>
                <SidebarLink name="Amis" to={"/friends"} currentPath={currentPath} Icon={UsersIcon}/>
                <SidebarLink name="Notifications" to={"/notifications"} currentPath={currentPath} Icon={BellIcon}/>
            </nav>
            {/*USER PROFILE SECTION */}
            <div className='mt-auto p-4'>
                <div className='flex items-center gap-3'>
                    <div className="avatar">
                        {authUser && <img
                            src={authUser?.picture}
                            alt="User profile picture"
                            className='size-12 object-cover'
                        />}
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                        <p className="font-semibold text-md">{authUser?.fullname}</p>
                        <p className='flex items-center gap-2 text-success text-xs'>
                            <span className='size-1 bg-success rounded-full'></span>
                            <span>En ligne</span>
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
