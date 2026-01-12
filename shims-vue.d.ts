declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  // Объявление для CSS-модулей в .vue-файлах
  declare module '*.vue?module' {
    const classes: { [key: string]: string };
    export default classes;
  }