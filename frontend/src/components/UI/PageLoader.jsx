import { LoaderIcon } from 'lucide-react'
import { useThemeStore } from '../../store/useThemeStore'

export const PageLoader = () => {
  const {theme} = useThemeStore
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <LoaderIcon className='size-10 animate-spin text-primary'/>
    </div>
  )
}
