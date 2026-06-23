/**
 * Java completion provider for Monaco.
 *
 * Two providers:
 *  1. Dot-trigger: fires on '.' — extracts the chain before the dot and
 *     returns method/field completions for known types.
 *  2. Word-trigger: fires on every keystroke — returns snippet completions
 *     (sout, psvm, fori, etc.) keyed by the current word prefix.
 */

// ── helpers ──────────────────────────────────────────────────────────────────

function M(monaco, label, insertText, detail, doc) {
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

function F(monaco, label, insertText, detail) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Field,
    detail: detail || '',
    insertText,
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    sortText: '0' + label,
  }
}

function S(monaco, label, insertText, detail) {
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
function C(monaco, label, detail) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Class,
    detail: detail || 'class',
    insertText: label,
    sortText: '1' + label,
  }
}

// A language keyword / literal.
function K(monaco, label) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: label,
    sortText: '3' + label,
  }
}

// ── completion tables ─────────────────────────────────────────────────────────

function systemCompletions(m) {
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

function systemOutCompletions(m) {
  return [
    M(m, 'println()',   'println(${1})',                      'void println(Object)'),
    M(m, 'print()',     'print(${1})',                        'void print(Object)'),
    M(m, 'printf()',    'printf("${1:%s}", ${2})',            'PrintStream printf(String, Object...)'),
    M(m, 'format()',    'format("${1:%s}", ${2})',            'PrintStream format(String, Object...)'),
    M(m, 'flush()',     'flush()',                            'void flush()'),
    M(m, 'close()',     'close()',                            'void close()'),
  ]
}

function systemErrCompletions(m) {
  return [
    M(m, 'println()',   'println(${1})',                      'void println(Object) - stderr'),
    M(m, 'print()',     'print(${1})',                        'void print(Object) - stderr'),
    M(m, 'printf()',    'printf("${1:%s}", ${2})',            'PrintStream printf(String, Object...)'),
    M(m, 'flush()',     'flush()',                            'void flush()'),
  ]
}

function mathCompletions(m) {
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

function arraysCompletions(m) {
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

function collectionsCompletions(m) {
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

function stringStaticCompletions(m) {
  return [
    M(m, 'valueOf()',    'valueOf(${1:obj})',                    'static String valueOf(Object)'),
    M(m, 'format()',     'format("${1:%s}", ${2:args})',         'static String format(String, Object...)'),
    M(m, 'join()',       'join("${1:delim}", ${2:elements})',    'static String join(CharSequence, CharSequence...)'),
  ]
}

function stringInstanceCompletions(m) {
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

function integerCompletions(m) {
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

function doubleCompletions(m) {
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

function listCompletions(m) {
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

function mapCompletions(m) {
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

function stackQueueCompletions(m) {
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

function sbCompletions(m) {
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

function scannerCompletions(m) {
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

// ── chain → completions map ───────────────────────────────────────────────────

const CHAIN_MAP = {
  // Static classes
  'System':         systemCompletions,
  'System.out':     systemOutCompletions,
  'System.err':     systemErrCompletions,
  'Math':           mathCompletions,
  'Arrays':         arraysCompletions,
  'Collections':    collectionsCompletions,
  'String':         stringStaticCompletions,
  'Integer':        integerCompletions,
  'Double':         doubleCompletions,
  // Instance heuristics (lowercase match)
  'string':         stringInstanceCompletions,
  'str':            stringInstanceCompletions,
  's':              stringInstanceCompletions,
  'name':           stringInstanceCompletions,
  'word':           stringInstanceCompletions,
  'text':           stringInstanceCompletions,
  'line':           stringInstanceCompletions,
  'input':          stringInstanceCompletions,
  'result':         stringInstanceCompletions,
  'output':         stringInstanceCompletions,
  'list':           listCompletions,
  'arraylist':      listCompletions,
  'al':             listCompletions,
  'arr':            listCompletions,
  'nums':           listCompletions,
  'map':            mapCompletions,
  'hashmap':        mapCompletions,
  'hm':             mapCompletions,
  'treemap':        mapCompletions,
  'tm':             mapCompletions,
  'linkedhashmap':  mapCompletions,
  'stack':          stackQueueCompletions,
  'queue':          stackQueueCompletions,
  'deque':          stackQueueCompletions,
  'pq':             stackQueueCompletions,
  'sb':             sbCompletions,
  'builder':        sbCompletions,
  'stringbuilder':  sbCompletions,
  'scanner':        scannerCompletions,
  'sc':             scannerCompletions,
  'scn':            scannerCompletions,
}

function getSuggestions(monaco, chain) {
  // Exact match first (handles "System", "System.out", "System.err", "Math", etc.)
  if (CHAIN_MAP[chain]) return CHAIN_MAP[chain](monaco)
  // Lowercase match for instance variables
  const lower = chain.toLowerCase()
  if (CHAIN_MAP[lower]) return CHAIN_MAP[lower](monaco)
  return []
}

// ── top-level snippets ────────────────────────────────────────────────────────

function getSnippets(monaco) {
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

const COMMON_CLASSES = [
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

function getWordCompletions(monaco) {
  return [
    ...COMMON_CLASSES.map(([name, detail]) => C(monaco, name, detail)),
    ...JAVA_KEYWORDS.map((kw) => K(monaco, kw)),
    ...getSnippets(monaco),
  ]
}

// ── registration ─────────────────────────────────────────────────────────────

export function registerJavaCompletions(monaco) {

  // ── Provider 1: member completions (after '.', and while typing the member) ──
  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.'],

    provideCompletionItems(model, position) {
      // Text on the line up to the cursor. Match a chain followed by a dot and
      // the (possibly partial) member being typed: "System.", "System.out",
      // "sb.app", etc. This makes members keep showing as you type, not just
      // the instant you press '.'.
      const textUntil = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn:     1,
        endLineNumber:   position.lineNumber,
        endColumn:       position.column,
      })
      const match = textUntil.match(/([\w$][\w\d$]*(?:\.[\w$][\w\d$]*)*)\.(\w*)$/)
      if (!match) return { suggestions: [] }

      const chain   = match[1]
      const partial = match[2]
      const items   = getSuggestions(monaco, chain)
      if (!items.length) return { suggestions: [] }

      // Replace the partial member word (if any) so filtering works correctly.
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     position.column - partial.length,
        endColumn:       position.column,
      }

      return { suggestions: items.map(s => ({ ...s, range })) }
    },
  })

  // ── Provider 2: word completions (classes, keywords, snippets) ──
  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: [],

    provideCompletionItems(model, position) {
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
      return {
        suggestions: getWordCompletions(monaco).map(s => ({ ...s, range })),
      }
    },
  })
}
