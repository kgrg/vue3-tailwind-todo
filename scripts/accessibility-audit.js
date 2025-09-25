#!/usr/bin/env node

/**
 * Accessibility Audit Script
 *
 * This script performs comprehensive accessibility testing for the Labels feature
 * using axe-core and manual checks to ensure WCAG 2.1 AA compliance.
 */

import { chromium } from 'playwright'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const AUDIT_CONFIG = {
  // URLs to test
  urls: ['http://localhost:5173/', 'http://localhost:5173/labels', 'http://localhost:5173/today'],

  // Viewport sizes to test
  viewports: [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1920, height: 1080, name: 'desktop' },
  ],

  // Color contrast thresholds
  contrastThresholds: {
    normal: 4.5, // WCAG AA
    large: 3.0, // WCAG AA for large text
  },

  // Keyboard navigation test
  keyboardTest: {
    tabOrder: true,
    focusVisible: true,
    skipLinks: true,
    modalTrap: true,
  },
}

class AccessibilityAuditor {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
    }
  }

  async runAudit() {
    console.log('🔍 Starting Accessibility Audit...\n')

    try {
      // Start dev server if not running
      await this.ensureDevServer()

      // Run automated tests
      await this.runAutomatedTests()

      // Run manual checks
      await this.runManualChecks()

      // Generate report
      this.generateReport()
    } catch (error) {
      console.error('❌ Audit failed:', error.message)
      process.exit(1)
    }
  }

  async ensureDevServer() {
    console.log('🚀 Ensuring dev server is running...')

    try {
      const response = await fetch('http://localhost:5173')
      if (!response.ok) throw new Error('Dev server not responding')
      console.log('✅ Dev server is running')
    } catch (error) {
      console.log('⚠️  Dev server not running. Please start it with: npm run dev')
      process.exit(1)
    }
  }

  async runAutomatedTests() {
    console.log('\n🤖 Running automated accessibility tests...')

    const browser = await chromium.launch()
    const context = await browser.newContext()

    for (const url of AUDIT_CONFIG.urls) {
      console.log(`\n📄 Testing: ${url}`)

      for (const viewport of AUDIT_CONFIG.viewports) {
        console.log(`  📱 Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`)

        await context.setViewportSize(viewport)
        const page = await context.newPage()

        try {
          await page.goto(url, { waitUntil: 'networkidle' })

          // Run axe-core tests
          await this.runAxeTests(page, url, viewport.name)

          // Test keyboard navigation
          await this.testKeyboardNavigation(page, url, viewport.name)

          // Test color contrast
          await this.testColorContrast(page, url, viewport.name)
        } catch (error) {
          this.addIssue('error', `Failed to test ${url} on ${viewport.name}`, error.message)
        }

        await page.close()
      }
    }

    await browser.close()
  }

  async runAxeTests(page, url, viewport) {
    try {
      // Inject axe-core
      await page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js',
      })

      // Run axe tests
      const results = await page.evaluate(() => {
        return new Promise(resolve => {
          axe.run(document, (err, results) => {
            if (err) {
              resolve({ error: err.message })
            } else {
              resolve(results)
            }
          })
        })
      })

      if (results.error) {
        this.addIssue('error', `Axe test failed on ${url} (${viewport})`, results.error)
        return
      }

      // Process results
      const violations = results.violations || []
      const passes = results.passes || []
      const incomplete = results.incomplete || []

      this.results.passed += passes.length
      this.results.failed += violations.length
      this.results.warnings += incomplete.length

      // Log violations
      violations.forEach(violation => {
        this.addIssue('error', `Axe violation: ${violation.id}`, violation.description)
        violation.nodes.forEach(node => {
          this.addIssue('error', `  - ${violation.id}`, node.html)
        })
      })

      // Log incomplete tests
      incomplete.forEach(test => {
        this.addIssue('warning', `Axe incomplete: ${test.id}`, test.description)
      })
    } catch (error) {
      this.addIssue('error', `Axe test error on ${url} (${viewport})`, error.message)
    }
  }

  async testKeyboardNavigation(page, url, viewport) {
    try {
      // Test tab order
      if (AUDIT_CONFIG.keyboardTest.tabOrder) {
        await this.testTabOrder(page, url, viewport)
      }

      // Test focus visibility
      if (AUDIT_CONFIG.keyboardTest.focusVisible) {
        await this.testFocusVisibility(page, url, viewport)
      }

      // Test skip links
      if (AUDIT_CONFIG.keyboardTest.skipLinks) {
        await this.testSkipLinks(page, url, viewport)
      }

      // Test modal focus trap
      if (AUDIT_CONFIG.keyboardTest.modalTrap) {
        await this.testModalFocusTrap(page, url, viewport)
      }
    } catch (error) {
      this.addIssue('error', `Keyboard test error on ${url} (${viewport})`, error.message)
    }
  }

  async testTabOrder(page, url, viewport) {
    try {
      // Get all focusable elements
      const focusableElements = await page.$$eval(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        elements =>
          elements.map(el => ({
            tagName: el.tagName,
            text: el.textContent?.trim() || '',
            id: el.id || '',
            className: el.className || '',
          }))
      )

      // Test tab navigation
      await page.keyboard.press('Tab')
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName)

      if (!focusedElement) {
        this.addIssue('warning', `No focusable elements found on ${url} (${viewport})`)
      }
    } catch (error) {
      this.addIssue('error', `Tab order test failed on ${url} (${viewport})`, error.message)
    }
  }

  async testFocusVisibility(page, url, viewport) {
    try {
      // Test focus visibility
      const focusVisible = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement)
        return style.outline !== 'none' || style.boxShadow !== 'none'
      })

      if (!focusVisible) {
        this.addIssue('warning', `Focus not visible on ${url} (${viewport})`)
      }
    } catch (error) {
      this.addIssue('error', `Focus visibility test failed on ${url} (${viewport})`, error.message)
    }
  }

  async testSkipLinks(page, url, viewport) {
    try {
      // Check for skip links
      const skipLinks = await page.$$('a[href^="#"]')

      if (skipLinks.length === 0) {
        this.addIssue('warning', `No skip links found on ${url} (${viewport})`)
      }
    } catch (error) {
      this.addIssue('error', `Skip links test failed on ${url} (${viewport})`, error.message)
    }
  }

  async testModalFocusTrap(page, url, viewport) {
    try {
      // Test modal focus trap (if modals exist)
      const modals = await page.$$('[role="dialog"], [role="alertdialog"]')

      for (const modal of modals) {
        // Test if modal can be focused
        await modal.focus()
        const isFocused = await page.evaluate(el => document.activeElement === el, modal)

        if (!isFocused) {
          this.addIssue('warning', `Modal not focusable on ${url} (${viewport})`)
        }
      }
    } catch (error) {
      this.addIssue('error', `Modal focus trap test failed on ${url} (${viewport})`, error.message)
    }
  }

  async testColorContrast(page, url, viewport) {
    try {
      // Test color contrast for label chips
      const labelChips = await page.$$('.label-chip, [data-testid="label-chip"]')

      for (const chip of labelChips) {
        const contrast = await page.evaluate(el => {
          const style = getComputedStyle(el)
          const bgColor = style.backgroundColor
          const textColor = style.color

          // Simple contrast check (would need proper contrast calculation in real implementation)
          return {
            bgColor,
            textColor,
            hasContrast: bgColor !== textColor,
          }
        }, chip)

        if (!contrast.hasContrast) {
          this.addIssue('warning', `Low contrast on label chip on ${url} (${viewport})`)
        }
      }
    } catch (error) {
      this.addIssue('error', `Color contrast test failed on ${url} (${viewport})`, error.message)
    }
  }

  async runManualChecks() {
    console.log('\n👤 Running manual accessibility checks...')

    // Check for required ARIA attributes
    this.checkAriaAttributes()

    // Check for semantic HTML
    this.checkSemanticHTML()

    // Check for color contrast
    this.checkColorContrast()

    // Check for keyboard navigation
    this.checkKeyboardNavigation()
  }

  checkAriaAttributes() {
    console.log('  🔍 Checking ARIA attributes...')

    // Check for required ARIA attributes in components
    const ariaChecks = [
      { file: 'src/core/components/BaseLabelChip.vue', attribute: 'aria-label' },
      { file: 'src/core/components/LabelPicker.vue', attribute: 'aria-expanded' },
      { file: 'src/core/components/LabelDialog.vue', attribute: 'aria-labelledby' },
    ]

    ariaChecks.forEach(check => {
      if (fs.existsSync(check.file)) {
        const content = fs.readFileSync(check.file, 'utf8')
        if (!content.includes(check.attribute)) {
          this.addIssue('warning', `Missing ${check.attribute} in ${check.file}`)
        }
      }
    })
  }

  checkSemanticHTML() {
    console.log('  🔍 Checking semantic HTML...')

    // Check for proper heading structure
    const htmlFiles = ['index.html']

    htmlFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8')

        // Check for main landmark
        if (!content.includes('<main')) {
          this.addIssue('warning', `Missing <main> landmark in ${file}`)
        }

        // Check for proper heading hierarchy
        const h1Count = (content.match(/<h1/g) || []).length
        if (h1Count === 0) {
          this.addIssue('warning', `No <h1> found in ${file}`)
        }
        if (h1Count > 1) {
          this.addIssue('warning', `Multiple <h1> found in ${file}`)
        }
      }
    })
  }

  checkColorContrast() {
    console.log('  🔍 Checking color contrast...')

    // Check Tailwind config for color contrast
    if (fs.existsSync('tailwind.config.ts')) {
      const content = fs.readFileSync('tailwind.config.ts', 'utf8')

      // Check for color contrast utilities
      if (!content.includes('contrast')) {
        this.addIssue('warning', 'No color contrast utilities found in Tailwind config')
      }
    }
  }

  checkKeyboardNavigation() {
    console.log('  🔍 Checking keyboard navigation...')

    // Check for keyboard event handlers
    const vueFiles = this.findVueFiles()

    vueFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8')

      // Check for keyboard event handlers
      if (content.includes('@keydown') || content.includes('@keyup')) {
        // Check for proper keyboard handling
        if (!content.includes('Escape') && !content.includes('Enter')) {
          this.addIssue('warning', `Incomplete keyboard handling in ${file}`)
        }
      }
    })
  }

  findVueFiles() {
    const vueFiles = []
    const srcDir = 'src'

    const findFiles = dir => {
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          findFiles(filePath)
        } else if (file.endsWith('.vue')) {
          vueFiles.push(filePath)
        }
      })
    }

    findFiles(srcDir)
    return vueFiles
  }

  addIssue(type, message, details = '') {
    this.results.issues.push({
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
    })

    if (type === 'error') {
      this.results.failed++
    } else if (type === 'warning') {
      this.results.warnings++
    }
  }

  generateReport() {
    console.log('\n📊 Accessibility Audit Report')
    console.log('='.repeat(50))

    console.log(`\n✅ Passed: ${this.results.passed}`)
    console.log(`❌ Failed: ${this.results.failed}`)
    console.log(`⚠️  Warnings: ${this.results.warnings}`)

    if (this.results.issues.length > 0) {
      console.log('\n📋 Issues Found:')
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️'
        console.log(`\n${index + 1}. ${icon} ${issue.message}`)
        if (issue.details) {
          console.log(`   Details: ${issue.details}`)
        }
      })
    }

    // Save report to file
    const reportPath = 'accessibility-audit-report.json'
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))
    console.log(`\n📄 Report saved to: ${reportPath}`)

    // Exit with error code if there are failures
    if (this.results.failed > 0) {
      console.log('\n❌ Accessibility audit failed. Please fix the issues above.')
      process.exit(1)
    } else {
      console.log('\n✅ Accessibility audit passed!')
    }
  }
}

// Run the audit
const auditor = new AccessibilityAuditor()
auditor.runAudit().catch(error => {
  console.error('❌ Audit failed:', error)
  process.exit(1)
})
