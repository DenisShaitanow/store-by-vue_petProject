// store/types.ts
import { UserState } from './modules/user';
import { IUserState as UserDataState } from './modules/userData';
// Импортируйте типы для других модулей, если есть

export interface RootState {
  user: UserState;
  userData: UserDataState;
}
