import { describe, it, expect } from 'vitest'
import { ASSIGNMENTS } from './assignments'
import type { CheckResult } from '@types'

const codeCheck = (id: number) => {
  const assignment = ASSIGNMENTS.find((t) => t.id === id)
  if (assignment?.kind !== 'code') throw new Error(`assignment ${id} is not a code assignment`)
  const check = assignment.check
  if (!check) throw new Error(`assignment ${id} has no check`)
  return check
}

const run = (id: number, partial: Partial<CheckResult>) =>
  codeCheck(id)({ code: '', output: '', stderr: '', exitCode: 0, ...partial })

const inMain = (body: string) => `public class Main {
    public static void main(String[] args) {
${body}
    }
}`

describe('Day 1 checks', () => {
  it('every Day-1 failure path carries a message', () => {
    const verdict = run(0, { output: 'Hello World!' })
    expect(verdict.passed).toBe(false)
    expect(verdict.message).toBeTruthy()
  })

  it('failed runs are gated with a message', () => {
    const verdict = run(0, { output: '', exitCode: 1 })
    expect(verdict.passed).toBe(false)
    expect(verdict.message).toMatch(/did not run/)
  })

  it('Hello ITU passes only on the exact line', () => {
    expect(run(0, { output: 'Hello ITU!' }).passed).toBe(true)
    expect(run(0, { output: 'hello itu' }).passed).toBe(false)
  })

  it('Print three values wants int, double and greeting lines', () => {
    expect(run(1, { output: 'Hello, my name is Aiting!\n1996\n3.5' }).passed).toBe(true)
    const noDouble = run(1, { output: 'Hello, my name is Aiting!\n1996\n3' })
    expect(noDouble.passed).toBe(false)
    expect(noDouble.message).toMatch(/decimal/)
  })

  it('Use variables rejects printing literals directly', () => {
    const literalPrint = run(2, {
      code: inMain(
        '        String greeting = "Hello, my name is Aiting!";\n        int birthYear = 1996;\n        double years = 3.5;\n        System.out.println("Hello, my name is Aiting!");\n        System.out.println(1996);\n        System.out.println(years);',
      ),
      output: 'Hello, my name is Aiting!\n1996\n3.5',
    })
    expect(literalPrint.passed).toBe(false)
    expect(literalPrint.message).toMatch(/printing a value directly/i)
  })

  it('Use variables rejects missing declarations, even when faked in comments', () => {
    const commented = run(2, {
      code: inMain('        // String s = "x"; int y = 1; double d = 1.0;\n        System.out.println("hi");'),
      output: 'hi',
    })
    expect(commented.passed).toBe(false)
    expect(commented.message).toMatch(/String variable/)
  })

  it('Use variables passes when values flow through variables', () => {
    const verdict = run(2, {
      code: inMain(
        '        String greeting = "Hello, my name is Aiting!";\n        int birthYear = 1996;\n        double years = 3.5;\n        System.out.println(greeting);\n        System.out.println(birthYear);\n        System.out.println(years);',
      ),
      output: 'Hello, my name is Aiting!\n1996\n3.5',
    })
    expect(verdict.passed).toBe(true)
  })

  it('Variable assignment rejects a hardcoded 28', () => {
    const hardcoded = run(3, {
      code: inMain(
        '        int age = 27;\n        System.out.println("ITU is " + age + " years old.");\n        age = age + 1;\n        System.out.println("Next year ITU will be 28 years old." + age);',
      ),
      output: 'ITU is 27 years old.\nNext year ITU will be 28 years old.',
    })
    expect(hardcoded.passed).toBe(false)
    expect(hardcoded.message).toMatch(/27 or 28/)
  })

  it('Variable assignment requires reusing age', () => {
    const verdict = run(3, {
      code: inMain(
        '        int age = 27;\n        System.out.println("ITU is " + age + " years old.");\n        age = age + 1;\n        System.out.println("Next year ITU will be " + age + " years old.");',
      ),
      output: 'ITU is 27 years old.\nNext year ITU will be 28 years old.',
    })
    expect(verdict.passed).toBe(true)
  })

  it('Operators flags int division', () => {
    const intDivision = run(4, {
      code: inMain('        System.out.println(12 * 4 + 30);\n        System.out.println(78 / 4);'),
      output: '78\n19',
    })
    expect(intDivision.passed).toBe(false)
    expect(intDivision.message).toMatch(/4\.0/)
    expect(
      run(4, {
        code: inMain('        System.out.println(12 * 4 + 30);\n        System.out.println(78 / 4.0);'),
        output: '78\n19.5',
      }).passed,
    ).toBe(true)
  })

  it('String concatenation requires + in the println', () => {
    const bigLiteral = run(5, {
      code: inMain('        System.out.println("Hello my friend, Niek!");'),
      output: 'Hello my friend, Niek!',
    })
    expect(bigLiteral.passed).toBe(false)
    expect(bigLiteral.message).toMatch(/\+/)
  })

  it('Kroner to euro requires dividing by 7.45', () => {
    const verdict = run(6, {
      code: inMain(
        '        int dkk = 17;\n        double eur = dkk / 7.45;\n        System.out.println(dkk + " dkk corresponds to " + eur + " euro.");',
      ),
      output: '17 dkk corresponds to 2.2818791946308725 euro.',
    })
    expect(verdict.passed).toBe(true)
  })

  it('Functions requires two differing call sites', () => {
    const code = `class Valuta {
    static void cafeEuroPrice(String item, int dkk) {
        double eur = dkk / 7.45;
        System.out.println("A cup of " + item + " cost " + eur + " euros.");
    }

    public static void main(String[] args) {
        cafeEuroPrice("Cappuccino", 17);
        cafeEuroPrice("Cappuccino", 17);
    }
}`
    const sameArgs = run(7, {
      code,
      output: 'A cup of Cappuccino cost 2.28 euros.\nA cup of Cappuccino cost 2.28 euros.',
    })
    expect(sameArgs.passed).toBe(false)
    expect(sameArgs.message).toMatch(/different/)
    const verdict = run(7, {
      code: code.replace('cafeEuroPrice("Cappuccino", 17);\n    }', 'cafeEuroPrice("Matcha Latte", 20);\n    }'),
      output: 'A cup of Cappuccino cost 2.28 euros.\nA cup of Matcha Latte cost 2.68 euros.',
    })
    expect(verdict.passed).toBe(true)
  })

  it('ECTS printer wants a 3-parameter function and two courses', () => {
    const code = `class StudyPlan {
    static void printCourse(String name, int ects, int semester) {
        System.out.println(name + " (" + ects + " ECTS) is in semester " + semester + ".");
    }

    public static void main(String[] args) {
        printCourse("Software Design", 15, 1);
        printCourse("Mobile App Development", 15, 2);
    }
}`
    const verdict = run(8, {
      code,
      output: 'Software Design (15 ECTS) is in semester 1.\nMobile App Development (15 ECTS) is in semester 2.',
    })
    expect(verdict.passed).toBe(true)
  })
})

describe('Day 3 checks', () => {
  it('Container passes when filled correctly and capped at max', () => {
    const verdict = run(30, { output: 'Container: AX35 (23/30)\nContainer: AX35 (30/30)' })
    expect(verdict.passed).toBe(true)
  })

  it('Container fails when over-filled past max', () => {
    const verdict = run(30, { output: 'Container: AX35 (23/30)\nContainer: AX35 (63/30)' })
    expect(verdict.passed).toBe(false)
  })
})

describe('bundle invariants', () => {
  it('every assignment has a unique sequential id', () => {
    const ids = ASSIGNMENTS.map((t) => t.id)
    expect(ids).toEqual(ids.map((_, i) => i))
  })
})
