import { createStore, StoreOptions, Store } from 'vuex';
import { RootState } from './types';
import user from './modules/user';
import userData from './modules/userData';

const storeOptions: StoreOptions<RootState> = {
  state: {} as RootState,
  modules: {
    user,
    userData
  },
  strict: process.env.NODE_ENV !== 'production'
};

// Создаем store
const store = createStore<RootState>(storeOptions);

// Экспортируем store
export default store;

// Экспортируем типизированный хук useStore
export function useTypedStore(): Store<RootState> {
  return store as Store<RootState>;
}

// Экспортируем тип
export type AppStore = typeof store;