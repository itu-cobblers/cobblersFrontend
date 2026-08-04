import { describe, it, expect } from 'vitest'
import { findLocalTypeRanges } from './javaLocalTypes'

describe('findLocalTypeRanges', () => {
  it('returns nothing when there are no local classes', () => {
    expect(findLocalTypeRanges('FlightTicket t = new FlightTicket();', [])).toEqual([])
  })

  it('finds every whole-word occurrence of a local class name', () => {
    const code = 'FlightTicket t = new FlightTicket("CPH", "JFK", 7500);'
    const ranges = findLocalTypeRanges(code, ['FlightTicket'])
    expect(ranges).toHaveLength(2)
    expect(ranges[0]).toEqual({ line: 1, startColumn: 1, endColumn: 13 })
    expect(ranges[1]).toEqual({ line: 1, startColumn: 22, endColumn: 34 })
  })

  it('does not match a class name that is only a prefix of another identifier', () => {
    const ranges = findLocalTypeRanges('FlightTicketBooking b;', ['FlightTicket'])
    expect(ranges).toEqual([])
  })

  it('ignores occurrences inside strings and comments', () => {
    const code = [
      '// new FlightTicket() in a comment',
      'String s = "FlightTicket";',
    ].join('\n')
    expect(findLocalTypeRanges(code, ['FlightTicket'])).toEqual([])
  })

  it('matches multiple distinct local class names', () => {
    const code = 'Person p; FlightTicket t;'
    const ranges = findLocalTypeRanges(code, ['Person', 'FlightTicket'])
    expect(ranges).toHaveLength(2)
  })

  it('tracks line numbers across multiple lines', () => {
    const code = ['FlightTicket t;', '', 'FlightTicket u;'].join('\n')
    const ranges = findLocalTypeRanges(code, ['FlightTicket'])
    expect(ranges.map((r) => r.line)).toEqual([1, 3])
  })
})
