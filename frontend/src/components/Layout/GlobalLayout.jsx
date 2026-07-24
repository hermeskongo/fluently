import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const GlobalLayout = ({ showSidebar = false, children }) => {
  return (
    <div className='min-h-screen flex flex-col bg-base-100'>
      <div className='flex flex-1'>
        {showSidebar && <Sidebar />}
        <div className='flex-1 flex flex-col min-w-0'>
          <Navbar />
          <main className='flex-1'>
             {children}
          </main>
        </div>
      </div>
    </div>
  )
}
