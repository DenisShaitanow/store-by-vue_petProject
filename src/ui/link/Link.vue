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
import { computed, defineProps, useCssModule } from 'vue'
import { useRouter } from 'vue-router'


interface BaseProps {
  
  className?: string;
  disabled?: boolean;
}

interface InternalLinkProps extends BaseProps {
  to: string;
  external?: false;
}

interface ExternalLinkProps extends BaseProps {
  href: string;
  external: true;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

type TProps = InternalLinkProps | ExternalLinkProps;


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

const $style = useCssModule()

// Динамические классы через $style (CSS-модули)
const linkClasses = computed(() => {
  const classes = [
    $style.link,
    
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
    color: var(--text-color);
    }

    .link.disabled {
    color: var(--text-color);
    cursor: not-allowed;
    pointer-events: none;
    }

    .primary {
    color: var(--text-color);
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