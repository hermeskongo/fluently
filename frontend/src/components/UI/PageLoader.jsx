import { LoaderIcon } from 'lucide-react'

export const PageLoader = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <LoaderIcon className='size-10 animate-spin text-primary'/>
    </div>
  )
}
