/**
 * Label CRUD E2E Tests
 * End-to-end tests for label creation, editing, and deletion workflows
 */

import { test, expect } from '@playwright/test'

test.describe('Label CRUD Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the labels management page
    await page.goto('/labels')

    // Wait for the page to load
    await page.waitForSelector('[data-testid="labels-page"]')
  })

  test('should create a new label', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Fill in the label form
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')

    // Submit the form
    await page.click('[data-testid="save-button"]')

    // Wait for the dialog to close
    await page.waitForSelector('[data-testid="label-dialog"]', { state: 'hidden' })

    // Verify the label was created
    await expect(page.locator('[data-testid="label-item"]')).toContainText('Work')
    await expect(page.locator('[data-testid="label-item"]')).toHaveAttribute(
      'data-color',
      '#22c55e'
    )
  })

  test('should edit an existing label', async ({ page }) => {
    // Create a label first
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    // Wait for the label to be created
    await page.waitForSelector('[data-testid="label-item"]')

    // Click the edit button
    await page.click('[data-testid="edit-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Update the label
    await page.fill('[data-testid="name-input"]', 'Work Tasks')
    await page.fill('[data-testid="color-input"]', '#3b82f6')

    // Submit the form
    await page.click('[data-testid="save-button"]')

    // Wait for the dialog to close
    await page.waitForSelector('[data-testid="label-dialog"]', { state: 'hidden' })

    // Verify the label was updated
    await expect(page.locator('[data-testid="label-item"]')).toContainText('Work Tasks')
    await expect(page.locator('[data-testid="label-item"]')).toHaveAttribute(
      'data-color',
      '#3b82f6'
    )
  })

  test('should delete a label', async ({ page }) => {
    // Create a label first
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    // Wait for the label to be created
    await page.waitForSelector('[data-testid="label-item"]')

    // Click the delete button
    await page.click('[data-testid="delete-label-button"]')

    // Wait for the confirmation dialog
    await page.waitForSelector('[data-testid="delete-confirmation"]')

    // Confirm deletion
    await page.click('[data-testid="confirm-delete-button"]')

    // Wait for the confirmation dialog to close
    await page.waitForSelector('[data-testid="delete-confirmation"]', { state: 'hidden' })

    // Verify the label was deleted
    await expect(page.locator('[data-testid="label-item"]')).not.toBeVisible()
  })

  test('should cancel label deletion', async ({ page }) => {
    // Create a label first
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    // Wait for the label to be created
    await page.waitForSelector('[data-testid="label-item"]')

    // Click the delete button
    await page.click('[data-testid="delete-label-button"]')

    // Wait for the confirmation dialog
    await page.waitForSelector('[data-testid="delete-confirmation"]')

    // Cancel deletion
    await page.click('[data-testid="cancel-delete-button"]')

    // Wait for the confirmation dialog to close
    await page.waitForSelector('[data-testid="delete-confirmation"]', { state: 'hidden' })

    // Verify the label still exists
    await expect(page.locator('[data-testid="label-item"]')).toBeVisible()
  })

  test('should validate label name uniqueness', async ({ page }) => {
    // Create a label first
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')
    await page.click('[data-testid="save-button"]')

    // Wait for the label to be created
    await page.waitForSelector('[data-testid="label-item"]')

    // Try to create another label with the same name
    await page.click('[data-testid="create-label-button"]')
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#3b82f6')
    await page.click('[data-testid="save-button"]')

    // Verify validation error
    await expect(page.locator('[data-testid="validation-error"]')).toContainText(
      'A label with this name already exists'
    )

    // Verify the save button is disabled
    await expect(page.locator('[data-testid="save-button"]')).toBeDisabled()
  })

  test('should validate label name length', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Try to create a label with a name that's too long
    await page.fill('[data-testid="name-input"]', 'A'.repeat(33))
    await page.fill('[data-testid="color-input"]', '#22c55e')

    // Verify validation error
    await expect(page.locator('[data-testid="validation-error"]')).toContainText(
      'Label name must be 32 characters or less'
    )

    // Verify the save button is disabled
    await expect(page.locator('[data-testid="save-button"]')).toBeDisabled()
  })

  test('should validate color format', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Try to create a label with an invalid color
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', 'invalid-color')

    // Verify validation error
    await expect(page.locator('[data-testid="validation-error"]')).toContainText(
      'Please enter a valid hex color'
    )

    // Verify the save button is disabled
    await expect(page.locator('[data-testid="save-button"]')).toBeDisabled()
  })

  test('should handle keyboard navigation in dialog', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Test keyboard navigation
    await page.keyboard.press('Tab') // Focus name input
    await page.keyboard.type('Work')

    await page.keyboard.press('Tab') // Focus color input
    await page.keyboard.type('#22c55e')

    await page.keyboard.press('Tab') // Focus save button
    await page.keyboard.press('Enter') // Submit form

    // Wait for the dialog to close
    await page.waitForSelector('[data-testid="label-dialog"]', { state: 'hidden' })

    // Verify the label was created
    await expect(page.locator('[data-testid="label-item"]')).toContainText('Work')
  })

  test('should close dialog with Escape key', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Press Escape key
    await page.keyboard.press('Escape')

    // Wait for the dialog to close
    await page.waitForSelector('[data-testid="label-dialog"]', { state: 'hidden' })

    // Verify no label was created
    await expect(page.locator('[data-testid="label-item"]')).not.toBeVisible()
  })

  test('should handle form submission with Enter key', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Fill in the form
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')

    // Press Enter in the name input
    await page.keyboard.press('Enter')

    // Wait for the dialog to close
    await page.waitForSelector('[data-testid="label-dialog"]', { state: 'hidden' })

    // Verify the label was created
    await expect(page.locator('[data-testid="label-item"]')).toContainText('Work')
  })

  test('should show loading state during operations', async ({ page }) => {
    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Fill in the form
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')

    // Submit the form
    await page.click('[data-testid="save-button"]')

    // Verify loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible()

    // Wait for the operation to complete
    await page.waitForSelector('[data-testid="loading-spinner"]', { state: 'hidden' })

    // Verify the label was created
    await expect(page.locator('[data-testid="label-item"]')).toContainText('Work')
  })

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/labels', route => route.abort())

    // Click the create label button
    await page.click('[data-testid="create-label-button"]')

    // Wait for the dialog to open
    await page.waitForSelector('[data-testid="label-dialog"]')

    // Fill in the form
    await page.fill('[data-testid="name-input"]', 'Work')
    await page.fill('[data-testid="color-input"]', '#22c55e')

    // Submit the form
    await page.click('[data-testid="save-button"]')

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Unable to save labels'
    )

    // Verify the dialog remains open
    await expect(page.locator('[data-testid="label-dialog"]')).toBeVisible()
  })
})
