/**
 * Java completion provider for Monaco.
 *
 * Two providers, registered once per Monaco instance (repeated editor mounts
 * are a no-op, so suggestions never duplicate):
 *  1. Dot-trigger: fires on '.' and while typing the member. Resolves the
 *     receiver chain before the dot — declared variable types scanned out of
 *     the document first (`Scanner sc = …` → Scanner members), then static
 *     class names, then common-variable-name heuristics — and follows chained
 *     calls with known return types (`sb.append(x).` → StringBuilder,
 *     `sc.nextLine().` → String, `"abc".` → String).
 *  2. Word-trigger: snippet/class/keyword completions keyed by the current
 *     word prefix; after `new ` it offers class names only.
 * Both stay silent inside strings, chars and comments.
 */
import type { editor as MonacoEditor, languages, Position } from 'monaco-editor'
import { sanitizeJava } from './javaSource'

type Monaco = typeof import('monaco-editor')
/** A completion item before its `range` is attached at provide-time. */
type Suggestion = Omit<languages.CompletionItem, 'range'>
type Completions = (monaco: Monaco) => Suggestion[]

// ── helpers ──────────────────────────────────────────────────────────────────

function M(monaco: Monaco, label: string, insertText: string, detail?: string, doc?: string): Suggestion {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Method,
    detail: detail || '',
    documentation: doc ? { value: doc } : undefined,
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    sortText: '0' + label,
  }
}

function F(monaco: Monaco, label: string, insertText: string, detail?: string): Suggestion {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Field,
    detail: detail || '',
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    sortText: '0' + label,
  }
}

function S(monaco: Monaco, label: string, insertText: string, detail?: string): Suggestion {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Snippet,
    detail: detail || '',
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    sortText: '2' + label,
  }
}

// Plain-identifier completions: a class name (no snippet expansion). Ranked
// above snippets so typing "Sy" surfaces `System` first.
function C(monaco: Monaco, label: string, detail?: string): Suggestion {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Class,
    detail: detail || 'class',
    insertText: label,
    sortText: '1' + label,
  }
}

// A language keyword / literal.
function K(monaco: Monaco, label: string): Suggestion {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: label,
    sortText: '3' + label,
  }
}

// ── completion tables ─────────────────────────────────────────────────────────

function systemCompletions(m: Monaco): Suggestion[] {
  return [
    F(m, 'out',                  'out',                                                   'PrintStream System.out'),
    F(m, 'err',                  'err',                                                   'PrintStream System.err'),
    F(m, 'in',                   'in',                                                    'InputStream System.in'),
    M(m, 'exit()',               'exit(${1:0})',                                           'void exit(int status)'),
    M(m, 'currentTimeMillis()',  'currentTimeMillis()',                                    'long currentTimeMillis()'),
    M(m, 'nanoTime()',           'nanoTime()',                                             'long nanoTime()'),
    M(m, 'arraycopy()',          'arraycopy(${1:src}, ${2:srcPos}, ${3:dest}, ${4:destPos}, ${5:length})', 'void arraycopy(...)'),
    M(m, 'lineSeparator()',      'lineSeparator()',                                        'String lineSeparator()'),
    M(m, 'getenv()',             'getenv("${1:VAR}")',                                     'String getenv(String)'),
    M(m, 'getProperty()',        'getProperty("${1:key}")',                                'String getProperty(String)'),
  ]
}

function systemOutCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'println()',   'println(${1})',                      'void println(Object)'),
    M(m, 'print()',     'print(${1})',                        'void print(Object)'),
    M(m, 'printf()',    'printf("${1:%s}", ${2})',            'PrintStream printf(String, Object...)'),
    M(m, 'format()',    'format("${1:%s}", ${2})',            'PrintStream format(String, Object...)'),
    M(m, 'flush()',     'flush()',                            'void flush()'),
    M(m, 'close()',     'close()',                            'void close()'),
  ]
}

function systemErrCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'println()',   'println(${1})',                      'void println(Object) - stderr'),
    M(m, 'print()',     'print(${1})',                        'void print(Object) - stderr'),
    M(m, 'printf()',    'printf("${1:%s}", ${2})',            'PrintStream printf(String, Object...)'),
    M(m, 'flush()',     'flush()',                            'void flush()'),
  ]
}

