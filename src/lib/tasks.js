/**
 * tasks.js — the single source of truth for the task list.
 *
 * Each task is self-contained: its copy, its starter code, and its own
 * passing criteria. This is the "task boundary": to add a task or change how
 * a task is graded, edit only this file — nothing in App.jsx needs to change.
 *
 * Task shape:
 *   {
 *     id:          number   // array index, sequential from 0
 *     title:       string
 *     difficulty:  'Easy' | 'Medium' | 'Hard'
 *     description: string
 *     hint?:       string
 *     starter?:    string   // initial Java shown when this task is opened
 *     check?:      (result) => Verdict   // passing criteria; omit = never auto-passes
 *   }
 *
 * check() receives the run result and returns a Verdict:
 *   result:  { code, output, stderr, exitCode }   // code = editor text
 *   Verdict: { passed: boolean, signals?: object, message?: string }
 *
 * `signals` is a free-form, theme-agnostic bag the task broadcasts on success
 * (e.g. { cafeName: 'X' }). The core app never interprets signals — it just
 * merges them into shared state and hands them to the active theme, which
 * decides what (if anything) to do with each key. This keeps tasks decoupled
 * from whichever theme happens to be plugged in.
 */

export const defaultStarter = `public class Main {
    public static void main(String[] args) {
        // Write your solution here, then press Submit.
        System.out.println("Hello, bootIT!");
    }
}
`

export const TASKS = [
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
