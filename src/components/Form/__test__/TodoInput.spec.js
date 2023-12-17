import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from '../TodoInput.vue'

const props = {
  id: 'input-id',
  label: 'input-label',
  placeholder: 'input-placeholder',
  modelValue: 'Test Value',
  required: true
}

describe('TodoInput', () => {
  it('renders the correct label', () => {
    const wrapper = mount(TodoInput, { props })
    expect(wrapper.text()).toContain(props.label)
  })

  it('uses the correct id', () => {
    const wrapper = mount(TodoInput, { props })
    expect(wrapper.find('input').attributes('id')).toBe(props.id)
  })

  it('uses the correct placeholder', () => {
    const wrapper = mount(TodoInput, { props })
    expect(wrapper.find('input').attributes('placeholder')).toBe(
      props.placeholder
    )
  })

  it('uses the correct required attribute', () => {
    const wrapper = mount(TodoInput, { props })
    expect(wrapper.find('input').attributes('required')).toBe('')
  })

  it('binds the correct value to v-model', async () => {
    const wrapper = mount(TodoInput, { props })
    await wrapper.find('input').setValue('New Value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['New Value'])
  })
})
