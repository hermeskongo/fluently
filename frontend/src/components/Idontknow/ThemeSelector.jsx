import { Palette } from 'lucide-react'
import { THEMES } from '../../constants'
import { useThemeStore } from '../../store/useThemeStore'

export const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore()
  return (
    <div className='dropdown dropdown-end'>
      {/*DROPDOWN TRIGGER */}
      <button className='btn btn-ghost btn-circle'>
        <Palette className='size-5' />
      </button>
      <div className='dropdown-content mt-2 p-1 shadow-lg bg-base-200 backdrop-blur-lg 
        rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto'
      >
        <div className='space-y-1'>
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
                  w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors cursor-pointer
                  ${theme === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}
                `}
              onClick={() => setTheme(themeOption.name)}
            >
              <Palette className='size-4' />
              <span className='font-semibold'>{themeOption.label}</span>
              <div className='ml auto flex gap-1'>
                {themeOption.colors.map((color, id) => (
                  <span 
                    key={id}
                    className={`size-2 rounded-full`}
                    style={{ backgroundColor: color}}
                  ></span>
                ))}
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
