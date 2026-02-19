<template>
  <div :class="$style.container" @click="handleClick">
    <!-- Скрытое поле для загрузки аватара -->
    <input
      ref="inputHiddenRef"
      id="inputHidden"
      data-cy="inputHidden"
      type="file"
      :class="$style.inputAvatar"
      accept="image/*"
      @change="handleChange"
    />

    <!-- Отображение аватара -->
    <img v-if="srcAvatar" :src="srcAvatar" :class="$style.avatar" alt="Avatar" />
    <span v-else :class="$style.svgContainer" />

    <span :class="$style.greenAdd" />
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps } from 'vue';

  // Определяем пропсы
  interface Props {
    onImageChange: (event: Event) => void;
  }

  const props = defineProps<Props>();

  // Рефы
  const inputHiddenRef = ref<HTMLInputElement>();

  // Состояния
  const avatarForForm = ref<File | null>(null);
  const srcAvatar = ref<string | null>(null);

  // Обработчики событий
  const handleClick = () => {
    if (inputHiddenRef.value) {
      inputHiddenRef.value.click();
    }
  };

  const handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    const newAvatar = files[0];

    if (newAvatar) {
      // Освобождаем предыдущий URL, если он есть
      if (srcAvatar.value) {
        URL.revokeObjectURL(srcAvatar.value);
      }

      const src = URL.createObjectURL(newAvatar);
      srcAvatar.value = src;
      avatarForForm.value = newAvatar;

      // Вызываем callback из пропсов
      props.onImageChange(event);
    }
  };
</script>

<style module scoped>
  .inputAvatar {
    position: relative;
    display: none;
    width: 72px;
    height: 72px;
  }

  .svgContainer {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 54px;
    background-image: url('../../assets/user-circle54x54.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: fit-content;
  }

  .container:hover {
    cursor: pointer;
  }

  .svg {
    display: block;
  }

  .greenAdd {
    position: absolute;
    top: 70%;
    left: 70%;
    width: 16px;
    height: 16px;
    background-color: var(--button-pressed-color);
    border-radius: 50%;
  }

  .greenAdd::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../assets/addPlusWhiteGorisont.svg');
    background-repeat: no-repeat;
    background-position: center;
    transform: translate(-50%, -50%);
  }

  .greenAdd::before {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('../../assets/addPlusWhiteVertical.svg');
    background-repeat: no-repeat;
    background-position: center;
    transform: translate(-50%, -50%);
  }

  .plus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    object-fit: cover;
  }
</style>