function mathCompletions(m: Monaco): Suggestion[] {
  return [
    F(m, 'PI',           'PI',                                'double Math.PI ≈ 3.14159'),
    F(m, 'E',            'E',                                 'double Math.E ≈ 2.71828'),
    M(m, 'abs()',        'abs(${1:x})',                       'T abs(T a)'),
    M(m, 'sqrt()',       'sqrt(${1:x})',                      'double sqrt(double a)'),
    M(m, 'pow()',        'pow(${1:base}, ${2:exp})',          'double pow(double, double)'),
    M(m, 'max()',        'max(${1:a}, ${2:b})',               'T max(T a, T b)'),
    M(m, 'min()',        'min(${1:a}, ${2:b})',               'T min(T a, T b)'),
    M(m, 'floor()',      'floor(${1:x})',                     'double floor(double a)'),
    M(m, 'ceil()',       'ceil(${1:x})',                      'double ceil(double a)'),
    M(m, 'round()',      'round(${1:x})',                     'long round(double a)'),
    M(m, 'random()',     'random()',                          'double random() — [0.0, 1.0)'),
    M(m, 'log()',        'log(${1:x})',                       'double log(double a)'),
    M(m, 'log10()',      'log10(${1:x})',                     'double log10(double a)'),
    M(m, 'sin()',        'sin(${1:x})',                       'double sin(double a)'),
    M(m, 'cos()',        'cos(${1:x})',                       'double cos(double a)'),
    M(m, 'tan()',        'tan(${1:x})',                       'double tan(double a)'),
    M(m, 'toRadians()',  'toRadians(${1:deg})',               'double toRadians(double)'),
    M(m, 'toDegrees()',  'toDegrees(${1:rad})',               'double toDegrees(double)'),
    M(m, 'hypot()',      'hypot(${1:x}, ${2:y})',             'double hypot(double, double)'),
  ]
}

function arraysCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'sort()',           'sort(${1:array})',                              'void sort(T[])'),
    M(m, 'binarySearch()',   'binarySearch(${1:array}, ${2:key})',            'int binarySearch(T[], T)'),
    M(m, 'copyOf()',         'copyOf(${1:original}, ${2:newLength})',         'T[] copyOf(T[], int)'),
    M(m, 'copyOfRange()',    'copyOfRange(${1:original}, ${2:from}, ${3:to})','T[] copyOfRange(T[], int, int)'),
    M(m, 'fill()',           'fill(${1:array}, ${2:val})',                    'void fill(T[], T)'),
    M(m, 'toString()',       'toString(${1:array})',                          'String toString(T[])'),
    M(m, 'deepToString()',   'deepToString(${1:array})',                      'String deepToString(Object[])'),
    M(m, 'equals()',         'equals(${1:a}, ${2:b})',                        'boolean equals(T[], T[])'),
    M(m, 'asList()',         'asList(${1:elements})',                         'List<T> asList(T...)'),
    M(m, 'stream()',         'stream(${1:array})',                            'Stream<T> stream(T[])'),
  ]
}

function collectionsCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'sort()',              'sort(${1:list})',                     'void sort(List)'),
    M(m, 'reverse()',           'reverse(${1:list})',                  'void reverse(List)'),
    M(m, 'shuffle()',           'shuffle(${1:list})',                  'void shuffle(List)'),
    M(m, 'min()',               'min(${1:collection})',                'T min(Collection)'),
    M(m, 'max()',               'max(${1:collection})',                'T max(Collection)'),
    M(m, 'frequency()',         'frequency(${1:c}, ${2:o})',           'int frequency(Collection, Object)'),
    M(m, 'nCopies()',           'nCopies(${1:n}, ${2:o})',             'List<T> nCopies(int, T)'),
    M(m, 'unmodifiableList()',  'unmodifiableList(${1:list})',         'List<T> unmodifiableList(List)'),
    M(m, 'singletonList()',     'singletonList(${1:o})',               'List<T> singletonList(T)'),
    M(m, 'emptyList()',         'emptyList()',                         'List<T> emptyList()'),
  ]
}

function stringStaticCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'valueOf()',    'valueOf(${1:obj})',                    'static String valueOf(Object)'),
    M(m, 'format()',     'format("${1:%s}", ${2:args})',         'static String format(String, Object...)'),
    M(m, 'join()',       'join("${1:delim}", ${2:elements})',    'static String join(CharSequence, CharSequence...)'),
  ]
}

function stringInstanceCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'length()',          'length()',                                'int length()'),
    M(m, 'charAt()',          'charAt(${1:index})',                      'char charAt(int)'),
    M(m, 'substring()',       'substring(${1:begin}, ${2:end})',         'String substring(int, int)'),
    M(m, 'indexOf()',         'indexOf("${1:str}")',                     'int indexOf(String)'),
    M(m, 'lastIndexOf()',     'lastIndexOf("${1:str}")',                 'int lastIndexOf(String)'),
    M(m, 'contains()',        'contains("${1:str}")',                    'boolean contains(CharSequence)'),
    M(m, 'startsWith()',      'startsWith("${1:prefix}")',               'boolean startsWith(String)'),
    M(m, 'endsWith()',        'endsWith("${1:suffix}")',                 'boolean endsWith(String)'),
    M(m, 'equals()',          'equals(${1:other})',                      'boolean equals(Object)'),
    M(m, 'equalsIgnoreCase()','equalsIgnoreCase("${1:str}")',            'boolean equalsIgnoreCase(String)'),
    M(m, 'compareTo()',       'compareTo("${1:str}")',                   'int compareTo(String)'),
    M(m, 'toUpperCase()',     'toUpperCase()',                           'String toUpperCase()'),
    M(m, 'toLowerCase()',     'toLowerCase()',                           'String toLowerCase()'),
    M(m, 'trim()',            'trim()',                                  'String trim()'),
    M(m, 'strip()',           'strip()',                                 'String strip()'),
    M(m, 'replace()',         'replace("${1:old}", "${2:new}")',         'String replace(CharSequence, CharSequence)'),
    M(m, 'replaceAll()',      'replaceAll("${1:regex}", "${2:repl}")',   'String replaceAll(String, String)'),
    M(m, 'split()',           'split("${1:regex}")',                     'String[] split(String)'),
    M(m, 'isEmpty()',         'isEmpty()',                               'boolean isEmpty()'),
    M(m, 'isBlank()',         'isBlank()',                               'boolean isBlank()'),
    M(m, 'toCharArray()',     'toCharArray()',                           'char[] toCharArray()'),
    M(m, 'intern()',          'intern()',                                'String intern()'),
    M(m, 'repeat()',          'repeat(${1:count})',                      'String repeat(int)'),
    M(m, 'chars()',           'chars()',                                 'IntStream chars()'),
  ]
}

function integerCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'parseInt()',       'parseInt(${1:s})',                    'static int parseInt(String)'),
    M(m, 'valueOf()',        'valueOf(${1:i})',                     'static Integer valueOf(int)'),
    M(m, 'toString()',       'toString(${1:i})',                    'static String toString(int)'),
    M(m, 'toBinaryString()', 'toBinaryString(${1:i})',             'static String toBinaryString(int)'),
    M(m, 'toHexString()',    'toHexString(${1:i})',                'static String toHexString(int)'),
    M(m, 'toOctalString()',  'toOctalString(${1:i})',              'static String toOctalString(int)'),
    M(m, 'max()',            'max(${1:a}, ${2:b})',                'static int max(int, int)'),
    M(m, 'min()',            'min(${1:a}, ${2:b})',                'static int min(int, int)'),
    M(m, 'compare()',        'compare(${1:x}, ${2:y})',            'static int compare(int, int)'),
    M(m, 'bitCount()',       'bitCount(${1:i})',                   'static int bitCount(int)'),
    F(m, 'MAX_VALUE',        'MAX_VALUE',                          'int 2147483647'),
    F(m, 'MIN_VALUE',        'MIN_VALUE',                          'int -2147483648'),
  ]
}

function doubleCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'parseDouble()',    'parseDouble(${1:s})',                'static double parseDouble(String)'),
    M(m, 'valueOf()',        'valueOf(${1:d})',                    'static Double valueOf(double)'),
    M(m, 'toString()',       'toString(${1:d})',                   'static String toString(double)'),
    M(m, 'isNaN()',          'isNaN(${1:v})',                      'static boolean isNaN(double)'),
    M(m, 'isInfinite()',     'isInfinite(${1:v})',                 'static boolean isInfinite(double)'),
    F(m, 'MAX_VALUE',        'MAX_VALUE',                          'double MAX_VALUE'),
    F(m, 'MIN_VALUE',        'MIN_VALUE',                          'double MIN_VALUE'),
    F(m, 'NaN',              'NaN',                                'double NaN'),
    F(m, 'POSITIVE_INFINITY','POSITIVE_INFINITY',                  'double +∞'),
    F(m, 'NEGATIVE_INFINITY','NEGATIVE_INFINITY',                  'double -∞'),
  ]
}

function listCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'add()',        'add(${1:element})',              'boolean add(E)'),
    M(m, 'add(i,e)',     'add(${1:index}, ${2:element})', 'void add(int, E)'),
    M(m, 'get()',        'get(${1:index})',               'E get(int)'),
    M(m, 'set()',        'set(${1:index}, ${2:element})', 'E set(int, E)'),
    M(m, 'remove()',     'remove(${1:index})',            'E remove(int)'),
    M(m, 'size()',       'size()',                        'int size()'),
    M(m, 'isEmpty()',    'isEmpty()',                     'boolean isEmpty()'),
    M(m, 'contains()',   'contains(${1:o})',              'boolean contains(Object)'),
    M(m, 'indexOf()',    'indexOf(${1:o})',               'int indexOf(Object)'),
    M(m, 'clear()',      'clear()',                       'void clear()'),
    M(m, 'sort()',       'sort(null)',                    'void sort(Comparator)'),
    M(m, 'iterator()',   'iterator()',                    'Iterator<E> iterator()'),
    M(m, 'toArray()',    'toArray()',                     'Object[] toArray()'),
    M(m, 'subList()',    'subList(${1:from}, ${2:to})',   'List<E> subList(int, int)'),
    M(m, 'stream()',     'stream()',                      'Stream<E> stream()'),
    M(m, 'forEach()',    'forEach(${1:item} -> {\n\t$2\n})', 'void forEach(Consumer)'),
  ]
}

function setCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'add()',        'add(${1:element})',             'boolean add(E)'),
    M(m, 'remove()',     'remove(${1:element})',          'boolean remove(Object)'),
    M(m, 'contains()',   'contains(${1:o})',              'boolean contains(Object)'),
    M(m, 'size()',       'size()',                        'int size()'),
    M(m, 'isEmpty()',    'isEmpty()',                     'boolean isEmpty()'),
    M(m, 'clear()',      'clear()',                       'void clear()'),
    M(m, 'iterator()',   'iterator()',                    'Iterator<E> iterator()'),
    M(m, 'stream()',     'stream()',                      'Stream<E> stream()'),
    M(m, 'forEach()',    'forEach(${1:item} -> {\n\t$2\n})', 'void forEach(Consumer)'),
  ]
}

function mapCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'put()',             'put(${1:key}, ${2:value})',         'V put(K, V)'),
    M(m, 'get()',             'get(${1:key})',                     'V get(Object)'),
    M(m, 'remove()',          'remove(${1:key})',                  'V remove(Object)'),
    M(m, 'containsKey()',     'containsKey(${1:key})',             'boolean containsKey(Object)'),
    M(m, 'containsValue()',   'containsValue(${1:value})',         'boolean containsValue(Object)'),
    M(m, 'size()',            'size()',                            'int size()'),
    M(m, 'isEmpty()',         'isEmpty()',                         'boolean isEmpty()'),
    M(m, 'clear()',           'clear()',                           'void clear()'),
    M(m, 'keySet()',          'keySet()',                          'Set<K> keySet()'),
    M(m, 'values()',          'values()',                          'Collection<V> values()'),
    M(m, 'entrySet()',        'entrySet()',                        'Set<Map.Entry<K,V>> entrySet()'),
    M(m, 'getOrDefault()',    'getOrDefault(${1:key}, ${2:def})', 'V getOrDefault(Object, V)'),
    M(m, 'putIfAbsent()',     'putIfAbsent(${1:key}, ${2:val})',  'V putIfAbsent(K, V)'),
    M(m, 'forEach()',         'forEach((${1:k}, ${2:v}) -> {\n\t$3\n})', 'void forEach(BiConsumer)'),
    M(m, 'merge()',           'merge(${1:key}, ${2:val}, (${3:a}, ${4:b}) -> ${5:a})', 'V merge(K, V, BiFunction)'),
  ]
}

function stackQueueCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'push()',    'push(${1:item})',   'void push(E)'),
    M(m, 'pop()',     'pop()',             'E pop()'),
    M(m, 'peek()',    'peek()',            'E peek()'),
    M(m, 'isEmpty()', 'isEmpty()',         'boolean isEmpty()'),
    M(m, 'size()',    'size()',            'int size()'),
    M(m, 'offer()',   'offer(${1:item})',  'boolean offer(E)'),
    M(m, 'poll()',    'poll()',            'E poll()'),
    M(m, 'contains()','contains(${1:o})', 'boolean contains(Object)'),
  ]
}

function sbCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'append()',     'append(${1:str})',              'StringBuilder append(Object)'),
    M(m, 'insert()',     'insert(${1:offset}, ${2:str})', 'StringBuilder insert(int, Object)'),
    M(m, 'delete()',     'delete(${1:start}, ${2:end})',  'StringBuilder delete(int, int)'),
    M(m, 'replace()',    'replace(${1:start}, ${2:end}, "${3:str}")', 'StringBuilder replace(int, int, String)'),
    M(m, 'reverse()',    'reverse()',                     'StringBuilder reverse()'),
    M(m, 'toString()',   'toString()',                    'String toString()'),
    M(m, 'length()',     'length()',                      'int length()'),
    M(m, 'charAt()',     'charAt(${1:index})',            'char charAt(int)'),
    M(m, 'indexOf()',    'indexOf("${1:str}")',           'int indexOf(String)'),
    M(m, 'deleteCharAt()','deleteCharAt(${1:index})',    'StringBuilder deleteCharAt(int)'),
    M(m, 'setCharAt()',  'setCharAt(${1:index}, ${2:ch})','void setCharAt(int, char)'),
  ]
}

function scannerCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'nextInt()',     'nextInt()',      'int nextInt()'),
    M(m, 'nextDouble()',  'nextDouble()',   'double nextDouble()'),
    M(m, 'nextLong()',    'nextLong()',     'long nextLong()'),
    M(m, 'next()',        'next()',         'String next()'),
    M(m, 'nextLine()',    'nextLine()',     'String nextLine()'),
    M(m, 'hasNext()',     'hasNext()',      'boolean hasNext()'),
    M(m, 'hasNextInt()',  'hasNextInt()',   'boolean hasNextInt()'),
    M(m, 'close()',       'close()',        'void close()'),
  ]
}

function arrayCompletions(m: Monaco): Suggestion[] {
  return [
    F(m, 'length',   'length',   'int — number of elements'),
    M(m, 'clone()',  'clone()',  'T[] clone()'),
  ]
}

function exceptionCompletions(m: Monaco): Suggestion[] {
  return [
    M(m, 'getMessage()',       'getMessage()',       'String getMessage()'),
    M(m, 'printStackTrace()',  'printStackTrace()',  'void printStackTrace()'),
    M(m, 'toString()',         'toString()',         'String toString()'),
  ]
}

// ── chain resolution ──────────────────────────────────────────────────────────

type TableKey =
  | 'system' | 'systemOut' | 'systemErr'
  | 'math' | 'arrays' | 'collections' | 'stringStatic' | 'integer' | 'double'
  | 'string' | 'list' | 'set' | 'map' | 'stackQueue' | 'sb' | 'scanner'
  | 'array' | 'exception'

const TABLES: Record<TableKey, Completions> = {
  system:       systemCompletions,
  systemOut:    systemOutCompletions,
  systemErr:    systemErrCompletions,
  math:         mathCompletions,
  arrays:       arraysCompletions,
  collections:  collectionsCompletions,
  stringStatic: stringStaticCompletions,
  integer:      integerCompletions,
  double:       doubleCompletions,
  string:       stringInstanceCompletions,
  list:         listCompletions,
  set:          setCompletions,
  map:          mapCompletions,
  stackQueue:   stackQueueCompletions,
  sb:           sbCompletions,
  scanner:      scannerCompletions,
  array:        arrayCompletions,
  exception:    exceptionCompletions,
}

// Static classes, matched by exact (case-sensitive) name.
const STATIC_CHAINS: Record<string, TableKey> = {
  'System':      'system',
  'System.out':  'systemOut',
  'System.err':  'systemErr',
  'Math':        'math',
  'Arrays':      'arrays',
  'Collections': 'collections',
  'String':      'stringStatic',
  'Integer':     'integer',
  'Double':      'double',
}

// Declared Java type → member table. A declared type that isn't listed here
// (a student's own class, a primitive) deliberately resolves to nothing —
// wrong suggestions are worse than none.
const DECLARED_TYPE_TO_KEY: Record<string, TableKey> = {
  String:            'string',
  StringBuilder:     'sb',
  Scanner:           'scanner',
  ArrayList:         'list',
  LinkedList:        'list',
  List:              'list',
  HashMap:           'map',
  TreeMap:           'map',
  LinkedHashMap:     'map',
  Map:               'map',
  HashSet:           'set',
  TreeSet:           'set',
  LinkedHashSet:     'set',
  Set:               'set',
  Stack:             'stackQueue',
  Queue:             'stackQueue',
  Deque:             'stackQueue',
  ArrayDeque:        'stackQueue',
  PriorityQueue:     'stackQueue',
  Exception:         'exception',
  RuntimeException:  'exception',
}

