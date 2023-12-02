import {ReactComponent as Logo} from './collection/logo.svg'
import {ReactComponent as HidePassword} from './collection/hide-password.svg'
import {ReactComponent as ShowPassword} from './collection/show-password.svg'
import {ReactComponent as User} from './collection/auth-user.svg'
import {ReactComponent as Key} from './collection/key.svg'
import {ReactComponent as Clear} from './collection/close.svg'
import {ReactComponent as Settings} from './collection/settings.svg'
import {ReactComponent as Filter} from './collection/filter.svg'
import {ReactComponent as Copy} from './collection/copy.svg'
import {ReactComponent as Telegram} from './collection/telegram.svg'
import {ReactComponent as Activate} from './collection/activate.svg'
import {ReactComponent as Deactivate} from './collection/deactivate.svg'
import {ReactComponent as Edit} from './collection/edit.svg'

export const ICON_COLLECTION = {
  logo: Logo,
  hidePassword:HidePassword,
  showPassword:ShowPassword,
  user:User,
  key:Key,
  clear:Clear,
  settings:Settings,
  filter:Filter,
  copy:Copy,
  telegram:Telegram,
  activate:Activate,
  deactivate:Deactivate,
  edit:Edit
}

type Keys = keyof typeof ICON_COLLECTION
export type IconCollectionType = typeof ICON_COLLECTION[Keys]
