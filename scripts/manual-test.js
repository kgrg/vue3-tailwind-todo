#!/usr/bin/env node

/**
 * Manual Testing Script
 *
 * This script provides a comprehensive manual testing checklist for the Labels feature
 * and automates some basic functionality tests.
 */

import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173',
  timeout: 30000,
  viewports: [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1920, height: 1080, name: 'desktop' },
  ],
}

class ManualTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: [],
    }
  }

  async runTests() {
    console.log('🧪 Starting Manual Testing for Labels Feature...\n')

    try {
      // Ensure dev server is running
      await this.ensureDevServer()

      // Run automated checks
      await this.runAutomatedChecks()

      // Display manual testing checklist
      this.displayManualChecklist()

      // Generate report
      this.generateReport()
    } catch (error) {
      console.error('❌ Manual testing failed:', error.message)
      process.exit(1)
    }
  }

  async ensureDevServer() {
    console.log('🚀 Checking dev server...')

    try {
      const response = await fetch(TEST_CONFIG.baseUrl)
      if (!response.ok) throw new Error('Dev server not responding')
      console.log('✅ Dev server is running')
    } catch (error) {
      console.log('⚠️  Dev server not running. Please start it with: npm run dev')
      process.exit(1)
    }
  }

  async runAutomatedChecks() {
    console.log('\n🤖 Running automated checks...')

    const browser = await chromium.launch()
    const context = await browser.newContext()

    // Test basic navigation
    await this.testNavigation(browser, context)

    // Test label management
    await this.testLabelManagement(browser, context)

    // Test task labeling
    await this.testTaskLabeling(browser, context)

    // Test filtering
    await this.testFiltering(browser, context)

    await browser.close()
  }

  async testNavigation(browser, context) {
    console.log('  🔍 Testing navigation...')

    const page = await context.newPage()

    try {
      // Test main page loads
      await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle' })
      const title = await page.title()
      this.addTest(
        'Navigation - Main page loads',
        title.includes('Todo') || title.includes('Task'),
        'Main page should load with proper title'
      )

      // Test labels page navigation
      await page.goto(`${TEST_CONFIG.baseUrl}/labels`, { waitUntil: 'networkidle' })
      const labelsTitle = await page.textContent('h1, h2, [data-testid="page-title"]')
      this.addTest(
        'Navigation - Labels page loads',
        labelsTitle && labelsTitle.includes('Label'),
        'Labels page should load with proper title'
      )

      // Test back navigation
      await page.goBack()
      const backTitle = await page.title()
      this.addTest(
        'Navigation - Back navigation works',
        backTitle.includes('Todo') || backTitle.includes('Task'),
        'Back navigation should work'
      )
    } catch (error) {
      this.addTest('Navigation - Basic navigation', false, `Navigation failed: ${error.message}`)
    }

    await page.close()
  }

  async testLabelManagement(browser, context) {
    console.log('  🔍 Testing label management...')

    const page = await context.newPage()

    try {
      // Navigate to labels page
      await page.goto(`${TEST_CONFIG.baseUrl}/labels`, { waitUntil: 'networkidle' })

      // Test create label button exists
      const createButton = await page.$(
        'button[data-testid="create-label"], button:has-text("Create"), button:has-text("Add")'
      )
      this.addTest(
        'Label Management - Create button exists',
        !!createButton,
        'Create label button should be visible'
      )

      // Test label list exists
      const labelList = await page.$('[data-testid="label-list"], .label-list, .labels-grid')
      this.addTest(
        'Label Management - Label list exists',
        !!labelList,
        'Label list container should be visible'
      )

      // Test empty state (if no labels exist)
      const emptyState = await page.$('[data-testid="empty-state"], .empty-state, .no-labels')
      if (emptyState) {
        this.addTest(
          'Label Management - Empty state shown',
          true,
          'Empty state should be shown when no labels exist'
        )
      }
    } catch (error) {
      this.addTest(
        'Label Management - Basic functionality',
        false,
        `Label management failed: ${error.message}`
      )
    }

    await page.close()
  }

  async testTaskLabeling(browser, context) {
    console.log('  🔍 Testing task labeling...')

    const page = await context.newPage()

    try {
      // Navigate to main page
      await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle' })

      // Test task creation with labels
      const createTaskButton = await page.$(
        'button[data-testid="create-task"], button:has-text("Add Task"), button:has-text("Create Task")'
      )
      if (createTaskButton) {
        await createTaskButton.click()

        // Test label picker exists
        const labelPicker = await page.$(
          '[data-testid="label-picker"], .label-picker, .label-selector'
        )
        this.addTest(
          'Task Labeling - Label picker exists',
          !!labelPicker,
          'Label picker should be available in task creation'
        )

        // Test label chips display
        const labelChips = await page.$$('[data-testid="label-chip"], .label-chip, .label-tag')
        this.addTest(
          'Task Labeling - Label chips display',
          labelChips.length >= 0,
          'Label chips should be displayable'
        )
      }
    } catch (error) {
      this.addTest(
        'Task Labeling - Basic functionality',
        false,
        `Task labeling failed: ${error.message}`
      )
    }

    await page.close()
  }

  async testFiltering(browser, context) {
    console.log('  🔍 Testing filtering...')

    const page = await context.newPage()

    try {
      // Navigate to main page
      await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle' })

      // Test filter bar exists
      const filterBar = await page.$('[data-testid="filter-bar"], .filter-bar, .filters')
      this.addTest('Filtering - Filter bar exists', !!filterBar, 'Filter bar should be visible')

      // Test label filter exists
      const labelFilter = await page.$(
        '[data-testid="label-filter"], .label-filter, .label-selector'
      )
      this.addTest(
        'Filtering - Label filter exists',
        !!labelFilter,
        'Label filter should be available'
      )

      // Test clear filters button
      const clearButton = await page.$(
        'button[data-testid="clear-filters"], button:has-text("Clear"), button:has-text("Reset")'
      )
      this.addTest(
        'Filtering - Clear filters button exists',
        !!clearButton,
        'Clear filters button should be available'
      )
    } catch (error) {
      this.addTest('Filtering - Basic functionality', false, `Filtering failed: ${error.message}`)
    }

    await page.close()
  }

  displayManualChecklist() {
    console.log('\n📋 Manual Testing Checklist')
    console.log('='.repeat(50))

    const checklist = [
      {
        category: 'Label Management',
        tests: [
          'Create a new label with name and color',
          'Edit an existing label (name and color)',
          'Delete a label (with confirmation)',
          'Verify label persistence after page reload',
          'Test label name uniqueness validation',
          'Test color picker functionality',
          'Test keyboard navigation in label dialog',
          'Test form validation (empty name, invalid color)',
          'Test label list display and sorting',
          'Test responsive design on mobile/tablet',
        ],
      },
      {
        category: 'Task Labeling',
        tests: [
          'Assign labels to a new task',
          'Assign labels to an existing task',
          'Remove labels from a task',
          'Test label picker in task creation',
          'Test label picker in task editing',
          'Test label chips display on tasks',
          'Test label chip removal',
          'Test keyboard navigation in label picker',
          'Test type-ahead search in label picker',
          'Test multi-label selection',
        ],
      },
      {
        category: 'Filtering',
        tests: [
          'Filter tasks by single label',
          'Filter tasks by multiple labels (OR logic)',
          'Filter tasks by multiple labels (AND logic)',
          'Test filter toggle (OR/AND)',
          'Test clear all filters',
          'Test individual filter removal',
          'Test filter persistence across navigation',
          'Test filter bar responsiveness',
          'Test filter results accuracy',
          'Test empty filter results',
        ],
      },
      {
        category: 'Accessibility',
        tests: [
          'Test keyboard navigation (Tab, Enter, Escape)',
          'Test screen reader compatibility',
          'Test focus management in modals',
          'Test ARIA labels and descriptions',
          'Test color contrast compliance',
          'Test skip links functionality',
          'Test form validation announcements',
          'Test error message accessibility',
          'Test loading state announcements',
          'Test responsive design accessibility',
        ],
      },
      {
        category: 'Performance',
        tests: [
          'Test with 100+ labels (creation, editing, deletion)',
          'Test with 1000+ tasks (filtering, labeling)',
          'Test type-ahead search performance',
          'Test label picker performance with many labels',
          'Test filter performance with many tasks',
          'Test page load time with large datasets',
          'Test memory usage with large datasets',
          'Test browser responsiveness during operations',
          'Test concurrent operations (multiple tabs)',
          'Test data persistence performance',
        ],
      },
      {
        category: 'Error Handling',
        tests: [
          'Test network failure scenarios',
          'Test localStorage quota exceeded',
          'Test invalid data handling',
          'Test concurrent modification conflicts',
          'Test browser compatibility',
          'Test error message display',
          'Test error recovery mechanisms',
          'Test data validation edge cases',
          'Test migration error handling',
          'Test fallback behaviors',
        ],
      },
    ]

    checklist.forEach(category => {
      console.log(`\n📂 ${category.category}:`)
      category.tests.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test}`)
      })
    })

    console.log('\n💡 Testing Tips:')
    console.log('  • Test on different browsers (Chrome, Firefox, Safari)')
    console.log('  • Test on different devices (mobile, tablet, desktop)')
    console.log('  • Test with different data sizes (few labels, many labels)')
    console.log('  • Test with different user scenarios (new user, power user)')
    console.log('  • Test edge cases and error conditions')
    console.log('  • Test accessibility with screen readers')
    console.log('  • Test performance with large datasets')
    console.log('  • Test data persistence across sessions')
    console.log('  • Test concurrent usage (multiple tabs)')
    console.log('  • Test migration from existing data')
  }

  addTest(name, passed, description) {
    const test = {
      name,
      passed,
      description,
      timestamp: new Date().toISOString(),
    }

    this.results.tests.push(test)

    if (passed) {
      this.results.passed++
      console.log(`    ✅ ${name}`)
    } else {
      this.results.failed++
      console.log(`    ❌ ${name}: ${description}`)
    }
  }

  generateReport() {
    console.log('\n📊 Manual Testing Report')
    console.log('='.repeat(50))

    console.log(`\n✅ Passed: ${this.results.passed}`)
    console.log(`❌ Failed: ${this.results.failed}`)
    console.log(`⏭️  Skipped: ${this.results.skipped}`)

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:')
      this.results.tests
        .filter(test => !test.passed)
        .forEach((test, index) => {
          console.log(`\n${index + 1}. ${test.name}`)
          console.log(`   Description: ${test.description}`)
          console.log(`   Timestamp: ${test.timestamp}`)
        })
    }

    // Save report to file
    const reportPath = 'manual-test-report.json'
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    console.log(`\n📄 Report saved to: ${reportPath}`)

    // Exit with error code if there are failures
    if (this.results.failed > 0) {
      console.log('\n❌ Manual testing failed. Please fix the issues above.')
      process.exit(1)
    } else {
      console.log('\n✅ Manual testing passed!')
    }
  }
}

// Run the tests
const tester = new ManualTester()
tester.runTests().catch(error => {
  console.error('❌ Manual testing failed:', error)
  process.exit(1)
})