// Fallback when a variable has no discoverable declaration: guess the type
// from names beginners typically use (lowercased).
const NAME_HEURISTICS: Record<string, TableKey> = {
  string:         'string',
  str:            'string',
  s:              'string',
  name:           'string',
  word:           'string',
  text:           'string',
  line:           'string',
  input:          'string',
  result:         'string',
  output:         'string',
  list:           'list',
  arraylist:      'list',
  al:             'list',
  arr:            'list',
  nums:           'list',
  items:          'list',
  set:            'set',
  hashset:        'set',
  hs:             'set',
  map:            'map',
  hashmap:        'map',
  hm:             'map',
  treemap:        'map',
  tm:             'map',
  linkedhashmap:  'map',
  stack:          'stackQueue',
  queue:          'stackQueue',
  deque:          'stackQueue',
  pq:             'stackQueue',
  sb:             'sb',
  builder:        'sb',
  stringbuilder:  'sb',
  scanner:        'scanner',
  sc:             'scanner',
  scn:            'scanner',
  e:              'exception',
  ex:             'exception',
}

// Per-receiver members whose result type we know, so chains keep resolving:
// `sb.append(x).` → sb, `sc.nextLine().` → string. Keys ending in '()' are
// calls; bare keys are fields.
const MEMBER_RETURNS: Partial<Record<TableKey, Record<string, TableKey>>> = {
  system: { out: 'systemOut', err: 'systemErr' },
  string: {
    'toUpperCase()': 'string', 'toLowerCase()': 'string', 'trim()': 'string',
    'strip()': 'string', 'substring()': 'string', 'replace()': 'string',
    'replaceAll()': 'string', 'concat()': 'string', 'repeat()': 'string',
    'intern()': 'string', 'split()': 'array', 'toCharArray()': 'array',
  },
  sb: {
    'append()': 'sb', 'insert()': 'sb', 'delete()': 'sb',
    'deleteCharAt()': 'sb', 'replace()': 'sb', 'reverse()': 'sb',
  },
  scanner:      { 'next()': 'string', 'nextLine()': 'string' },
  map:          { 'keySet()': 'set', 'entrySet()': 'set' },
  list:         { 'subList()': 'list' },
  stringStatic: { 'valueOf()': 'string', 'format()': 'string', 'join()': 'string' },
  integer:      { 'toBinaryString()': 'string', 'toHexString()': 'string', 'toOctalString()': 'string' },
  arrays:       { 'deepToString()': 'string', 'asList()': 'list', 'copyOf()': 'array', 'copyOfRange()': 'array' },
  exception:    { 'getMessage()': 'string' },
}

// A chain typed at the start of a line continues the statement above
// (`.append(x).`) — resolve unambiguous method names without a receiver.
const BARE_CALL_RETURNS: Record<string, TableKey> = {
  'append()':      'sb',
  'insert()':      'sb',
  'reverse()':     'sb',
  'toString()':    'string',
  'trim()':        'string',
  'strip()':       'string',
  'substring()':   'string',
  'toUpperCase()': 'string',
  'toLowerCase()': 'string',
  'next()':        'string',
  'nextLine()':    'string',
}

function resolveBaseSegment(segment: string, varTypes: Record<string, string>): TableKey | null {
  if (segment.endsWith('()')) return BARE_CALL_RETURNS[segment] ?? null
  const declaredType = varTypes[segment]
  if (declaredType) {
    if (declaredType.endsWith('[]')) return 'array'
    return DECLARED_TYPE_TO_KEY[declaredType] ?? null
  }
  return STATIC_CHAINS[segment] ?? NAME_HEURISTICS[segment.toLowerCase()] ?? null
}

function resolveMemberSegment(receiver: TableKey, segment: string): TableKey | null {
  const members = MEMBER_RETURNS[receiver]
  const known = members ? members[segment] : undefined
  if (known) return known
  if (segment === 'toString()') return 'string'
  return null
}

/**
 * Resolve a receiver chain ("sc", "System.out", "sb.append(x)") to a member
 * table. Exported for unit tests.
 */
export function resolveChainKey(chain: string, varTypes: Record<string, string>): TableKey | null {
  const exact = STATIC_CHAINS[chain]
  if (exact) return exact

  // Normalize call arguments away so segments are `name` or `name()`.
  const segments = chain.replace(/\([^()]*\)/g, '()').split('.').map((seg) => seg.trim())
  if (!segments[0]) return null

  let key = resolveBaseSegment(segments[0], varTypes)
  for (let i = 1; i < segments.length && key !== null; i++) {
    key = resolveMemberSegment(key, segments[i])
  }
  return key
}

// ── variable type inference ───────────────────────────────────────────────────

