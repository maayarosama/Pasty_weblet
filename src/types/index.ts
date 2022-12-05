export interface ISelectOption {
    label: string;
    value: string | number;
    selected?: boolean;
    disabled?: boolean;
  }

  export interface IFormField {
    type: "text" | "number" | "checkbox" | "select";
    label?: string;
    symbol: string;
    placeholder?: string;
    options?: ISelectOption[];
    disabled?: boolean;
    invalid?: boolean;
    loading?: boolean;
  }

  export interface ITab {
    label: string;
    value: string;
  }
  
  