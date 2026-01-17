import { Link } from 'react-router-dom'

export const SidebarLink = ({name, currentPath, to, Icon}) => {
  return (
      <Link
          to={to}
          className={`btn btn-ghost w-full gap-3 px-8 py-6 justify-start ${currentPath === to ? 'btn-active' : ''}`}
      >
          <Icon className='size-5 text-base-content opacity-70'/>
          <span>{name}</span>
      </Link>
  )
}
