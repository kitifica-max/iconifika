import { getIconSvg, searchIcons, listSets } from './iconify'

describe('getIconSvg', () => {
  it('retorna SVG para icono existente', () => {
    const svg = getIconSvg('mdi', 'home')
    expect(svg).toContain('<svg')
    expect(svg).toContain('viewBox')
  })

  it('retorna null para icono inexistente', () => {
    const svg = getIconSvg('mdi', 'icono-que-no-existe-xyz')
    expect(svg).toBeNull()
  })

  it('inyecta color cuando se especifica', () => {
    const svg = getIconSvg('mdi', 'home', '#ff0000')
    expect(svg).toContain('#ff0000')
  })
})

describe('searchIcons', () => {
  it('retorna resultados para query válida', () => {
    const results = searchIcons('home')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty('set')
    expect(results[0]).toHaveProperty('name')
    expect(results[0]).toHaveProperty('body')
  })

  it('filtra por set cuando se especifica', () => {
    const results = searchIcons('home', 'lucide')
    expect(results.every(r => r.set === 'lucide')).toBe(true)
  })

  it('respeta el límite', () => {
    const results = searchIcons('icon', undefined, 5)
    expect(results.length).toBeLessThanOrEqual(5)
  })
})

describe('listSets', () => {
  it('retorna lista de sets', () => {
    const sets = listSets()
    expect(sets.length).toBeGreaterThan(0)
    expect(sets[0]).toHaveProperty('id')
    expect(sets[0]).toHaveProperty('name')
    expect(sets[0]).toHaveProperty('total')
  })
})
