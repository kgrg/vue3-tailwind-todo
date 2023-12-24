import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoDropdown from '../TodoDropdown.vue'

const props = {
  modelValue: 'Test',
  options: [
    { value: 'Test', text: 'Test' },
    { value: 'New Value', text: 'New Value' }
  ]
}

const mountAs = () => {
  return mount(TodoDropdown, { props })
}

describe('TodoDropdown', () => {
  it('renders correctly', () => {
    const wrapper = mountAs()

    expect(wrapper.find('select').element.value).toBe('Test')
    expect(wrapper.findAll('option').length).toBe(2)
    expect(wrapper.findAll('option')[0].text()).toBe('Test')
    expect(wrapper.findAll('option')[0].text()).toBe('Test')
  })
  it('emits update:modelValue event on input change', async () => {
    const wrapper = mountAs()

    await wrapper.find('select').setValue('New Value')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['New Value'])
  })
})
