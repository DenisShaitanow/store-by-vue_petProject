export type PlacementType = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    
 export   interface DropdownContent {
      content: any;
}

export interface BaseDropDownProps {
  trigger: any;                   // Требуется триггер любого типа
  children: DropdownContent[];    // Обязательное массив детей
  isOpen?: boolean;               // Может отсутствовать
  onToggle?: (isOpen: boolean) => void; // Колбэк
  placement?: PlacementType;      // Вариант расположения
  offset?: number;                // Число смещения
  closeOnClickOutside?: boolean;  // Логическое значение закрытия вне
  closeOnEscape?: boolean;        // Логическое значение закрытия ESC
  disabled?: boolean;             // Логический признак блокировки
  className?: string;             // Строка класса контейнера
  dropdownClassName?: string;     // Строка класса выпадающего блока
  ariaLabel?: string;             // Строковая метка доступности
};