import { Module } from 'vuex';
import { IProduct, IFormOrderData } from '../../types/index';

import { RootState } from '@/store/types';
import { mockedGetProductsApi, mockedDoOrder } from '../api';

export interface IUserState {
  loadingProducts: boolean;
  products: IProduct[];
  favoriteItems: string[];
  notifications: { id: string; text: string }[];
  basket: Array<{ item: IProduct; count: number }>;
  error: string;
  orders: string[];
  errorOrder: string;
  loadingOrder: boolean;
}

const state: IUserState = {
  loadingProducts: false,
  products: [],
  favoriteItems: JSON.parse(localStorage.getItem('favoriteItems') || '[]'),
  notifications: [],
  basket: /*JSON.parse(localStorage.getItem('basket') || '[]')*/ [],
  error: '',
  orders: [],
  errorOrder: '',
  loadingOrder: false,
};

const mutations = {
  SET_LOADING_PRODUCTS(state: IUserState, loading: boolean) {
    state.loadingProducts = loading;
  },

  SET_PRODUCTS(state: IUserState, products: IProduct[]) {
    state.products = products;
    // Сохраняем в localStorage при каждом обновлении
    localStorage.setItem('products', JSON.stringify(products));
  },

  SET_FAVORITE_ITEMS(state: IUserState, favoriteItems: string[]) {
    state.favoriteItems = favoriteItems;
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  },

  SET_NOTIFICATIONS(state: IUserState, notifications: { id: string; text: string }[]) {
    state.notifications = notifications;
  },

  SET_BASKET(state: IUserState, basket: Array<{ item: IProduct; count: number }>) {
    state.basket = basket;
    localStorage.setItem('basket', JSON.stringify(basket));
  },

  SET_ERROR(state: IUserState, error: string) {
    state.error = error;
  },

  SET_ORDERS(state: IUserState, orders: string[]) {
    state.orders = orders;
  },

  SET_ERROR_ORDER(state: IUserState, errorOrder: string) {
    state.errorOrder = errorOrder;
  },

  SET_LOADING_ORDER(state: IUserState, loadingOrder: boolean) {
    state.loadingOrder = loadingOrder;
  },

  // Метод для добавления/удаления из избранного
  TOGGLE_FAVORITE(state: IUserState, productId: string) {
    const productIndex = state.products.findIndex((product) => product.id === productId);

    if (productIndex >= 0) {
      // Обновляем статус isLiked у продукта
      state.products[productIndex].isLiked = !state.products[productIndex].isLiked;

      // Обновляем массив favoriteItems
      if (state.favoriteItems.includes(productId)) {
        state.favoriteItems = state.favoriteItems.filter((id) => id !== productId);
      } else {
        state.favoriteItems.push(productId);
      }

      // Сохраняем оба массива
      localStorage.setItem('products', JSON.stringify(state.products));
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    }
  },

  // Добавление товара в корзину
  ADD_TO_BASKET(state: IUserState, product: IProduct) {
    const existingItem = state.basket.find((unit) => unit.item.id === product.id);

    existingItem ? existingItem.count++ : state.basket.push({ item: product, count: 1 });
    localStorage.setItem('basket', JSON.stringify(state.basket));
  },

  // Удаление товара из корзины
  REMOVE_FROM_BASKET(state: IUserState, productId: string) {
    console.log(state.basket);
    const existingItem = state.basket.find((unit) => unit.item.id === productId);
    if (existingItem) {
      if (existingItem.count > 1) {
        existingItem.count--;
      } else {
        console.log('aaaa');
        state.basket = state.basket.filter((item) => item.item.id !== productId);
      }
      localStorage.setItem('basket', JSON.stringify(state.basket));
    }
  },

  // Сброс избранного
  RESET_FAVORITES(state: IUserState) {
    state.favoriteItems = [];
    // Также сбрасываем isLiked у всех продуктов
    state.products = state.products.map((product) => ({
      ...product,
      isLiked: false,
    }));
    localStorage.setItem('favoriteItems', JSON.stringify([]));
    localStorage.setItem('products', JSON.stringify(state.products));
  },

  // Сброс уведомлений
  RESET_NOTIFICATIONS(state: IUserState) {
    state.notifications = [];
  },

  // Сброс корзины
  RESET_BASKET(state: IUserState) {
    state.basket = [];
    localStorage.setItem('basket', JSON.stringify([]));
  },

  // Удаление из избранного (отдельное действие)
  REMOVE_FROM_FAVORITES(state: IUserState, productId: string) {
    state.favoriteItems = state.favoriteItems.filter((item) => item !== productId);

    // Также обновляем статус продукта
    const productIndex = state.products.findIndex((p) => p.id === productId);
    if (productIndex >= 0) {
      state.products[productIndex].isLiked = false;
    }

    localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    localStorage.setItem('products', JSON.stringify(state.products));
  },
};

