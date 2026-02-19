// store/modules/user.ts
import { Module } from 'vuex';
import {  RegistrationData } from '../../types/index';
import { RootState } from '../types';

import {
    mockedRegisterUserApi,
    mockedLogoutApi,
    mockedGetUserApi,
    mockedLoginUserApi,
    mockUpdateUserApi,
    changeDataInPersonalCabinetApi,
} from '../api';

import { setCookie, getCookie, deleteCookie } from '../cookie';

export interface UserState {
    user: RegistrationData | null;
    isAuth: boolean;
    isAuthChecked: boolean;
    loading: boolean;
    error: string | null;
  }

const state: UserState = {
  user: null,
  isAuth: false,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Типы для мутаций
interface MutationPayloads {
  SET_USER: RegistrationData | null;
  SET_AUTH: boolean;
  SET_AUTH_CHECKED: boolean;
  SET_LOADING: boolean;
  SET_ERROR: string | null;
}

const mutations = {
  SET_USER(state: UserState, user: RegistrationData | null) {
    state.user = user;
  },
  SET_AUTH(state: UserState, isAuth: boolean) {
    state.isAuth = isAuth;
  },
  SET_AUTH_CHECKED(state: UserState, isAuthChecked: boolean) {
    state.isAuthChecked = isAuthChecked;
  },
  SET_LOADING(state: UserState, loading: boolean) {
    state.loading = loading;
  },
  SET_ERROR(state: UserState, error: string | null) {
    state.error = error;
  },
  RESET_ERROR(state: UserState) {
    state.error = null;
  }
};

// Типы для actions
interface ActionContext {
  commit: <K extends keyof typeof mutations>(
    key: K,
    payload: MutationPayloads[K]
  ) => void;
  state: UserState;
  rootState: RootState;
  dispatch: (action: string, payload?: any) => Promise<any>;
}

const actions = {
  // Регистрация пользователя
  async registerUser(
    { commit }: ActionContext,
    userData: RegistrationData
  ): Promise<{ user: RegistrationData | null }> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      const response = await mockedRegisterUserApi(userData);
      const accessToken = response.accessToken.startsWith('Bearer ')
        ? response.accessToken.slice(7)
        : response.accessToken;
      
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      commit('SET_USER', response.user);
      commit('SET_AUTH', true);
      commit('SET_LOADING', false);
      
      return { user: response.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при регистрации';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Изменение данных в личном кабинете
  async changeDataInPersonalCabinet(
    { commit }: ActionContext,
    userData: RegistrationData
  ): Promise<{ user: RegistrationData | null }> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      const response = await changeDataInPersonalCabinetApi(userData);
      const accessToken = response.accessToken.startsWith('Bearer ')
        ? response.accessToken.slice(7)
        : response.accessToken;
      
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      commit('SET_USER', response.user);
      commit('SET_AUTH', true);
      commit('SET_LOADING', false);
      return { user: response.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при изменении данных';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Логин пользователя
  async loginUser(
    { commit }: ActionContext,
    credentials:  { email: string; password: string }
  ): Promise<RegistrationData> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      const response = await mockedLoginUserApi(credentials);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const accessToken = response.accessToken.startsWith('Bearer ')
        ? response.accessToken.slice(7)
        : response.accessToken;
      
      setCookie('accessToken', accessToken);
      commit('SET_USER', response.user);
      commit('SET_AUTH', true);
      commit('SET_LOADING', false);
      
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при входе';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Проверка авторизации
  async checkUserAuth({ commit }: ActionContext): Promise<RegistrationData> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      const accessToken = getCookie('accessToken');
      const user = await mockedGetUserApi(accessToken || '');
      
      commit('SET_USER', user);
      commit('SET_AUTH', true);
      commit('SET_AUTH_CHECKED', true);
      commit('SET_LOADING', false);
      
      return user;
    } catch (error) {
      commit('SET_AUTH_CHECKED', true);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Обновление данных пользователя
  async updateUser(
    { commit }: ActionContext,
    userData: RegistrationData
  ): Promise<RegistrationData> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      const response = await mockUpdateUserApi(userData);
      
      commit('SET_USER', response.user);
      commit('SET_LOADING', false);
      
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при обновлении данных';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Выход пользователя
  async logoutUser({ commit }: ActionContext): Promise<void> {
    commit('SET_LOADING', true);
    commit('RESET_ERROR', null);
    
    try {
      await mockedLogoutApi();
      
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
      
      commit('SET_USER', null);
      commit('SET_AUTH', false);
      commit('SET_LOADING', false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при выходе';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Сброс ошибки
  resetError({ commit }: ActionContext): void {
    commit('RESET_ERROR', null);
  }
};

const getters = {
  // Аналог селекторов
  selectUser: (state: UserState) => state.user,
  selectIsAuthChecked: (state: UserState) => state.isAuthChecked,
  selectIsAuth: (state: UserState) => state.isAuth,
  selectUserLoading: (state: UserState) => state.loading,
  selectUserError: (state: UserState) => state.error,
  
  // Дополнительные геттеры
  userName: (state: UserState) => state.user?.name || '',
  userEmail: (state: UserState) => state.user?.email || '',
  isAuthenticated: (state: UserState) => state.isAuth
};

// Тип для экспорта модуля
const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

export default userModule;