/**
 * Color Contrast Utilities
 * Provides color contrast calculation and accessibility helpers
 */

export interface ContrastResult {
  textColor: 'black' | 'white'
  contrast: number
  meetsAA: boolean
  meetsAAA: boolean
}

export interface ColorRGB {
  r: number
  g: number
  b: number
}

/**
 * Converts hex color to RGB
 */
export function hexToRgb(hex: string): ColorRGB {
  const cleanHex = hex.replace('#', '')

  // Handle 3-digit hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16)
    const g = parseInt(cleanHex[1] + cleanHex[1], 16)
    const b = parseInt(cleanHex[2] + cleanHex[2], 16)
    return { r, g, b }
  }

  // Handle 6-digit hex
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substr(0, 2), 16)
    const g = parseInt(cleanHex.substr(2, 2), 16)
    const b = parseInt(cleanHex.substr(4, 2), 16)
    return { r, g, b }
  }

  throw new Error(`Invalid hex color format: ${hex}`)
}

/**
 * Calculates relative luminance of a color
 */
export function getRelativeLuminance(rgb: ColorRGB): number {
  const { r, g, b } = rgb

  // Normalize RGB values
  const normalize = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }

  const rNorm = normalize(r)
  const gNorm = normalize(g)
  const bNorm = normalize(b)

  return 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm
}

/**
 * Calculates contrast ratio between two colors
 */
export function getContrastRatio(color1: ColorRGB, color2: ColorRGB): number {
  const lum1 = getRelativeLuminance(color1)
  const lum2 = getRelativeLuminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Determines the best text color for a background
 */
export function getBestTextColor(backgroundColor: string): ContrastResult {
  const bgRgb = hexToRgb(backgroundColor)
  const blackRgb: ColorRGB = { r: 0, g: 0, b: 0 }
  const whiteRgb: ColorRGB = { r: 255, g: 255, b: 255 }

  const blackContrast = getContrastRatio(bgRgb, blackRgb)
  const whiteContrast = getContrastRatio(bgRgb, whiteRgb)

  const useWhite = whiteContrast > blackContrast
  const contrast = useWhite ? whiteContrast : blackContrast

  return {
    textColor: useWhite ? 'white' : 'black',
    contrast,
    meetsAA: contrast >= 4.5,
    meetsAAA: contrast >= 7,
  }
}

/**
 * Validates if a color combination meets WCAG standards
 */
export function validateColorAccessibility(
  backgroundColor: string,
  textColor: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const bgRgb = hexToRgb(backgroundColor)
  const textRgb = hexToRgb(textColor)

  const contrast = getContrastRatio(bgRgb, textRgb)
  const requiredContrast = level === 'AA' ? 4.5 : 7

  return contrast >= requiredContrast
}

/**
 * Generates accessible color combinations
 */
export function generateAccessibleColors(baseColor: string): {
  primary: string
  text: string
  hover: string
  focus: string
} {
  const result = getBestTextColor(baseColor)

  // Generate hover color (slightly darker/lighter)
  const baseRgb = hexToRgb(baseColor)
  const hoverRgb: ColorRGB = {
    r: Math.max(0, Math.min(255, baseRgb.r + (result.textColor === 'white' ? -20 : 20))),
    g: Math.max(0, Math.min(255, baseRgb.g + (result.textColor === 'white' ? -20 : 20))),
    b: Math.max(0, Math.min(255, baseRgb.b + (result.textColor === 'white' ? -20 : 20))),
  }

  // Generate focus color (more contrast)
  const focusRgb: ColorRGB = {
    r: Math.max(0, Math.min(255, baseRgb.r + (result.textColor === 'white' ? -40 : 40))),
    g: Math.max(0, Math.min(255, baseRgb.g + (result.textColor === 'white' ? -40 : 40))),
    b: Math.max(0, Math.min(255, baseRgb.b + (result.textColor === 'white' ? -40 : 40))),
  }

  return {
    primary: baseColor,
    text: result.textColor === 'white' ? '#ffffff' : '#000000',
    hover: rgbToHex(hoverRgb),
    focus: rgbToHex(focusRgb),
  }
}

/**
 * Converts RGB to hex
 */
export function rgbToHex(rgb: ColorRGB): string {
  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Gets color brightness (0-255)
 */
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex)
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

/**
 * Determines if a color is light or dark
 */
export function isLightColor(hex: string): boolean {
  return getColorBrightness(hex) > 128
}

/**
 * Generates a palette of accessible colors
 */
export function generateAccessiblePalette(baseColor: string, count: number = 5): string[] {
  const baseRgb = hexToRgb(baseColor)
  const palette: string[] = [baseColor]

  for (let i = 1; i < count; i++) {
    const factor = (i + 1) / count
    const newRgb: ColorRGB = {
      r: Math.round(baseRgb.r * factor),
      g: Math.round(baseRgb.g * factor),
      b: Math.round(baseRgb.b * factor),
    }

    palette.push(rgbToHex(newRgb))
  }

  return palette
}

/**
 * Validates hex color format
 */
export function isValidHexColor(hex: string): boolean {
  const hexPattern = /^#[0-9A-Fa-f]{3,6}$/
  return hexPattern.test(hex)
}

/**
 * Normalizes hex color to 6-digit format
 */
export function normalizeHexColor(hex: string): string {
  if (!isValidHexColor(hex)) {
    throw new Error(`Invalid hex color format: ${hex}`)
  }

  const cleanHex = hex.replace('#', '')

  if (cleanHex.length === 3) {
    return (
      '#' +
      cleanHex
        .split('')
        .map(char => char + char)
        .join('')
    )
  }

  return '#' + cleanHex
}