// Тип для контекста actions
interface UserUIDataActionContext {
  commit: <K extends keyof typeof mutations>(key: K, payload?: any) => void;
  state: IUserState;
  rootState: RootState;
  dispatch: (action: string, payload?: any) => Promise<any>;
}

const actions = {
  // Получение продуктов
  async getProducts({ commit }: UserUIDataActionContext): Promise<IProduct[]> {
    commit('SET_LOADING_PRODUCTS', true);
    commit('SET_ERROR', '');

    try {
      const products = await mockedGetProductsApi();

      // Восстанавливаем избранное из localStorage
      const favoriteItems = JSON.parse(localStorage.getItem('favoriteItems') || '[]');

      // Обновляем статус isLiked у загруженных продуктов
      const updatedProducts = products.map((product) => ({
        ...product,
        isLiked: favoriteItems.includes(product.id),
      }));

      commit('SET_PRODUCTS', updatedProducts);
      commit('SET_FAVORITE_ITEMS', favoriteItems);
      commit('SET_LOADING_PRODUCTS', false);

      return updatedProducts;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка на сервере, нет товаров.';
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING_PRODUCTS', false);
      throw error;
    }
  },

  // Создание заказа
  async doOrder(
    { commit, state }: UserUIDataActionContext,
    formData: IFormOrderData
  ): Promise<string> {
    commit('SET_LOADING_ORDER', true);
    commit('SET_ERROR_ORDER', '');

    try {
      const order = await mockedDoOrder(formData);

      commit('SET_ORDERS', [...state.orders, order]);
      commit('SET_LOADING_ORDER', false);
      commit('RESET_BASKET');

      return order;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка на сервере при создании заказа.';
      commit('SET_ERROR_ORDER', errorMessage);
      commit('SET_LOADING_ORDER', false);
      throw error;
    }
  },

  // Добавление/удаление из избранного
  toggleFavorite({ commit }: UserUIDataActionContext, productId: string): void {
    commit('TOGGLE_FAVORITE', productId);
  },

  // Добавление в корзину
  addToBasket({ commit }: UserUIDataActionContext, product: IProduct): void {
    commit('ADD_TO_BASKET', product);
  },

  // Удаление из корзины
  removeFromBasket({ commit }: UserUIDataActionContext, productId: string): void {
    commit('REMOVE_FROM_BASKET', productId);
  },

  // Удаление из избранного
  removeFromFavorites({ commit }: UserUIDataActionContext, productId: string): void {
    commit('REMOVE_FROM_FAVORITES', productId);
  },

  // Сброс избранного
  resetFavorites({ commit }: UserUIDataActionContext): void {
    commit('RESET_FAVORITES');
  },

  // Сброс уведомлений
  resetNotifications({ commit }: UserUIDataActionContext): void {
    commit('RESET_NOTIFICATIONS');
  },

  // Сброс корзины
  resetBasket({ commit }: UserUIDataActionContext): void {
    commit('RESET_BASKET');
  },
};

const getters = {
  // Селекторы (геттеры)
  selectProducts: (state: IUserState) => state.products,

  selectLoadingProducts: (state: IUserState) => state.loadingProducts,

  selectFavoriteProducts: (state: IUserState) =>
    state.products.filter((product) => product.isLiked),

  selectBasket: (state: IUserState) => state.basket,

  selectOrders: (state: IUserState) => state.orders,

  selectFavoriteItems: (state: IUserState) => state.favoriteItems,

  selectNotifications: (state: IUserState) => state.notifications,

  selectError: (state: IUserState) => state.error,

  selectErrorOrder: (state: IUserState) => state.errorOrder,

  selectLoadingOrder: (state: IUserState) => state.loadingOrder,

  // Дополнительные геттеры
  basketTotal: (state: IUserState) =>
    state.basket.reduce((total, product) => total + product.price, 0),

  basketCount: (state: IUserState) => state.basket.length,

  favoritesCount: (state: IUserState) => state.favoriteItems.length,

  isProductInBasket: (state: IUserState) => (productId: string) =>
    state.basket.some((item) => item.id === productId),

  isProductInFavorites: (state: IUserState) => (productId: string) =>
    state.favoriteItems.includes(productId),
};

const userUIDataModule: Module<IUserState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default userUIDataModule;
