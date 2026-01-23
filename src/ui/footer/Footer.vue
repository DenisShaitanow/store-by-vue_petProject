<template>
  <footer :class="$style.footer">
    <div :class="$style.container">
      <Logo />
      
      <nav :class="$style.nav">
        <div :class="$style.navColumn">
          <Link to="/about" variant="secondary">
            О проекте
          </Link>
         
        </div>
        
        <div :class="$style.navColumn">
          <Link to="/contacts" variant="secondary">
            Контакты
          </Link>
          <Link to="/blog" variant="secondary">
            Блог
          </Link>
        </div>
        
        <div :class="$style.navColumn">
          <Link to="/privacy" variant="secondary">
            Политика конфиденциальности
          </Link>
          <Link to="/terms" variant="secondary">
            Пользовательское соглашение
          </Link>
        </div>
      </nav>
      
      <div :class="$style.bottom">
        StoreThings © 2025
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
    // Импортируем необходимые компоненты
    import Link from '../link/Link.vue'
    import Logo from '../logo/Logo.vue'
</script>

<style module scoped>
    .footer {
    width: 100%;
    background: var(--surface-color);
    }

    .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1440px;
    margin: 0 auto;
    padding: 32px 36px;
    }

    .nav {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    }

    .navColumn {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 12px;
    }

    .bottom {
    color: var(--caption-color);
    font-weight: var(--font-weight-caption);
    font-size: var(--font-size-caption);
    line-height: var(--line-height-caption);
    }

    /* адаптив */

    @media (width >= 768px) {
    .nav {
        grid-template-columns: repeat(4, 1fr);
    }

    .nav::before {
        content: "";
        display: block;
    }
    }


</style>