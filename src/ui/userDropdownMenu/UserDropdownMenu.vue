<script setup lang="ts">
  import { ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import BaseDropdown from '../baseDropdown/BaseDropdown.vue';
  import type { PlacementType } from '../baseDropdown/type';
  import type { UserDropdownMenuProps } from './type';

  const props = withDefaults(defineProps<UserDropdownMenuProps>(), {
    placement: 'bottom-right' as PlacementType,
    disabled: false,
    className: '',
    'aria-label': '',
  });

  const emit = defineEmits<{
    personalCabinetClick: [];
    logoutClick: [];
  }>();

  const isOpen = ref(false);
  const avatarError = ref(false);

  watch(
    () => props.user?.avatarUrl,
    () => {
      avatarError.value = false;
    }
  );

  const handlePersonalCabinetClick = () => {
    emit('personalCabinetClick');
    isOpen.value = false;
  };

  const handleLogoutClick = () => {
    emit('logoutClick');
    isOpen.value = false;
  };

  const handleAvatarError = () => {
    avatarError.value = true;
  };
</script>

<template>
  <BaseDropdown
    v-model:isOpen="isOpen"
    :placement="placement"
    :disabled="disabled"
    :class-name="className"
    :close-on-click-outside="true"
    :close-on-escape="true"
    :aria-label="ariaLabel || `Меню пользователя ${user.nameUser}`"
  >
    <template #trigger>
      <div :class="$style.trigger">
        <span :class="$style.userName">{{ user.nameUser }}</span>
        <template v-if="user.avatarUrl && !avatarError">
          <img
            :src="user.avatarUrl"
            :alt="`${user.nameUser} avatar`"
            :class="$style.avatar"
            @error="handleAvatarError"
          />
        </template>
        <template v-else>
          <div :class="$style.avatarPlaceholder">
            {{ user.nameUser.charAt(0).toUpperCase() }}
          </div>
        </template>
      </div>
    </template>

    <div :class="$style.menu">
      <button :class="$style.menuItem" @click="handlePersonalCabinetClick" type="button">
        Личный кабинет
      </button>

      <button
        :class="[$style.menuItem, $style.logoutItem]"
        @click="handleLogoutClick"
        type="button"
      >
        <span>Выйти из аккаунта</span>
        <svg
          :class="$style.logoutIcon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M8.868 22h.126c4.324 0 6.407-1.704 6.768-5.52a.732.732 0 0 0-.662-.8.745.745 0 0 0-.799.663c-.282 3.057-1.723 4.196-5.316 4.196h-.127c-3.963 0-5.365-1.402-5.365-5.365V8.826c0-3.963 1.402-5.365 5.365-5.365h.127c3.612 0 5.053 1.158 5.316 4.274.049.4.39.701.799.662a.731.731 0 0 0 .671-.788C15.441 3.733 13.347 2 8.994 2h-.126C4.087 2 2.042 4.045 2.042 8.826v6.348C2.042 19.955 4.087 22 8.868 22Z"
          />
          <path
            fill="currentColor"
            d="M9.101 12.73h11.08c.4 0 .731-.331.731-.73 0-.4-.331-.73-.73-.73H9.1c-.4 0-.73.33-.73.73 0 .399.33.73.73.73Z"
          />
          <path
            fill="currentColor"
            d="M18.01 15.992c.185 0 .37-.068.516-.215l3.262-3.261a.735.735 0 0 0 0-1.033l-3.262-3.261a.735.735 0 0 0-1.032 0 .735.735 0 0 0 0 1.032l2.746 2.745-2.746 2.746a.735.735 0 0 0 0 1.033.706.706 0 0 0 .516.214Z"
          />
        </svg>
      </button>
    </div>
  </BaseDropdown>
</template>

<style module scoped>
  .trigger {
    --dropdown-transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    --dropdown-radius: 12px;
    inline-size: fit-content;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .trigger:hover {
    background-color: var(--button-hover-color);
  }

  .trigger:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }

  /* Аватар */

  .avatar {
    width: 32px;
    height: 32px;
    border: 1px solid var(--dropdown-border);
    border-radius: 50%;
    object-fit: cover;
  }

  /* Заглушка аватара */

  .avatarPlaceholder {
    display: block;
    width: 32px;
    height: 32px;
    color: var(--text-color);
    font-weight: 600;
    font-size: 13px;
    font-family: var(--font-family);
    line-height: 2.5;
    text-align: center;
    background-color: var(--accent-color);
    border-radius: 50%;
  }

  /* Имя пользователя */

  .userName {
    color: var(--text-color);
    font-weight: var(--font-weight-h4);
    font-size: var(--font-size-h4);
    font-family: var(--font-family);
    line-height: var(--line-height-h4);
    letter-spacing: 0.02em;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 260px;
    padding: 20px;
  }

  /* Элементы меню */

  .menuItem {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 5px 8px 8px;
    color: var(--text-color);
    font-weight: var(--font-weight-h4);
    font-size: var(--font-size-h4);
    font-family: var(--font-family);
    line-height: var(--line-height-h4);
    letter-spacing: 0.02em;
    text-align: left;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-radius 0.2s ease;
  }

  .menuItem:hover {
    background-color: var(--button-hover-color);
    border-radius: 12px;
  }

  .menuItem:active {
    color: var(--surface-color);
    background-color: var(--button-pressed-color);
    border-radius: 12px;
  }

  .menuItem:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: -2px;
  }

  /* Элемент "Выйти из акк" */

  .logoutItem {
    gap: 8px;
    color: var(--text-color);
  }

  .logoutItem:hover {
    background-color: var(--button-hover-color);
  }

  .logoutItem:active {
    color: var(--surface-color);
    background-color: var(--button-pressed-color);
  }

  /* Иконка logout */

  .logoutIcon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: inherit;
  }

  /* Адаптив */

  @media (width <= 768px) {
    .userName {
      display: none; /* Скрываем имя на телефоне */
    }

    .avatar {
      width: 24px;
      height: 24px;
    }

    .avatarPlaceholder {
      width: 22px;
      height: 22px;
      font-size: 9px;
    }
  }

  @media (601px <= width <= 900px) {
    .userName {
      font-size: 13px;
    }

    .menu {
      width: 130px;
      gap: 5px;
      padding: 7px;
    }

    .menuItem {
      font-size: 12px;
    }

    .logoutIcon {
      width: 16px;
      height: 16px;
    }
  }

  @media (width <= 600px) {
    .userName {
      font-size: 13px;
    }

    .menu {
      width: 110px;
      gap: 3px;
      padding: 4px;
    }

    .menuItem {
      font-size: 10px;
      padding: 5px 4px 5px 5px;
    }

    .logoutIcon {
      width: 13px;
      height: 13px;
    }
  }
</style>
