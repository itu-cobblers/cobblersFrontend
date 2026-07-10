/**
 * tasks.ts — the single source of truth for the task list (the "task boundary").
 *
 * Tasks come from the 3-day bootIT slide decks, grouped by `day` and split by
 * `kind`:
 *   - 'code'    — write & run Java; graded by check() on the run result.
 *   - 'predict' — read a read-only snippet and predict its printed output.
 *   - 'project' — a multi-file mini-project uploaded from VS Code.
 *
 * To add/change a task or its grading, edit only this file. Grading helpers live
 * in grade.ts; predict grading in predict.ts. See src/types/task.ts for shapes.
 */
import type { Task } from '@types'
import { includesAll, includesLine, matches } from './grade'

export const defaultStarter = `public class Main {
    public static void main(String[] args) {
        // Write your solution here, then press Submit.
        System.out.println("Hello, bootIT!");
    }
}
`

const mainStarter = (body: string) => `public class Main {
    public static void main(String[] args) {
${body}
    }
}
`

// ── Day 3 grader harnesses (hidden Main that drives the student's class) ──────
const personHarness = `public class Main {
    public static void main(String[] args) {
        Person p = new Person("Niek", 25);
        p.display();
        p.birthday();
        p.display();
    }
}
`

const flightTicketHarness = `public class Main {
    public static void main(String[] args) {
        FlightTicket t = new FlightTicket("CPH", "JFK", 7500);
        t.show();
        t.discount();
        t.show();
        for (int i = 0; i < 20; i++) { t.discount(); }
        t.show();
    }
}
`

const containerHarness = `public class Main {
    public static void main(String[] args) {
        Container c = new Container("AX35", 30);
        c.addCargo(23);
        c.show();
        c.addCargo(40);
        c.show();
    }
}
`

