/**
 * Label Filtering E2E Tests
 * End-to-end tests for label-based task filtering workflows
 */

import { test, expect } from '@playwright/test'

test.describe('Label Filtering Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page with tasks
    await page.goto('/')

    // Wait for the page to load
    await page.waitForSelector('[data-testid="tasks-page"]')
  })

  test('should filter tasks by single label', async ({ page }) => {
    // Create a label first
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    // Navigate back to tasks
    await page.goto('/')

    // Create a task with the label
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Complete project proposal')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="save-task-button"]')

    // Create another task without the label
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Buy groceries')
    await page.click('[data-testid="save-task-button"]')

    // Apply label filter
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')

    // Verify only the filtered task is visible
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="task-item"]')).toContainText(
      'Complete project proposal'
    )
  })

  test('should filter tasks by multiple labels with OR logic', async ({ page }) => {
    // Create labels
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Personal')
    await page.fill('[data-testid="color-input"]', '#3b82f6')
    await page.click('[data-testid="save-button"]')

    // Navigate back to tasks
    await page.goto('/')

    // Create tasks with different labels
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Work task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="save-task-button"]')

    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Personal task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Personal"]')
    await page.click('[data-testid="save-task-button"]')

    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Unlabeled task')
    await page.click('[data-testid="save-task-button"]')

    // Apply multiple label filters with OR logic
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="label-option"][data-label-name="Personal"]')

    // Verify both labeled tasks are visible
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(2)
    await expect(page.locator('[data-testid="task-item"]')).toContainText('Work task')
    await expect(page.locator('[data-testid="task-item"]')).toContainText('Personal task')
  })

  test('should filter tasks by multiple labels with AND logic', async ({ page }) => {
    // Create labels
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Urgent')
    await page.fill('[data-testid="color-input"]', '#ef4444')
    await page.click('[data-testid="save-button"]')

    // Navigate back to tasks
    await page.goto('/')

    // Create tasks with different label combinations
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Work and Urgent task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="label-option"][data-label-name="Urgent"]')
    await page.click('[data-testid="save-task-button"]')

    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Work only task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="save-task-button"]')

    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Urgent only task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Urgent"]')
    await page.click('[data-testid="save-task-button"]')

    // Apply multiple label filters with AND logic
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="label-option"][data-label-name="Urgent"]')

    // Switch to AND mode
    await page.click('[data-testid="and-toggle"]')

    // Verify only the task with both labels is visible
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1)
    await expect(page.locator('[data-testid="task-item"]')).toContainText('Work and Urgent task')
  })

  test('should clear label filters', async ({ page }) => {
    // Create a label and task first
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.goto('/')
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Work task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="save-task-button"]')

    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Unlabeled task')
    await page.click('[data-testid="save-task-button"]')

    // Apply label filter
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')

    // Verify filter is applied
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1)

    // Clear the filter
    await page.click('[data-testid="clear-filters-button"]')

    // Verify all tasks are visible
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(2)
  })

  test('should search labels while filtering', async ({ page }) => {
    // Create multiple labels
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work Tasks')
    await page.fill('[data-testid="color-input"]', '#3b82f6')
    await page.click('[data-testid="save-button"]')

    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Personal')
    await page.fill('[data-testid="color-input"]', '#8b5cf6')
    await page.click('[data-testid="save-button"]')

    // Navigate back to tasks
    await page.goto('/')

    // Open label filter
    await page.click('[data-testid="label-filter-button"]')

    // Search for labels containing 'work'
    await page.fill('[data-testid="label-search-input"]', 'work')

    // Verify only matching labels are shown
    await expect(page.locator('[data-testid="label-option"]')).toHaveCount(2)
    await expect(page.locator('[data-testid="label-option"][data-label-name="Work"]')).toBeVisible()
    await expect(
      page.locator('[data-testid="label-option"][data-label-name="Work Tasks"]')
    ).toBeVisible()
    await expect(
      page.locator('[data-testid="label-option"][data-label-name="Personal"]')
    ).not.toBeVisible()
  })

  test('should handle keyboard navigation in filter', async ({ page }) => {
    // Create a label first
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.goto('/')

    // Open label filter
    await page.click('[data-testid="label-filter-button"]')

    // Test keyboard navigation
    await page.keyboard.press('Tab') // Focus search input
    await page.keyboard.type('work')

    await page.keyboard.press('Tab') // Focus first label option
    await page.keyboard.press('Enter') // Select label

    // Verify label was selected
    await expect(page.locator('[data-testid="selected-label"]')).toContainText('Work')
  })

  test('should show filter count badge', async ({ page }) => {
    // Create labels and tasks
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Personal')
    await page.fill('[data-testid="color-input"]', '#3b82f6')
    await page.click('[data-testid="save-button"]')

    await page.goto('/')

    // Apply multiple filters
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="label-option"][data-label-name="Personal"]')

    // Verify filter count badge
    await expect(page.locator('[data-testid="filter-count-badge"]')).toContainText('2')
  })

  test('should persist filters across page navigation', async ({ page }) => {
    // Create a label and task
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.goto('/')
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Work task')
    await page.click('[data-testid="label-picker"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')
    await page.click('[data-testid="save-task-button"]')

    // Apply filter
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')

    // Navigate to another page
    await page.goto('/activities')

    // Navigate back
    await page.goto('/')

    // Verify filter is still applied
    await expect(page.locator('[data-testid="filter-count-badge"]')).toContainText('1')
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(1)
  })

  test('should handle filter errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/labels', route => route.abort())

    // Try to open label filter
    await page.click('[data-testid="label-filter-button"]')

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Unable to load labels'
    )
  })

  test('should show empty state when no tasks match filter', async ({ page }) => {
    // Create a label but no tasks with that label
    await page.goto('/labels')
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    await page.goto('/')

    // Create a task without the label
    await page.click('[data-testid="create-task-button"]')
    await page.fill('[data-testid="task-title-input"]', 'Unlabeled task')
    await page.click('[data-testid="save-task-button"]')

    // Apply filter
    await page.click('[data-testid="label-filter-button"]')
    await page.click('[data-testid="label-option"][data-label-name="Work"]')

    // Verify empty state
    await expect(page.locator('[data-testid="empty-state"]')).toContainText(
      'No tasks match the selected filters'
    )
  })
})