// `Scanner sc`, `ArrayList<Integer> nums`, `String[] parts`, `String w :` …
const DECLARATION_RE = /\b(?:final\s+)?([A-Z][\w$]*)\s*(?:<[^<>]*(?:<[^<>]*>[^<>]*)*>)?\s*(\[\s*\])?\s+([a-z_$][\w$]*)\s*(?=[=;,):])/g
// `int count`, `double[] values` …
const PRIMITIVE_RE = /\b(int|long|double|float|boolean|char|short|byte)\s*(\[\s*\])?\s+([a-z_$][\w$]*)/g
// `x = new Scanner(...)` — also covers `var x = new ...`.
const NEW_ASSIGNMENT_RE = /\b([a-z_$][\w$]*)\s*=\s*new\s+([A-Z][\w$]*)/g

/**
 * Scan the document (comments/strings blanked first) for variable
 * declarations and build a var-name → declared-type map. Declarations win
 * over `new` assignments. Exported for unit tests.
 */
export function inferVariableTypes(code: string): Record<string, string> {
  const text = sanitizeJava(code).lines.join('\n')
  const types: Record<string, string> = {}
  for (const match of text.matchAll(NEW_ASSIGNMENT_RE)) {
    types[match[1]] = match[2]
  }
  for (const match of text.matchAll(PRIMITIVE_RE)) {
    types[match[3]] = match[1] + (match[2] ? '[]' : '')
  }
  for (const match of text.matchAll(DECLARATION_RE)) {
    types[match[3]] = match[1] + (match[2] ? '[]' : '')
  }
  return types
}

// ── top-level snippets ────────────────────────────────────────────────────────

function getSnippets(monaco: Monaco): Suggestion[] {
  return [
    S(monaco, 'sout',        'System.out.println(${1});',                                         'System.out.println()'),
    S(monaco, 'serr',        'System.err.println(${1});',                                         'System.err.println()'),
    S(monaco, 'psvm',        'public static void main(String[] args) {\n\t$1\n}',                 'main method'),
    S(monaco, 'fori',        'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t$3\n}',      'for loop'),
    S(monaco, 'foreach',     'for (${1:var} ${2:item} : ${3:collection}) {\n\t$4\n}',             'enhanced for'),
    S(monaco, 'while',       'while (${1:condition}) {\n\t$2\n}',                                 'while loop'),
    S(monaco, 'try',         'try {\n\t$1\n} catch (${2:Exception} ${3:e}) {\n\t$4\n}',          'try-catch'),
    S(monaco, 'tern',        '(${1:condition}) ? ${2:a} : ${3:b}',                               'ternary'),
    S(monaco, 'Scanner',     'Scanner ${1:sc} = new Scanner(System.in);',                        'new Scanner'),
    S(monaco, 'ArrayList',   'ArrayList<${1:Integer}> ${2:list} = new ArrayList<>();',            'new ArrayList'),
    S(monaco, 'HashMap',     'HashMap<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();',   'new HashMap'),
    S(monaco, 'StringBuilder','StringBuilder ${1:sb} = new StringBuilder();',                    'new StringBuilder'),
    S(monaco, 'lambda',      '(${1:x}) -> ${2:x}',                                               'lambda'),
    S(monaco, 'syso',        'System.out.println(${1});',                                         'System.out.println()'),
  ]
}

// ── identifiers: classes + keywords (offered as you type a word) ───────────────

const COMMON_CLASSES: [string, string][] = [
  ['System', 'class java.lang.System'],
  ['String', 'class java.lang.String'],
  ['Math', 'class java.lang.Math'],
  ['Integer', 'class java.lang.Integer'],
  ['Double', 'class java.lang.Double'],
  ['Boolean', 'class java.lang.Boolean'],
  ['Long', 'class java.lang.Long'],
  ['Character', 'class java.lang.Character'],
  ['Object', 'class java.lang.Object'],
  ['Scanner', 'class java.util.Scanner'],
  ['StringBuilder', 'class java.lang.StringBuilder'],
  ['Arrays', 'class java.util.Arrays'],
  ['Collections', 'class java.util.Collections'],
  ['List', 'interface java.util.List'],
  ['ArrayList', 'class java.util.ArrayList'],
  ['Map', 'interface java.util.Map'],
  ['HashMap', 'class java.util.HashMap'],
  ['Set', 'interface java.util.Set'],
  ['HashSet', 'class java.util.HashSet'],
  ['Exception', 'class java.lang.Exception'],
]

