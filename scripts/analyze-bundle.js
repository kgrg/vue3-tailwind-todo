#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes bundle size and provides optimization recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
  maxChunkSize: 500 * 1024, // 500KB
  maxTotalSize: 2 * 1024 * 1024, // 2MB
  criticalChunks: ['vue-vendor', 'ui-vendor'],
  outputDir: 'dist',
  analysisFile: 'bundle-analysis.json',
}

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
}

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeBundle() {
  log('🔍 Analyzing bundle...', 'cyan')

  try {
    // Build the project
    log('📦 Building project...', 'blue')
    execSync('npm run build', { stdio: 'inherit' })

    // Analyze bundle
    const analysis = {
      timestamp: new Date().toISOString(),
      chunks: [],
      totalSize: 0,
      recommendations: [],
      warnings: [],
      errors: [],
    }

    // Get all files in dist directory
    const distPath = path.join(process.cwd(), CONFIG.outputDir)
    if (!fs.existsSync(distPath)) {
      analysis.errors.push('Build output directory not found')
      return analysis
    }

    const files = getAllFiles(distPath)

    // Analyze each file
    files.forEach(file => {
      const stats = fs.statSync(file)
      const relativePath = path.relative(distPath, file)
      const size = stats.size

      analysis.chunks.push({
        name: relativePath,
        size,
        sizeFormatted: formatBytes(size),
        type: getFileType(relativePath),
      })

      analysis.totalSize += size

      // Check for oversized chunks
      if (size > CONFIG.maxChunkSize) {
        analysis.warnings.push({
          type: 'oversized_chunk',
          message: `Chunk ${relativePath} is ${formatBytes(size)} (limit: ${formatBytes(CONFIG.maxChunkSize)})`,
          chunk: relativePath,
          size,
          limit: CONFIG.maxChunkSize,
        })
      }
    })

    // Sort chunks by size
    analysis.chunks.sort((a, b) => b.size - a.size)

    // Check total size
    if (analysis.totalSize > CONFIG.maxTotalSize) {
      analysis.warnings.push({
        type: 'oversized_total',
        message: `Total bundle size is ${formatBytes(analysis.totalSize)} (limit: ${formatBytes(CONFIG.maxTotalSize)})`,
        size: analysis.totalSize,
        limit: CONFIG.maxTotalSize,
      })
    }

    // Generate recommendations
    generateRecommendations(analysis)

    return analysis
  } catch (error) {
    log(`❌ Error analyzing bundle: ${error.message}`, 'red')
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
      chunks: [],
      totalSize: 0,
      recommendations: [],
      warnings: [],
      errors: [error.message],
    }
  }
}

function getAllFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir)

  fileList.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllFiles(filePath, files)
    } else {
      files.push(filePath)
    }
  })

  return files
}

function getFileType(filename) {
  const ext = path.extname(filename)

  if (ext === '.js') return 'javascript'
  if (ext === '.css') return 'stylesheet'
  if (ext === '.html') return 'html'
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.svg')
    return 'image'
  if (ext === '.woff' || ext === '.woff2' || ext === '.ttf' || ext === '.eot') return 'font'

  return 'other'
}

function generateRecommendations(analysis) {
  const { chunks, totalSize, warnings } = analysis

  // Large chunk recommendations
  const largeChunks = chunks.filter(chunk => chunk.size > CONFIG.maxChunkSize)
  if (largeChunks.length > 0) {
    analysis.recommendations.push({
      type: 'split_large_chunks',
      priority: 'high',
      message: 'Consider splitting large chunks for better loading performance',
      chunks: largeChunks.map(chunk => chunk.name),
    })
  }

  // Total size recommendations
  if (totalSize > CONFIG.maxTotalSize) {
    analysis.recommendations.push({
      type: 'reduce_total_size',
      priority: 'high',
      message: 'Consider reducing total bundle size for better performance',
      currentSize: formatBytes(totalSize),
      targetSize: formatBytes(CONFIG.maxTotalSize),
    })
  }

  // Unused code recommendations
  const jsChunks = chunks.filter(chunk => chunk.type === 'javascript')
  if (jsChunks.length > 10) {
    analysis.recommendations.push({
      type: 'consolidate_chunks',
      priority: 'medium',
      message: 'Consider consolidating small JavaScript chunks',
      chunkCount: jsChunks.length,
    })
  }

  // Image optimization recommendations
  const imageChunks = chunks.filter(chunk => chunk.type === 'image')
  if (imageChunks.length > 0) {
    analysis.recommendations.push({
      type: 'optimize_images',
      priority: 'medium',
      message: 'Consider optimizing images for web',
      imageCount: imageChunks.length,
    })
  }

  // Font optimization recommendations
  const fontChunks = chunks.filter(chunk => chunk.type === 'font')
  if (fontChunks.length > 0) {
    analysis.recommendations.push({
      type: 'optimize_fonts',
      priority: 'low',
      message: 'Consider using font-display: swap for better loading',
      fontCount: fontChunks.length,
    })
  }
}

function printReport(analysis) {
  log('\n📊 Bundle Analysis Report', 'cyan')
  log('=' * 50, 'cyan')

  // Summary
  log(`\n📈 Summary:`, 'blue')
  log(`  Total Size: ${formatBytes(analysis.totalSize)}`)
  log(`  Chunk Count: ${analysis.chunks.length}`)
  log(`  Warnings: ${analysis.warnings.length}`)
  log(`  Recommendations: ${analysis.recommendations.length}`)

  // Top chunks
  log(`\n📦 Largest Chunks:`, 'blue')
  analysis.chunks.slice(0, 10).forEach((chunk, index) => {
    const color = chunk.size > CONFIG.maxChunkSize ? 'red' : 'green'
    log(`  ${index + 1}. ${chunk.name} - ${chunk.sizeFormatted}`, color)
  })

  // Warnings
  if (analysis.warnings.length > 0) {
    log(`\n⚠️  Warnings:`, 'yellow')
    analysis.warnings.forEach(warning => {
      log(`  • ${warning.message}`, 'yellow')
    })
  }

  // Recommendations
  if (analysis.recommendations.length > 0) {
    log(`\n💡 Recommendations:`, 'magenta')
    analysis.recommendations.forEach(rec => {
      const priorityColor =
        rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'green'
      log(`  • [${rec.priority.toUpperCase()}] ${rec.message}`, priorityColor)
    })
  }

  // Errors
  if (analysis.errors.length > 0) {
    log(`\n❌ Errors:`, 'red')
    analysis.errors.forEach(error => {
      log(`  • ${error}`, 'red')
    })
  }

  log(`\n✅ Analysis complete!`, 'green')
}

function saveReport(analysis) {
  const reportPath = path.join(process.cwd(), CONFIG.analysisFile)
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2))
  log(`\n💾 Report saved to ${CONFIG.analysisFile}`, 'green')
}

// Main execution
function main() {
  log('🚀 Starting bundle analysis...', 'cyan')

  const analysis = analyzeBundle()
  printReport(analysis)
  saveReport(analysis)

  // Exit with error code if there are critical issues
  if (analysis.errors.length > 0) {
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { analyzeBundle, formatBytes }
