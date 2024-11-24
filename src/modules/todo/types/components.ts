export interface TodoInputProps {
  id: string
  label: string
  modelValue: string
  placeholder?: string
  required?: boolean
}

export interface TodoDropdownProps {
  modelValue: string
  options: Array<{
    text: string
    value: string
  }>
}

export interface TodoTextBoxProps {
  modelValue: string
  placeholder?: string
}

export interface DataTableProps {
  rows: any[]
  columns: Array<{
    key: string
    label: string
  }>
}

export interface BaseModalProps {
  modalActive: boolean
}

export interface TodoHeaderProps {
  title: string
}
