/**
 * tasks.ts — the single source of truth for the task list.
 *
 * Each task is self-contained: its copy, its starter code, and its own
 * passing criteria. This is the "task boundary": to add a task or change how
 * a task is graded, edit only this file — nothing in the views needs to change.
 *
 * check() receives the run result { code, output, stderr, exitCode } and
 * returns a Verdict { passed, signals?, message? }. `signals` is a free-form,
 * theme-agnostic bag broadcast on success (e.g. { cafeName }); the core never
 * interprets it — see src/types/task.ts and src/lib/CLAUDE.md.
 */
import type { Task } from '@types'

export const defaultStarter = `public class Main {
    public static void main(String[] args) {
        // Write your solution here, then press Submit.
        System.out.println("Hello, bootIT!");
    }
}
`

export const TASKS: Task[] = [
  {
    id: 0,
    title: 'Name your Café shop',
    difficulty: 'Easy',
    description:
      'Welcome to your very own hygge café! Every café needs a name. Print your café\'s name to the console — whatever you print will appear on the shop board.',
    hint: 'Use System.out.println("My Cozy Café"); inside the main method, then press Submit.',
    starter: `public class Main {
    public static void main(String[] args) {
        // Task 1: Name your Café shop!
        // Print your café's name — it will appear on the shop board.
    }
}
`,
    // Passes on any successful, non-empty print. Broadcasts the first printed
    // line as the `cafeName` signal (themes may use it; core does not).
    check({ output, exitCode }) {
      const firstLine = (output ?? '').trim().split('\n')[0] ?? ''
      const passed = exitCode === 0 && !!output?.trim()
      return {
        passed,
        signals: passed ? { cafeName: firstLine } : undefined,
      }
    },
  },
  {
    id: 1,
    title: 'FizzBuzz',
    difficulty: 'Easy',
    description:
      'Print numbers 1–100. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for both print "FizzBuzz".',
  },
  {
    id: 2,
    title: 'Reverse a String',
    difficulty: 'Easy',
    description: 'Write a function that returns the reverse of a given string.',
  },
  {
    id: 3,
    title: 'Two Sum',
    difficulty: 'Medium',
    description:
      'Given an array of integers and a target, return indices of the two numbers that add up to the target.',
  },
  {
    id: 4,
    title: 'Binary Search',
    difficulty: 'Medium',
    description: 'Implement binary search on a sorted array.',
  },
]
