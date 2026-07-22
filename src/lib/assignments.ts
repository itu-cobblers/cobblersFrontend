/**
 * assignments.ts — the legacy local assignment bundle (the "assignment boundary").
 * Live data comes from assignmentSetApi.ts; this bundle backs the mock fallback.
 *
 * Assignments come from the 3-day bootIT slide decks, split by `kind`:
 *   - 'code'    — write & run Java; graded by check() on the run result.
 *   - 'predict' — read a read-only snippet and predict its printed output.
 *   - 'project' — a multi-file mini-project uploaded from VS Code.
 *
 * Each entry may carry `lesson` blocks — teaching content (concept + example
 * code) rendered above the task. Every check() failure path returns a
 * beginner-friendly `message`; structural code checks run on stripCode() so
 * comments and string literals can't fake a pass.
 *
 * To add/change an assignment or its grading, edit only this file. Grading helpers live
 * in grade.ts; predict grading in predict.ts. See src/types/assignment.ts for shapes.
 */
import type { Assignment, Verdict } from '@types'
import {
  callArgs,
  includesAll,
  includesLine,
  matches,
  normalizeOutput,
  outputLines,
  printlnArgs,
  stripCode,
  stripComments,
} from './grade'

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

/** Shared first guard: the run must succeed before anything is graded. */
const notRun: Verdict = {
  passed: false,
  message: 'The program did not run — fix the error shown in the terminal first.',
}

const fail = (message: string): Verdict => ({ passed: false, message })

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