export const TASKS: Task[] = [
  // ─────────────────────────── DAY 1 — basics ───────────────────────────
  {
    id: 0,
    day: 1,
    kind: 'code',
    title: 'Name your Café shop',
    description:
      "Welcome to your very own hygge café! Every café needs a name. Print your café's name to the console — whatever you print appears on the shop board.",
    hint: 'Use System.out.println("My Cozy Café"); inside main, then press Submit.',
    starter: mainStarter("        // Print your café's name — it will appear on the shop board."),
    check({ output, exitCode }) {
      const firstLine = (output ?? '').trim().split('\n')[0] ?? ''
      const passed = exitCode === 0 && !!output?.trim()
      return { passed, signals: passed ? { cafeName: firstLine } : undefined }
    },
  },
  {
    id: 1,
    day: 1,
    kind: 'code',
    title: 'Hello, World!',
    description: 'Make the program print exactly: Hello World!',
    hint: 'System.out.println("Hello World!");',
    starter: mainStarter('        // Print Hello World!'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && (includesLine(output, 'Hello World!') || includesLine(output, 'Hello, World!')) }),
  },
  {
    id: 2,
    day: 1,
    kind: 'code',
    title: 'Print three values',
    description:
      'Print these three things, each on its own line: 2024, a greeting like "Hello, my name is …!", and -273.15.',
    hint: 'Three System.out.println(...) statements — an int, a String, and a double.',
    starter: mainStarter('        // Print 2024, a greeting, and -273.15'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesAll(output, ['2024', '-273.15']) }),
  },
  {
    id: 3,
    day: 1,
    kind: 'code',
    title: 'Use variables',
    description:
      'Print the same three values, but this time store them in variables first: year (int), name (String), abs_nul (double). Remember: different values need different types.',
    hint: 'int year = 2024; double abs_nul = -273.15; then println each.',
    starter: mainStarter('        // Declare year, name, abs_nul — then print them'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesAll(output, ['2024', '-273.15']) }),
  },
  {
    id: 4,
    day: 1,
    kind: 'code',
    title: 'Your age',
    description:
      'Using a variable called age (= 26), print "I am 26 years old". Then print "Next year I will be 27!" still using age.',
    hint: 'Print age, then age + 1. Numbers join to text with +.',
    starter: mainStarter('        int age = 26;\n        // Print the two sentences using age'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesAll(output, ['26 years old', '27']) }),
  },
  {
    id: 5,
    day: 1,
    kind: 'code',
    title: 'Concatenate strings',
    description:
      'Given the words "Hello", "my", "friend", print them as a single line: Hello my friend!',
    hint: 'Join with +: first + " " + second + " " + third + "!"',
    starter: mainStarter(
      '        String first = "Hello";\n        String second = "my";\n        String third = "friend";\n        // Print: Hello my friend!',
    ),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesLine(output, 'Hello my friend!') }),
  },
  {
    id: 6,
    day: 1,
    kind: 'code',
    title: 'Currency converter',
    description:
      'Convert 100 DKK to euro (1 euro = 7.45 kr) and print e.g. "100 kr corresponds to 13.42 euro".',
    hint: 'double eur = dkk / 7.45;',
    starter: mainStarter('        int dkk = 100;\n        // Convert to euro and print the sentence'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesAll(output, ['kr corresponds to', 'euro']) }),
  },
  {
    id: 7,
    day: 1,
    kind: 'code',
    title: 'Celsius → Fahrenheit',
    description:
      'Fahrenheit is Celsius × 1.8, then + 32. For c = 37.5, print "37.5C is the same as 99.5F".',
    hint: 'double f = (c * 1.8) + 32;',
    starter: mainStarter('        double c = 37.5;\n        // Compute f and print the sentence'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesAll(output, ['37.5', '99.5']) }),
  },
  {
    id: 8,
    day: 1,
    kind: 'code',
    title: 'Two functions',
    description:
      'Refactor the temperature conversion into two parameterised functions: c2f(double c) and f2c(double f), each printing the result.',
    hint: 'static void c2f(double c) { ... }  — call it from main.',
    starter: `public class Temperature {
    static void c2f(double c) {
        // print Celsius as Fahrenheit
    }

    static void f2c(double f) {
        // print Fahrenheit as Celsius
    }

    public static void main(String[] args) {
        c2f(37.5);
        f2c(99.5);
    }
}
`,
    check: ({ code, exitCode }) =>
      ({ passed: exitCode === 0 && matches(code, /c2f\s*\(/) && matches(code, /f2c\s*\(/) }),
  },
  {
    id: 9,
    day: 1,
    kind: 'code',
    title: 'BMI calculator',
    description:
      'BMI is weight (kg) divided by height (m) squared. For height 195 cm and weight 84.5 kg, compute and print the BMI.',
    hint: 'Convert cm to m (÷100), then bmi = weight / (heightM * heightM).',
    starter: mainStarter(
      '        double weight = 84.5;\n        double heightCM = 195;\n        // Compute BMI and print it (include the word BMI)',
    ),
    check: ({ output, exitCode }) => ({ passed: exitCode === 0 && matches(output, /bmi/i) }),
  },

  // ─────────────────── DAY 2 — conditionals, loops, input ───────────────────
  {
    id: 10,
    day: 2,
    kind: 'code',
    title: 'Is it daytime?',
    description:
      'Given an hour (0–23), print "Yes, it is daytime!" from 08:00 onward, otherwise "No, it is nighttime."',
    hint: 'Use if (time >= 8) { ... } else { ... }',
    starter: mainStarter('        int time = 14;\n        // Print daytime or nighttime'),
    check: ({ output, exitCode }) => ({ passed: exitCode === 0 && matches(output, /daytime|nighttime/i) }),
  },
  {
    id: 11,
    day: 2,
    kind: 'code',
    title: 'Big or small',
    description:
      'Write a parameterised function bigsmall(int n) that prints "<n> is a big number" when n > 99, otherwise "<n> is a small number".',
    hint: 'static void bigsmall(int number) { if (number > 99) ... }',
    starter: `public class Number {
    static void bigsmall(int number) {
        // print big or small
    }

    public static void main(String[] args) {
        bigsmall(2);
        bigsmall(999);
    }
}
`,
    check: ({ output, exitCode }) => ({ passed: exitCode === 0 && matches(output, /(big|small) number/i) }),
  },
  {
    id: 12,
    day: 2,
    kind: 'code',
    title: 'Even or odd',
    description:
      'Write a function even(int n) that RETURNS a boolean (true if n is even). Use it to print "<n> is even" or "<n> is not even".',
    hint: 'Even numbers are divisible by 2: number % 2 == 0',
    starter: `public class Numbers {
    static boolean even(int number) {
        // return whether number is even
        return false;
    }

    public static void main(String[] args) {
        int number = 2;
        // use even(number) to print the result
    }
}
`,
    check: ({ code, output, exitCode }) =>
      ({ passed: exitCode === 0 && matches(code, /boolean\s+even/) && matches(output, /is (not )?even/i) }),
  },
  {
    id: 13,
    day: 2,
    kind: 'code',
    title: 'Time of day',
    description:
      'Write daypart(int time) that RETURNS a String: 0 midnight, 1–5 night, 6–11 morning, 12 noon, 13–17 afternoon, 18+ evening. Print "It is <daypart>".',
    hint: 'Use an if / else-if chain that returns a String.',
    starter: `public class TimeOfDay {
    static String daypart(int time) {
        // return the part of the day
        return "";
    }

    public static void main(String[] args) {
        System.out.println("It is " + daypart(9));
    }
}
`,
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && matches(output, /morning|noon|afternoon|evening|night|midnight/i) }),
  },
  {
    id: 14,
    day: 2,
    kind: 'code',
    title: 'Multiplication series',
    description:
      'Using a loop, print the multiplication series for 5: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 (one per line is fine).',
    hint: 'for (int i = 1; i <= 10; i++) { System.out.println(series * i); }',
    starter: mainStarter('        int series = 5;\n        // Print series * 1 ... series * 10 with a loop'),
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesLine(output, '50') && includesLine(output, '45') }),
  },
  {
    id: 15,
    day: 2,
    kind: 'code',
    title: 'Guess the number',
    description:
      'A number-guessing game: pick a secret with Random, read guesses with a Scanner in a while loop, and print "Too low" / "Too high" until correct.',
    hint: 'Scanner scanner = new Scanner(System.in); while (guess != secret) { guess = scanner.nextInt(); ... }',
    stdin: '50\n25\n37\n31\n34\n',
    starter: `import java.util.*;

public class Guess {
    public static void main(String[] args) {
        Random random = new Random();
        Scanner scanner = new Scanner(System.in);
        int secret = random.nextInt(100);
        int tries = 0;
        int guess = -1;
        // Loop until the guess equals secret; print Too low / Too high
    }
}
`,
    check: ({ code, exitCode }) =>
      ({ passed: exitCode === 0 && matches(code, /Scanner/) && matches(code, /while/) && matches(code, /nextInt/) }),
  },
  {
    id: 16,
    day: 2,
    kind: 'code',
    title: 'NIM (bonus)',
    description:
      'Bonus: build NIM for 2 players. Matches on the table; each turn a player takes 1–3 (never more than what is left). Whoever takes the last match wins. Read moves with a Scanner.',
    hint: 'Track remaining matches in a loop; validate the move is 1–3 and not more than remaining.',
    starter: `import java.util.*;

public class Nim {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int matches = 13;
        // Take turns until the matches run out
    }
}
`,
  },

  // ─────────────────── DAY 2 — predict-the-output loop quizzes ───────────────────
  {
    id: 17,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 1',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `int i = 10;
while (i > 0) {
    System.out.println(i);
    i = i - 1;
}`,
    expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1',
  },
  {
    id: 18,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 2',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `int i = 1;
while (i <= 10) {
    System.out.println(i);
    i = i + 2;
}`,
    expectedOutput: '1\n3\n5\n7\n9',
  },
  {
    id: 19,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 3',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `int i = 1;
while (i < 100) {
    System.out.println(i);
    i = i * 2;
}`,
    expectedOutput: '1\n2\n4\n8\n16\n32\n64',
  },
  {
    id: 20,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 4',
    description: 'Careful with this one! Predict what it prints — some loops never stop.',
    hint: 'What is 1 × 1? Does i ever change?',
    snippet: `int i = 1;
while (i < 42) {
    System.out.println(i);
    i = i * i;
}`,
    expectedOutput: 'infinite loop',
    accept: ['infinite', 'never stops', 'never ends', 'forever', 'loops forever', 'does not stop', "doesn't stop"],
  },
  {
    id: 21,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 5',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `int i = 0;
while (i <= 15) {
    System.out.println(i);
    i = i + 3;
}`,
    expectedOutput: '0\n3\n6\n9\n12\n15',
  },
  {
    id: 22,
    day: 2,
    kind: 'predict',
    title: 'While Loop Quiz 6',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `int i = 64;
while (i >= 2) {
    System.out.println(i);
    i = i / 2;
}`,
    expectedOutput: '64\n32\n16\n8\n4\n2',
  },
  {
    id: 23,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 1',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 10; i > 0; i = i - 2) {
    System.out.println(i);
}`,
    expectedOutput: '10\n8\n6\n4\n2',
  },
  {
    id: 24,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 2',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 1; i < 10; i = i + 3) {
    System.out.println(i);
}`,
    expectedOutput: '1\n4\n7',
  },
  {
    id: 25,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 3',
    description: 'Careful with this one! Predict what it prints — some loops never stop.',
    hint: 'What is 1 × 1? Does i ever grow?',
    snippet: `for (int i = 1; i < 10; i = i * i) {
    System.out.println(i);
}`,
    expectedOutput: 'infinite loop',
    accept: ['infinite', 'never stops', 'never ends', 'forever', 'loops forever', 'does not stop', "doesn't stop"],
  },
  {
    id: 26,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 4',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 0; i <= 15; i = i + 3) {
    System.out.println(i);
}`,
    expectedOutput: '0\n3\n6\n9\n12\n15',
  },
  {
    id: 27,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 5',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 1; i <= 10000; i = i * 10) {
    System.out.println(i);
}`,
    expectedOutput: '1\n10\n100\n1000\n10000',
  },
  {
    id: 28,
    day: 2,
    kind: 'predict',
    title: 'For Loop Quiz 6',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 64; i >= 2; i = i / 2) {
    System.out.println(i);
}`,
    expectedOutput: '64\n32\n16\n8\n4\n2',
  },

  // ─────────────────── DAY 3 — classes & objects (harness-graded) ───────────────────
  {
    id: 29,
    day: 3,
    kind: 'code',
    title: 'Person class',
    description:
      'Warm-up: make a Person class with fields name and age, a constructor Person(String n, int a), display() that prints "Niek (25 years old)", and birthday() that adds a year.',
    hint: 'display(): System.out.println(name + " (" + age + " years old)");',
    solutionFile: 'Person.java',
    harness: { files: [{ name: 'Main.java', content: personHarness }], entryClass: 'Main' },
    starter: `class Person {
    // fields: name, age

    // constructor Person(String n, int a)

    // void display()  -> "Niek (25 years old)"

    // void birthday() -> age + 1
}
`,
    check: ({ output, exitCode }) =>
      ({ passed: exitCode === 0 && includesLine(output, 'Niek (25 years old)') && includesLine(output, 'Niek (26 years old)') }),
  },
  {
    id: 30,
    day: 3,
    kind: 'code',
    title: 'FlightTicket class',
    description:
      'Make a FlightTicket class: fields from, to, price; constructor (f, t, p); show() prints "CPH --> JFK (7500 DKK)"; discount() takes 500 DKK off. Make sure discount() can\'t be abused (price must never go negative).',
    hint: 'In discount(), only subtract if the price stays >= 0.',
    solutionFile: 'FlightTicket.java',
    harness: { files: [{ name: 'Main.java', content: flightTicketHarness }], entryClass: 'Main' },
    starter: `class FlightTicket {
    // fields: from, to, price

    // constructor FlightTicket(String f, String t, int p)

    // void show()     -> "CPH --> JFK (7500 DKK)"

    // void discount() -> 500 DKK off, but never below 0
}
`,
    check: ({ output, exitCode }) =>
      ({
        passed:
          exitCode === 0 &&
          includesLine(output, 'CPH --> JFK (7500 DKK)') &&
          includesLine(output, 'CPH --> JFK (7000 DKK)') &&
          !matches(output, /-\d+\s*DKK/),
      }),
  },
  {
    id: 31,
    day: 3,
    kind: 'code',
    title: 'Container class',
    description:
      'Make a Container class: fields id, amount, max; constructor Container(String i, int max) (amount starts at 0); show() prints "Container: AX35 (23/30)"; addCargo(int a) adds boxes. Make sure the container can\'t be over-filled.',
    hint: 'In addCargo, only add if amount + a <= max (mirror the Account guard pattern).',
    solutionFile: 'Container.java',
    harness: { files: [{ name: 'Main.java', content: containerHarness }], entryClass: 'Main' },
    starter: `class Container {
    // fields: id, amount, max

    // constructor Container(String i, int max)  -> amount = 0

    // void show()           -> "Container: AX35 (23/30)"

    // void addCargo(int a)  -> add boxes, but never above max
}
`,
    check: ({ output, exitCode }) =>
      ({
        passed:
          exitCode === 0 &&
          includesLine(output, 'Container: AX35 (23/30)') &&
          !matches(output, /\((?:3[1-9]|[4-9]\d|\d{3,})\/30\)/),
      }),
  },

  // ─────────────────── DAY 3 — mini-projects (multi-file upload) ───────────────────
  {
    id: 32,
    day: 3,
    kind: 'project',
    title: 'Build a Tree',
    description: 'Mini-project: model a growing (and eventually dying, occasionally blooming) tree.',
    entryClass: 'Main',
    requiredClasses: ['Tree'],
    brief: `Build a Tree®

You've started a green company — Build a Tree®. Build an awesome piece of Java in VS Code.

1) A class representing a Tree, with display() to show current info, and grow() so it can grow.
2) Work with at least a height and an age, so it can grow and get older. Parameterise growth_rate and max_age so the tree can die — and track whether it is alive or dead (print this too).
3) Make the tree flower every 5th year, but NOT every 20th year — unless we enter a new century!

Sketch:
> Your tree is currently 0 years old,        // display()
  It has reached the height of 1.0cm.
> And your tree just grew a year older!       // grow()
  ...
> Your tree is currently 5 years old,
  It has reached the height of 32.0cm, and it is currently blooming.
  ...
> The tree has died                           // grow()
> The tree is dead, and reached the age 11 with a height of 2048.0cm
> The tree is already dead.                   // grow() again

Develop it in VS Code, then upload your .java files here to run them.`,
  },
  {
    id: 33,
    day: 3,
    kind: 'project',
    title: "Grandpa's Time Machine",
    description: 'Mini-project: a text-based time machine that travels between years.',
    entryClass: 'Main',
    requiredClasses: ['TimeMachine'],
    brief: `Grandpa's Time Machine

Make a text-based time machine for grandpa Rick (who thinks it's 3013).

1) Move back and forward in time with the same method taking a destination year as a parameter, and tell him which year he ends up in. Announce every year that passes while travelling, and when he reaches the destination.
2) Tell him when he passes a year with an important historical event.
3) Tell him whenever it is a leap year — and be precise (handle the century rule).

Sketch (travelling 2016 → 2020):
Tim3M4chin3: current year is now 2016
Tim3M4chin3: A leap year just happened WoOoOOoOW!
Tim3M4chin3: Current year is now 2017
Tim3M4chin3: Current year is now 2018
Tim3M4chin3: A lot of awesome people went to BootIT
Tim3M4chin3: Current year is now 2019
Tim3M4chin3: You arrived to your destination: 2020

Hint: model the machine as an object — store the current year as a field; one method for each direction (or one smart loop). Develop in VS Code, then upload your .java files here.`,
  },
  {
    id: 34,
    day: 3,
    kind: 'project',
    title: "Grandma's Blackmarket Kitchen",
    description: 'Mini-project: a catering planner that assigns menus and dodges the police.',
    entryClass: 'Main',
    requiredClasses: ['Kitchen'],
    brief: `Grandma's Blackmarket Kitchen

Grandma caters (tax-free!) with two menus. Help her plan orders.

1) Input the total number of people and how many are picky eaters.
2) Refuse police stings: 8 people with 7 picky (the police), and 4 people with 7 picky (the grandson — an impossible order). Print an error for those.
3) Picky eaters always get the first menu; non-picky get a randomly chosen menu.
4) Print the order summary, e.g.:
Grandma: I want to cook the following 10 menus to you:
7x 1. Tarteletter, 2. Stegt flæsk m. persillesovs, 3. citronfromage
3x 1. red cabbage salad, 2. curry chicken, 3. rødgrød m. fløde

Hint: use if-else for the bad orders; subtract picky eaters from the total and loop for the rest. Random: int r = (new Random()).nextInt(6);

Develop in VS Code, then upload your .java files here.`,
  },
]
