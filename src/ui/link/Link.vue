<template>
  <!-- Внутренняя ссылка (Vue Router) -->
  <router-link
    v-if="isRouterLink"
    :to="routerProps.to"
    :class="linkClasses"
  >
    <slot>{{ childrenText }}</slot>
  </router-link>

  <!-- Внешняя ссылка -->
  <a
    v-else-if="isExternalLink"
    :href="externalProps.href"
    :class="linkClasses"
    :target="externalProps.target"
    :rel="externalProps.rel"
  >
    <slot>{{ childrenText }}</slot>
  </a>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import type { TProps, TRouterLinkProps, TExternalLinkProps } from './types'

import $style from './Link.module.css'


const props = defineProps<TProps>()

// Для использования Vue Router
const router = useRouter()

// Вычисляем, какой тип ссылки
const isRouterLink = computed(() => 
  'to' in props && !props.external
)

const isExternalLink = computed(() => 
  'href' in props && props.external === true
)

// Приводим props к конкретным типам
const routerProps = computed(() => props as TRouterLinkProps)
const externalProps = computed(() => props as TExternalLinkProps)

// Текст из children (для обратной совместимости с React)
const childrenText = computed(() => {
  if (typeof props.children === 'string') {
    return props.children
  }
  return ''
})

// Динамические классы через $style (CSS-модули)
const linkClasses = computed(() => {
  const classes = [
    $style.link,
    $style.props.variant || 'primary'
  ]
  
  if (props.disabled) {
    classes.push($style.disabled)
  }
  
  if (props.className) {
    classes.push(props.className)
  }
  
  return classes
})
</script>

<style module scoped>
    .link {
    font-weight: var(--font-weight-body);
    font-size: var(--font-size-body);
    font-family: var(--font-family);
    line-height: var(--line-height-body);
    cursor: pointer;
    transition: color 0.2s ease;
    }

    .link.disabled {
    color: var(--disabled-text-color);
    cursor: not-allowed;
    pointer-events: none;
    }

    .primary {
    color: var(--button-pressed-color);
    }

    .primary:hover {
    color: var(--button-hover-color);
    }

    .secondary {
    color: var(--text-color);
    }

    .secondary:hover {
    color: var(--button-hover-color);
    }

    .inline {
    color: var(--text-color);
    }

</style>