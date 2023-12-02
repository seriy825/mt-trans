import React from 'react'
import {Dropdown, DropdownButton} from 'react-bootstrap'
import {Icon} from 'shared/components/icon/icon'
import {ICON_COLLECTION} from 'shared/components/icon/icon-list'
import {THEMES, Theme} from 'shared/constants/theme'

interface IThemeDropdownComponent {
  activeTheme: Theme
  onChangeTheme: (
    changeTheme: Theme | string
  ) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const ThemeDropdownComponent: React.FC<IThemeDropdownComponent> = (
  props: IThemeDropdownComponent
) => {
  const {activeTheme, onChangeTheme} = props
  const themes = Object.keys(THEMES)
  return (
    <DropdownButton
      id='dropdown-item-button'
      title={<Icon icon={ICON_COLLECTION.settings} />}
      variant='Secondary'
      menuVariant='dark'
    >
      {themes.map((theme) => {
        const themeLabel = theme[0].toUpperCase() + theme.substring(1)
        return (
          <Dropdown.Item
            key={theme}
            as='button'
            active={activeTheme === theme}
            onClick={onChangeTheme(theme.toLowerCase())}
          >
            {themeLabel}
          </Dropdown.Item>
        )
      })}
    </DropdownButton>
  )
}

export const ThemeDropdown = React.memo(ThemeDropdownComponent)