const JAVA_KEYWORDS = [
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
  'class', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends',
  'final', 'finally', 'float', 'for', 'if', 'implements', 'import',
  'instanceof', 'int', 'interface', 'long', 'new', 'package', 'private',
  'protected', 'public', 'return', 'short', 'static', 'super', 'switch',
  'synchronized', 'this', 'throw', 'throws', 'try', 'void', 'while', 'var',
  'true', 'false', 'null',
]

// Word-completion items are identical on every keystroke — build once per
// Monaco instance instead of ~90 objects per provide call.
interface WordCompletionCache {
  monaco: Monaco
  classes: Suggestion[]
  words: Suggestion[]
}

let wordCache: WordCompletionCache | null = null

function getWordCache(monaco: Monaco): WordCompletionCache {
  if (wordCache === null || wordCache.monaco !== monaco) {
    const classes = COMMON_CLASSES.map(([name, detail]) => C(monaco, name, detail))
    wordCache = {
      monaco,
      classes,
      words: [
        ...classes,
        ...JAVA_KEYWORDS.map((kw) => K(monaco, kw)),
        ...getSnippets(monaco),
      ],
    }
  }
  return wordCache
}

// ── registration ─────────────────────────────────────────────────────────────

// Receiver chain incl. call segments: "sc", "System.out", "sb.append(x)".
const CHAIN_RE = /([A-Za-z_$][\w$]*(?:\([^()]*\))?(?:\.[A-Za-z_$][\w$]*(?:\([^()]*\))?)*)\.(\w*)$/
// A string literal as receiver: `"abc".le` → String members.
const STRING_RECEIVER_RE = /"\s*\.(\w*)$/

function textBeforeCursor(model: MonacoEditor.ITextModel, position: Position): string {
  return model.getValueInRange({
    startLineNumber: 1,
    startColumn:     1,
    endLineNumber:   position.lineNumber,
    endColumn:       position.column,
  })
}

// The cursor sits in real code — not inside a string, char or comment.
function isCodeContext(model: MonacoEditor.ITextModel, position: Position): boolean {
  return sanitizeJava(textBeforeCursor(model, position)).endState === 'code'
}

const registeredInstances = new WeakSet<object>()

export function registerJavaCompletions(monaco: Monaco): void {
  // The editor remounts per file/mode (React `key`), but providers are global
  // to the Monaco instance — registering again would duplicate every item.
  if (registeredInstances.has(monaco)) return
  registeredInstances.add(monaco)

  // ── Provider 1: member completions (after '.', and while typing the member) ──
  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.'],

    provideCompletionItems(model, position) {
      if (!isCodeContext(model, position)) return { suggestions: [] }

      // Text on the line up to the cursor. Match a chain followed by a dot and
      // the (possibly partial) member being typed: "System.", "System.out",
      // "sb.app", "sc.nextLine().le" — so members keep showing as you type,
      // not just the instant you press '.'.
      const lineUntil = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn:     1,
        endLineNumber:   position.lineNumber,
        endColumn:       position.column,
      })

      let key: TableKey | null = null
      let partial = ''
      const chainMatch = lineUntil.match(CHAIN_RE)
      if (chainMatch) {
        key = resolveChainKey(chainMatch[1], inferVariableTypes(model.getValue()))
        partial = chainMatch[2]
      } else {
        const literalMatch = lineUntil.match(STRING_RECEIVER_RE)
        if (literalMatch) {
          key = 'string'
          partial = literalMatch[1]
        }
      }
      if (!key) return { suggestions: [] }

      // Replace the partial member word (if any) so filtering works correctly.
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     position.column - partial.length,
        endColumn:       position.column,
      }

      return { suggestions: TABLES[key](monaco).map((s) => ({ ...s, range })) }
    },
  })

  // ── Provider 2: word completions (classes, keywords, snippets) ──
  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: [],

    provideCompletionItems(model, position) {
      if (!isCodeContext(model, position)) return { suggestions: [] }

      const word = model.getWordUntilPosition(position)

      // If we're in member position (right after a '.'), let Provider 1 handle
      // it — don't pollute the member list with global keywords/snippets.
      const beforeWord = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn:     1,
        endLineNumber:   position.lineNumber,
        endColumn:       word.startColumn,
      })
      if (/\.\s*$/.test(beforeWord)) return { suggestions: [] }

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      }

      // After `new `, only a constructor call makes sense — offer classes only.
      const cache = getWordCache(monaco)
      const items = /\bnew\s+$/.test(beforeWord) ? cache.classes : cache.words
      return { suggestions: items.map((s) => ({ ...s, range })) }
    },
  })
}
