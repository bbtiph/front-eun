export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'date' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'activeStatus';
  visible?: boolean;
  cssClasses?: string[];
  isObject?: boolean;
  objectProperty?: string;
  subObjectProperty?: string;
  isSubObject?: boolean;
}
