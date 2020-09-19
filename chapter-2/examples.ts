function add(a: number, b: number) {
  return a + b;
}

const x: number = null;

const y: number | null = null;

const el = document.getElementById("status");
el.textContent = "Ready";

if (el) {
  el.textContent = "Ready";
}

el!.textContent = "Ready";
type A = "A";
type B = "B";
type Twelve = 12;

type AB = "A" | "B";
type AB12 = "A" | "B" | 12;

const a: AB = "A";
const c: AB = "C";

const ab: AB = Math.random() < 0.5 ? "A" : "B";
const ab12: AB12 = ab;

declare let twelve: AB12;
const back: AB = twelve;

interface Person {
  name: string;
}

interface Lifespan {
  birth: Date;
  death?: Date;
}

type PersonSapn = Person & Lifespan;

const ps: PersonSapn = {
  name: "Alan Turing",
  birth: new Date("1912/06/23"),
  death: new Date("1954/06/07")
}

type K = keyof (Person | Lifespan);

keyof (A&B) = (keyof A) | (keyof B);

// ---------------------------------------------------------------------
// Именование типов:

interface Person2 {
  first: string;
  last: string;
}

const p: Person2 = {first: "Jane", last: "Jacobs"};
function email(p: Person2, subject: string, body: string): Response {

}

type T1 = typeof p;

type HTTPFunction = (url: string, options: RequestOptions) => Promise<Response>

// ---------------------------------------------------------------------
// Повторение в типах:
// Расширение одного интерфейса другим.

interface Person3 {
  firstName: string;
  lastName: string;
}

interface PersonWithBirthDate {
  firstName: string;
  lastName: string;
  brith: Date
}

interface PersonWithBirthDate extends Person3{
  brith: Date
}

// Вы также можете использовать оператор пересечения (&)
// для расширения существующего типа:
type PersonWithBirthDate2 = Person3 & {birth: Date};

// ---------------------------------------------------------------------

interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}
interface TopNavState {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
}
// Можно устранить дублирование в типах свойств через указание на State:
type TopNavState1 = {
  usderId: State["userId"];
  pageTitle: State["pageTitle"];
  recentFiles: State["recentFiles"]
}

// Однако здесь все еще присутствуют повторы.
// Используйте отображенный тип:
type TopNavState2 = {
  [k in "userId" | "pageTitle" | "recentFiles"]: State[k]
};

type TopNavState3 = Pick<State, "userId" | "pageTitle" | "recentFiles">;

// ---------------------------------------------------------------------
// Еще одна форма повторов может возникнуть в тип-суммах. Что, если вам
// нужен тип только для тега?
interface SaveAction {
  type: "save";
}
interface LoadAction {
  type: "load"
}

type Action = SaveAction | LoadAction;
type ActionType = "save" | "load";

// Однако здесь все еще присутствуют повторы.
// Используйте отображенный тип:
type ActionType1 = Action["type"];

type ActionRec = Pick<Action, "type">; // {type: "save" | "load"}


// ---------------------------------------------------------------------
// Если вы определяете класс, который может быть инициализирован и затем обновлен,
// то тип для параметра метода обновления будет опционально
// включать большую часть тех же параметров, что и конструктор:
interface Options {
  width: number;
  height: number;
  color: string;
  label: string;
}

interface OptionsUpdate {
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}

class UIWidget {
  constructor(init: Options) {
    /* ... */
  }

  update(options: OptionsUpdate) {
    /* ... */
  }
}

// Вы можете сформировать OptionsUpdate из Options, используя отображенный тип и keyof:
type OptionsUpdate1 = {[k in keyof Options]?: Options[k]}

// keyof возьмет тип и выдаст объединения типов его ключей:
type OptionsKeys = keyof Options; // тип "width" | "height" | "color" | "label"

// Этот шаблон очень популярен и предусмотрен в стандартной
// библиотеке в виде Partial:
class UIWidget1 {
  constructor(init: Options) {/* ... */}
  update(options: Partial<Options>) {/* ... */}
}

// ---------------------------------------------------------------------
// Вам также может потребоваться определить тип, который совпадает с формой значения:
const INT_OPTIONS = {
  width: 640,
  height: 480,
  color: "#00FF00",
  label: "VGA"
};

interface Options2 {
  width: number;
  height: number;
  color: string;
  label: string;
}

// Воспользуйтесь typeof:
type Options3 = typeof INT_OPTIONS;

// ---------------------------------------------------------------------
// Возможно, вы захотите создать именованный тип для выведенного возвращаемого значения функции или метода:
function getUserInfo(userId: string) {
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoritColor,
  };
}
//// Возвращаемый тип выведен как { userId: string; name: string; age:
// number, ... }
//  можете использовать обобщение ReturnType:
type UserInfo = ReturnType<typeof getUserInfo>

// Имейте в виду, что ReturnType работает с typeof типа функции getUserInfo,
// а не ее значения. Используйте этот подход с осторожностью.

// ---------------------------------------------------------------------
// С помощью extends объявите, что любой обобщенный параметр расширяет тип.

interface Name {
  first: string;
  last: string;
}

type DancingDuo<T extends Name> = [T, T];

const couple1: DancingDuo<Name> = [
  {first: "Fred", last: "Astaire"},
  {first: "Gingers", last: "Rogers"}
];

const couple2: DancingDuo<{first: string}> = [
  {first: "Sonny"},
  {first: "Cher"}
]

const dancingDuo = <T extends Name>(x: DancingDuo<T>) => x;
const couple3 = dancingDuo([
  {first: "Fred", last: "Astaire"},
  {first: "Gingers", last: "Rogers"}
]);

const couple33 = dancingDuo([
  {first: "Bono"},
  {first: "Prince"}
]);