export const ASSIGNMENTS: Assignment[] = [
  // ─────────────────────────── DAY 1 — basics ───────────────────────────
  {
    id: 0,
    kind: 'code',
    title: 'Hello ITU',
    lesson: [
      {
        kind: 'text',
        text: 'Printing a message is the most basic thing every programming language can do. In Java it takes a class, a main method, and one print statement:',
      },
      {
        kind: 'code',
        code: `class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
      },
    ],
    description: 'Now it is your turn: print a sentence to say hello to your new university. Print exactly: Hello ITU!',
    hint: 'System.out.println("Hello ITU!");',
    starter: mainStarter('        // Say hello to ITU'),
    check({ output, exitCode }) {
      if (exitCode !== 0) return notRun
      if (!includesLine(output, 'Hello ITU!')) {
        return fail('Almost! Print exactly Hello ITU! — check the capital letters and the exclamation mark.')
      }
      return { passed: true }
    },
  },
  {
    id: 1,
    kind: 'code',
    title: 'Print three values',
    lesson: [
      {
        kind: 'text',
        text: 'println can print more than text — whole numbers and decimal numbers work too. Notice that numbers need no quotes:',
      },
      {
        kind: 'code',
        code: `System.out.println("Hello World!");
System.out.println(42);
System.out.println(3.14);`,
      },
    ],
    description: `Print three things, each on its own line:
1. A greeting with your name, like "Hello, my name is Aiting!"
2. The year you were born — a whole number
3. How many years you have lived in Copenhagen — with a decimal point (1.0 for exactly one year, 3.5 for three and a half)`,
    hint: 'Three println statements. 1996 is an int, 3.5 is a double, "Hello!" is a String.',
    starter: mainStarter('        // 1) a greeting  2) your birth year  3) years in Copenhagen (with a decimal)'),
    check({ output, exitCode }) {
      if (exitCode !== 0) return notRun
      const lines = outputLines(output).map((line) => line.trim())
      if (lines.length < 3) return fail('Print three separate lines — one println per value.')
      if (!lines.some((line) => /^-?\d+$/.test(line))) {
        return fail('One line should be just a whole number (your birth year) — digits only, no words or quotes.')
      }
      if (!lines.some((line) => /^-?\d+\.\d+$/.test(line))) {
        return fail('Print the years in Copenhagen with a decimal point, like 1.0 or 3.5.')
      }
      if (!lines.some((line) => /[A-Za-z]{2,}/.test(line))) {
        return fail('One line should be a greeting sentence with your name.')
      }
      return { passed: true }
    },
  },
  {
    id: 2,
    kind: 'code',
    title: 'Use variables',
    lesson: [
      {
        kind: 'text',
        text: 'The same values can be stored in variables first. A variable has a type, a name, and a value:',
      },
      {
        kind: 'code',
        code: `int x = 42;
System.out.println(x);

String s = "hi";
System.out.println(s);

double d = 3.14;
System.out.println(d);

boolean b = true;
System.out.println(b);`,
      },
      {
        kind: 'text',
        text: `The four basic types:
int — whole numbers: 1, 0, -420, 2147483647
String — text in quotes: "hi", "hello world", "14b"
double — decimal numbers: 1.5, 3.1415, -27.15, 1.0
boolean — true or false`,
      },
    ],
    description:
      'Print the same three values as before, but this time store each one in a variable first, then print the variable. Pick the right type: String for the greeting, int for the year, double for the years in Copenhagen.',
    hint: 'String greeting = "Hello, my name is …!"; then System.out.println(greeting);',
    starter: mainStarter('        // Declare a String, an int and a double — then print the variables'),
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const structure = stripCode(code)
      if (!/\bString\s+\w+\s*=/.test(structure)) {
        return fail('Store the greeting in a String variable first, e.g. String greeting = "Hello, my name is …!";')
      }
      if (!/\bint\s+\w+\s*=/.test(structure)) {
        return fail('Store your birth year in an int variable, e.g. int birthYear = 1996;')
      }
      if (!/\bdouble\s+\w+\s*=/.test(structure)) {
        return fail('Store the years in Copenhagen in a double variable, e.g. double years = 3.5;')
      }
      const args = printlnArgs(code)
      if (args.some((arg) => /^".*"$/s.test(arg) || /^-?[\d.]+$/.test(arg))) {
        return fail(
          'You are printing a value directly. Store it in a variable first, then print the variable, e.g. System.out.println(birthYear);',
        )
      }
      if (args.filter((arg) => /^[A-Za-z_]\w*$/.test(arg)).length < 3) {
        return fail('Print the variables themselves — println(greeting), println(birthYear), println(years).')
      }
      const lines = outputLines(output).map((line) => line.trim())
      if (!lines.some((line) => /^-?\d+$/.test(line)) || !lines.some((line) => /^-?\d+\.\d+$/.test(line))) {
        return fail('The output should still show all three values — the greeting, the whole-number year, and the decimal years.')
      }
      return { passed: true }
    },
  },
  {
    id: 3,
    kind: 'code',
    title: 'Variable assignment',
    lesson: [
      {
        kind: 'text',
        text: 'A variable can be given a new value later — that is why it is called a variable. The same variable then prints a different value:',
      },
      {
        kind: 'code',
        code: `int year = 2026;
System.out.print("The year is ");
System.out.println(year);   // The year is 2026

year = year + 1;
System.out.print("The year is now ");
System.out.println(year);   // The year is now 2027`,
      },
      {
        kind: 'text',
        text: 'Fun fact: ITU is the youngest university in Denmark, founded in 1999 — it turns 27 in 2026.',
      },
    ],
    description:
      'Use one int variable called age (starting at 27) to print "ITU is 27 years old." Then update the SAME variable with age = age + 1 and use it again to print "Next year ITU will be 28 years old."',
    hint: 'System.out.print(...) keeps printing on the same line; println(...) ends it.',
    starter: mainStarter('        int age = 27;\n        // Print both sentences — update age in between'),
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const normalized = normalizeOutput(output)
      if (!normalized.includes('ITU is 27 years old.') || !normalized.includes('Next year ITU will be 28 years old.')) {
        return fail('Print exactly: "ITU is 27 years old." and then "Next year ITU will be 28 years old."')
      }
      const structure = stripCode(code)
      const declarations = structure.match(/\bint\s+age\b/g) ?? []
      if (declarations.length === 0) return fail('Keep the variable — declare it once with int age = 27;')
      if (declarations.length > 1) {
        return fail('Declare age only once — the second time, just assign a new value: age = age + 1;')
      }
      if (!/\bage\s*=\s*age\s*\+\s*1\b|\bage\s*\+\+|\bage\s*\+=\s*1\b/.test(structure)) {
        return fail("Update the same variable with age = age + 1; — don't type 28 yourself.")
      }
      const argsUsingAge = printlnArgs(code).filter((arg) => /\bage\b/.test(stripCode(arg)))
      if (argsUsingAge.length < 2) {
        return fail("Use the age variable in both sentences — print the variable, don't hardcode the numbers.")
      }
      if (/"[^"\n]*2[78][^"\n]*"/.test(stripComments(code))) {
        // 27/28 typed inside a string literal — the student wrote the number out by hand
        return fail("Don't write 27 or 28 inside the text — let Java print them from age.")
      }
      return { passed: true }
    },
  },
  {
    id: 4,
    kind: 'code',
    title: 'Operators',
    lesson: [
      {
        kind: 'text',
        text: 'Java can calculate with + (plus), - (minus), * (multiply) and / (divide):',
      },
      {
        kind: 'code',
        code: `System.out.println(3 + 3);   // 6

int x = 2;
System.out.println(x * x);   // 4

int y = 6;
System.out.println(y / 3);   // 2`,
      },
    ],
    description:
      'Snack run at Cafe Analog: you buy one kanelsnegl (12 kr) for each of your 4 study-group friends, plus one juice (30 kr) to share. Print the total price (78). Then print what each of the 4 friends pays if you split the total evenly (19.5).',
    hint: 'Split with a decimal: total / 4.0 — dividing by the int 4 throws the .5 away.',
    starter: mainStarter(
      '        int snegl = 12;\n        int juice = 30;\n        int friends = 4;\n        // Print the total, then the price per friend',
    ),
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const normalized = normalizeOutput(output)
      if (!normalized.includes('78')) {
        return fail('First print the total: 4 kanelsnegle at 12 kr each, plus one 30 kr juice.')
      }
      if (!normalized.includes('19.5')) {
        if (matches(normalized, /\b19\b/)) {
          return fail('So close — Java throws away decimals when dividing two whole numbers. Divide by 4.0 instead of 4.')
        }
        return fail('Now split the total evenly between the 4 friends — each pays 19.5.')
      }
      const structure = stripCode(code)
      if (!structure.includes('*') || !structure.includes('/')) {
        return fail('Let Java do the math — use * for the kanelsnegle and / for the split.')
      }
      return { passed: true }
    },
  },
  {
    id: 5,
    kind: 'code',
    title: 'String concatenation',
    lesson: [
      {
        kind: 'text',
        text: '+ between Strings glues them together — this is called concatenation:',
      },
      {
        kind: 'code',
        code: `String hi = "Hello ";
String world = "World!";
String greet = hi + world;

System.out.println(greet);   // Hello World!`,
      },
      {
        kind: 'text',
        text: 'It also works between Strings and numbers:',
      },
      {
        kind: 'code',
        code: `int year = 2026;
System.out.println("The year is " + year);`,
      },
    ],
    description:
      'The starter prints "Hello my friend!". Ask the person sitting next to you for their name, then modify the code to greet them personally: Hello my friend, {Name}!',
    hint: 'Add a String name = "…"; and concatenate it after "friend, ".',
    starter: `public class Hello {
    public static void main(String[] args) {
        String first = "Hello";
        String second = "my";
        String third = "friend";
        System.out.println(first + " " + second + " " + third + "!");
    }
}
`,
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      if (!matches(normalizeOutput(output), /Hello my friend, .+!/)) {
        return fail('Print exactly: Hello my friend, {their name}! — comma and exclamation mark included.')
      }
      const args = printlnArgs(code)
      if (!args.some((arg) => arg.includes('+'))) {
        return fail("Build the sentence with + between String variables — don't type it as one big text.")
      }
      return { passed: true }
    },
  },
  {
    id: 6,
    kind: 'code',
    title: 'Kroner to euro',
    lesson: [
      {
        kind: 'text',
        text: "During the break you meet a friend at ITU's own café, Cafe Analog. If you buy 5 coffee tickets in the Analog app, a cappuccino costs only 17 kr. Your friend says that is very cheap — but you want to see it in euro. This code converts the other way, from euro to kroner:",
      },
      {
        kind: 'code',
        code: `class Valuta {
    public static void main(String[] args) {
        int eur = 100;
        double dkk = eur * 7.45;
        System.out.println(eur + " euro corresponds to " + dkk + " kr.");
    }
}`,
      },
    ],
    description:
      'Modify the code so it converts the opposite way: from kroner to euro. For the 17 kr cappuccino, print: "17 dkk corresponds to 2.2818791946308725 euro." (All the decimals are fine — that is just how doubles print.)',
    hint: 'Divide instead of multiply: dkk / 7.45',
    starter: `class Valuta {
    public static void main(String[] args) {
        int eur = 100;
        double dkk = eur * 7.45;
        System.out.println(eur + " euro corresponds to " + dkk + " kr.");
    }
}
`,
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const normalized = normalizeOutput(output)
      if (!includesAll(normalized, ['17', 'corresponds to', 'euro'])) {
        return fail('Print the sentence for the 17 kr cappuccino: "17 dkk corresponds to … euro."')
      }
      if (!matches(normalized, /2\.28/)) {
        return fail('The euro amount looks off — divide the kroner by 7.45 (1 euro = 7.45 kr) and expect 2.28…')
      }
      const structure = stripCode(code)
      if (!/\/\s*7\.45/.test(structure)) {
        return fail('Convert by dividing by 7.45 — the opposite of multiplying.')
      }
      return { passed: true }
    },
  },
  {
    id: 7,
    kind: 'code',
    title: 'Functions',
    lesson: [
      {
        kind: 'text',
        text: 'Functions let us reuse code and give a snippet a clear responsibility. This does exactly the same as the previous exercise, wrapped in a function:',
      },
      {
        kind: 'code',
        code: `class Valuta {
    static void dkk2eur() {
        double dkk = 100;
        double eur = dkk / 7.45;
        System.out.println(dkk + " kr corresponds to " + eur + " euro");
    }

    public static void main(String[] args) {
        dkk2eur();
    }
}`,
      },
      {
        kind: 'text',
        text: 'But this function always converts 100 kr. With a parameter, the same function works for any value:',
      },
      {
        kind: 'code',
        code: `static void dkk2eur(double dkk) {
    double eur = dkk / 7.45;
    System.out.println(dkk + " kr corresponds to " + eur + " euro");
}

public static void main(String[] args) {
    dkk2eur(100);
    dkk2eur(17);
}`,
      },
    ],
    description:
      'Write a function that takes TWO parameters: a String item and an int price in dkk. It prints "A cup of {item} cost {price in euro} euros." Call it twice from main with different drinks — say a Cappuccino at 17 kr and a Matcha Latte at 20 kr.',
    hint: 'Two parameters need a comma: static void cafeEuroPrice(String item, int dkk) { … }',
    starter: `class Valuta {

    // Declare your function here

    public static void main(String[] args) {
        System.out.println("What would you like to order?");
        // cafeEuroPrice("Cappuccino", 17);
        System.out.println("Anything else?");
        // cafeEuroPrice("Matcha Latte", 20);
    }
}
`,
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const structure = stripCode(code)
      const declaration = structure.match(/static\s+void\s+(\w+)\s*\(\s*String\s+\w+\s*,\s*(?:int|double)\s+\w+\s*\)/)
      if (!declaration) {
        return fail('Declare a function with two parameters: static void cafeEuroPrice(String item, int dkk) { … }')
      }
      const calls = callArgs(code, declaration[1])
      if (calls.length < 2) return fail('Call your function at least twice from main.')
      if (new Set(calls).size < 2) {
        return fail('Call it with two different drinks — that is the whole point of parameters!')
      }
      const sentences = normalizeOutput(output).match(/A cup of .+? cost .+? euros\./g) ?? []
      if (sentences.length < 2) {
        return fail('Each call should print "A cup of {item} cost {price} euros." — expect two such sentences.')
      }
      return { passed: true }
    },
  },
  {
    id: 8,
    kind: 'code',
    title: 'Your semester in ECTS',
    lesson: [
      {
        kind: 'text',
        text: 'At ITU every course is worth ECTS points, and a full semester adds up to 30 ECTS — for example two 7.5 ECTS courses plus a 15 ECTS project. A function with several parameters can print any course the same way.',
      },
    ],
    description:
      'Write a function printCourse(String name, int ects, int semester) that prints "{name} ({ects} ECTS) is in semester {semester}." Call it from main for at least two courses of your new programme — e.g. printCourse("Software Design", 15, 1) and printCourse("Mobile App Development", 15, 2).',
    hint: 'Three parameters, two commas: static void printCourse(String name, int ects, int semester)',
    starter: `class StudyPlan {

    // Declare printCourse here

    public static void main(String[] args) {
        // Print at least two of your courses
    }
}
`,
    check({ code, output, exitCode }) {
      if (exitCode !== 0) return notRun
      const structure = stripCode(code)
      const declaration = structure.match(/static\s+void\s+(\w+)\s*\(\s*String\s+\w+\s*,\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/)
      if (!declaration) {
        return fail('Declare a function with three parameters: static void printCourse(String name, int ects, int semester) { … }')
      }
      const calls = callArgs(code, declaration[1])
      if (calls.length < 2) return fail('Call your function at least twice from main.')
      if (new Set(calls).size < 2) {
        return fail('Call it with two different courses — different names, points, or semesters.')
      }
      const sentences = normalizeOutput(output).match(/.+ \(\d+ ECTS\) is in semester \d+\./g) ?? []
      if (sentences.length < 2) {
        return fail('Each call should print "{name} ({ects} ECTS) is in semester {semester}." — expect two such lines.')
      }
      return { passed: true }
    },
  },

  // ─────────────────── DAY 2 — conditionals, loops, input ───────────────────
  {
    id: 9,
    kind: 'code',
    title: 'Is it daytime?',
    description:
      'Given an hour (0–23), print "Yes, it is daytime!" from 08:00 onward, otherwise "No, it is nighttime."',
    hint: 'Use if (time >= 8) { ... } else { ... }',
    starter: mainStarter('        int time = 14;\n        // Print daytime or nighttime'),
    check: ({ output, exitCode }) => ({ passed: exitCode === 0 && matches(output, /daytime|nighttime/i) }),
  },
  {
    id: 10,
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
    id: 11,
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
      ({ passed: exitCode === 0 && matches(stripCode(code), /boolean\s+even/) && matches(output, /is (not )?even/i) }),
  },
  {
    id: 12,
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
    id: 13,
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
    id: 14,
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
    check: ({ code, exitCode }) => {
      const structure = stripCode(code)
      return {
        passed:
          exitCode === 0 && matches(structure, /Scanner/) && matches(structure, /while/) && matches(structure, /nextInt/),
      }
    },
  },
  {
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
    kind: 'predict',
    title: 'For Loop Quiz 1',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 10; i > 0; i = i - 2) {
    System.out.println(i);
}`,
    expectedOutput: '10\n8\n6\n4\n2',
  },
  {
    id: 23,
    kind: 'predict',
    title: 'For Loop Quiz 2',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 1; i < 10; i = i + 3) {
    System.out.println(i);
}`,
    expectedOutput: '1\n4\n7',
  },
  {
    id: 24,
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
    id: 25,
    kind: 'predict',
    title: 'For Loop Quiz 4',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 0; i <= 15; i = i + 3) {
    System.out.println(i);
}`,
    expectedOutput: '0\n3\n6\n9\n12\n15',
  },
  {
    id: 26,
    kind: 'predict',
    title: 'For Loop Quiz 5',
    description: 'Read the loop and predict exactly what it prints.',
    snippet: `for (int i = 1; i <= 10000; i = i * 10) {
    System.out.println(i);
}`,
    expectedOutput: '1\n10\n100\n1000\n10000',
  },
  {
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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
