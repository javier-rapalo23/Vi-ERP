
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Producto
 * 
 */
export type Producto = {
  id: number
  nombre: string
  codigo: string
  precio: number
  costo: number
  stock: number
  createdAt: Date
}

/**
 * Model Cliente
 * 
 */
export type Cliente = {
  id: number
  nombre: string
  telefono: string | null
  email: string | null
}

/**
 * Model Venta
 * 
 */
export type Venta = {
  id: number
  clienteId: number
  total: number
  fecha: Date
}

/**
 * Model VentaDetalle
 * 
 */
export type VentaDetalle = {
  id: number
  ventaId: number
  productoId: number
  cantidad: number
  precioUnit: number
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Productos
 * const productos = await prisma.producto.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Productos
   * const productos = await prisma.producto.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;

      /**
   * `prisma.producto`: Exposes CRUD operations for the **Producto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Productos
    * const productos = await prisma.producto.findMany()
    * ```
    */
  get producto(): Prisma.ProductoDelegate<GlobalReject>;

  /**
   * `prisma.cliente`: Exposes CRUD operations for the **Cliente** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clientes
    * const clientes = await prisma.cliente.findMany()
    * ```
    */
  get cliente(): Prisma.ClienteDelegate<GlobalReject>;

  /**
   * `prisma.venta`: Exposes CRUD operations for the **Venta** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ventas
    * const ventas = await prisma.venta.findMany()
    * ```
    */
  get venta(): Prisma.VentaDelegate<GlobalReject>;

  /**
   * `prisma.ventaDetalle`: Exposes CRUD operations for the **VentaDetalle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VentaDetalles
    * const ventaDetalles = await prisma.ventaDetalle.findMany()
    * ```
    */
  get ventaDetalle(): Prisma.VentaDetalleDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Prisma Client JS version: 3.15.2
   * Query Engine version: 461d6a05159055555eb7dfb337c9fb271cbd4d7e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: 'DbNull'

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: 'JsonNull'

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: 'AnyNull'

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Producto: 'Producto',
    Cliente: 'Cliente',
    Venta: 'Venta',
    VentaDetalle: 'VentaDetalle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProductoCountOutputType
   */


  export type ProductoCountOutputType = {
    detalles: number
  }

  export type ProductoCountOutputTypeSelect = {
    detalles?: boolean
  }

  export type ProductoCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ProductoCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ProductoCountOutputType
    : S extends undefined
    ? never
    : S extends ProductoCountOutputTypeArgs
    ?'include' extends U
    ? ProductoCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ProductoCountOutputType ? ProductoCountOutputType[P] : never
  } 
    : ProductoCountOutputType
  : ProductoCountOutputType




  // Custom InputTypes

  /**
   * ProductoCountOutputType without action
   */
  export type ProductoCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ProductoCountOutputType
     * 
    **/
    select?: ProductoCountOutputTypeSelect | null
  }



  /**
   * Count Type ClienteCountOutputType
   */


  export type ClienteCountOutputType = {
    ventas: number
  }

  export type ClienteCountOutputTypeSelect = {
    ventas?: boolean
  }

  export type ClienteCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ClienteCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ClienteCountOutputType
    : S extends undefined
    ? never
    : S extends ClienteCountOutputTypeArgs
    ?'include' extends U
    ? ClienteCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ClienteCountOutputType ? ClienteCountOutputType[P] : never
  } 
    : ClienteCountOutputType
  : ClienteCountOutputType




  // Custom InputTypes

  /**
   * ClienteCountOutputType without action
   */
  export type ClienteCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ClienteCountOutputType
     * 
    **/
    select?: ClienteCountOutputTypeSelect | null
  }



  /**
   * Count Type VentaCountOutputType
   */


  export type VentaCountOutputType = {
    detalles: number
  }

  export type VentaCountOutputTypeSelect = {
    detalles?: boolean
  }

  export type VentaCountOutputTypeGetPayload<
    S extends boolean | null | undefined | VentaCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? VentaCountOutputType
    : S extends undefined
    ? never
    : S extends VentaCountOutputTypeArgs
    ?'include' extends U
    ? VentaCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof VentaCountOutputType ? VentaCountOutputType[P] : never
  } 
    : VentaCountOutputType
  : VentaCountOutputType




  // Custom InputTypes

  /**
   * VentaCountOutputType without action
   */
  export type VentaCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the VentaCountOutputType
     * 
    **/
    select?: VentaCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Producto
   */


  export type AggregateProducto = {
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  export type ProductoAvgAggregateOutputType = {
    id: number | null
    precio: number | null
    costo: number | null
    stock: number | null
  }

  export type ProductoSumAggregateOutputType = {
    id: number | null
    precio: number | null
    costo: number | null
    stock: number | null
  }

  export type ProductoMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    codigo: string | null
    precio: number | null
    costo: number | null
    stock: number | null
    createdAt: Date | null
  }

  export type ProductoMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    codigo: string | null
    precio: number | null
    costo: number | null
    stock: number | null
    createdAt: Date | null
  }

  export type ProductoCountAggregateOutputType = {
    id: number
    nombre: number
    codigo: number
    precio: number
    costo: number
    stock: number
    createdAt: number
    _all: number
  }


  export type ProductoAvgAggregateInputType = {
    id?: true
    precio?: true
    costo?: true
    stock?: true
  }

  export type ProductoSumAggregateInputType = {
    id?: true
    precio?: true
    costo?: true
    stock?: true
  }

  export type ProductoMinAggregateInputType = {
    id?: true
    nombre?: true
    codigo?: true
    precio?: true
    costo?: true
    stock?: true
    createdAt?: true
  }

  export type ProductoMaxAggregateInputType = {
    id?: true
    nombre?: true
    codigo?: true
    precio?: true
    costo?: true
    stock?: true
    createdAt?: true
  }

  export type ProductoCountAggregateInputType = {
    id?: true
    nombre?: true
    codigo?: true
    precio?: true
    costo?: true
    stock?: true
    createdAt?: true
    _all?: true
  }

  export type ProductoAggregateArgs = {
    /**
     * Filter which Producto to aggregate.
     * 
    **/
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     * 
    **/
    orderBy?: Enumerable<ProductoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Productos
    **/
    _count?: true | ProductoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductoMaxAggregateInputType
  }

  export type GetProductoAggregateType<T extends ProductoAggregateArgs> = {
        [P in keyof T & keyof AggregateProducto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProducto[P]>
      : GetScalarType<T[P], AggregateProducto[P]>
  }




  export type ProductoGroupByArgs = {
    where?: ProductoWhereInput
    orderBy?: Enumerable<ProductoOrderByWithAggregationInput>
    by: Array<ProductoScalarFieldEnum>
    having?: ProductoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductoCountAggregateInputType | true
    _avg?: ProductoAvgAggregateInputType
    _sum?: ProductoSumAggregateInputType
    _min?: ProductoMinAggregateInputType
    _max?: ProductoMaxAggregateInputType
  }


  export type ProductoGroupByOutputType = {
    id: number
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock: number
    createdAt: Date
    _count: ProductoCountAggregateOutputType | null
    _avg: ProductoAvgAggregateOutputType | null
    _sum: ProductoSumAggregateOutputType | null
    _min: ProductoMinAggregateOutputType | null
    _max: ProductoMaxAggregateOutputType | null
  }

  type GetProductoGroupByPayload<T extends ProductoGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ProductoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductoGroupByOutputType[P]>
            : GetScalarType<T[P], ProductoGroupByOutputType[P]>
        }
      >
    >


  export type ProductoSelect = {
    id?: boolean
    nombre?: boolean
    codigo?: boolean
    precio?: boolean
    costo?: boolean
    stock?: boolean
    createdAt?: boolean
    detalles?: boolean | VentaDetalleFindManyArgs
    _count?: boolean | ProductoCountOutputTypeArgs
  }

  export type ProductoInclude = {
    detalles?: boolean | VentaDetalleFindManyArgs
    _count?: boolean | ProductoCountOutputTypeArgs
  }

  export type ProductoGetPayload<
    S extends boolean | null | undefined | ProductoArgs,
    U = keyof S
      > = S extends true
        ? Producto
    : S extends undefined
    ? never
    : S extends ProductoArgs | ProductoFindManyArgs
    ?'include' extends U
    ? Producto  & {
    [P in TrueKeys<S['include']>]:
        P extends 'detalles' ? Array < VentaDetalleGetPayload<S['include'][P]>>  :
        P extends '_count' ? ProductoCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'detalles' ? Array < VentaDetalleGetPayload<S['select'][P]>>  :
        P extends '_count' ? ProductoCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Producto ? Producto[P] : never
  } 
    : Producto
  : Producto


  type ProductoCountArgs = Merge<
    Omit<ProductoFindManyArgs, 'select' | 'include'> & {
      select?: ProductoCountAggregateInputType | true
    }
  >

  export interface ProductoDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Producto that matches the filter.
     * @param {ProductoFindUniqueArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ProductoFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ProductoFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Producto'> extends True ? CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>> : CheckSelect<T, Prisma__ProductoClient<Producto | null >, Prisma__ProductoClient<ProductoGetPayload<T> | null >>

    /**
     * Find the first Producto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindFirstArgs} args - Arguments to find a Producto
     * @example
     * // Get one Producto
     * const producto = await prisma.producto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ProductoFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ProductoFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Producto'> extends True ? CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>> : CheckSelect<T, Prisma__ProductoClient<Producto | null >, Prisma__ProductoClient<ProductoGetPayload<T> | null >>

    /**
     * Find zero or more Productos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Productos
     * const productos = await prisma.producto.findMany()
     * 
     * // Get first 10 Productos
     * const productos = await prisma.producto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productoWithIdOnly = await prisma.producto.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ProductoFindManyArgs>(
      args?: SelectSubset<T, ProductoFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Producto>>, PrismaPromise<Array<ProductoGetPayload<T>>>>

    /**
     * Create a Producto.
     * @param {ProductoCreateArgs} args - Arguments to create a Producto.
     * @example
     * // Create one Producto
     * const Producto = await prisma.producto.create({
     *   data: {
     *     // ... data to create a Producto
     *   }
     * })
     * 
    **/
    create<T extends ProductoCreateArgs>(
      args: SelectSubset<T, ProductoCreateArgs>
    ): CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>>

    /**
     * Create many Productos.
     *     @param {ProductoCreateManyArgs} args - Arguments to create many Productos.
     *     @example
     *     // Create many Productos
     *     const producto = await prisma.producto.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ProductoCreateManyArgs>(
      args?: SelectSubset<T, ProductoCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Producto.
     * @param {ProductoDeleteArgs} args - Arguments to delete one Producto.
     * @example
     * // Delete one Producto
     * const Producto = await prisma.producto.delete({
     *   where: {
     *     // ... filter to delete one Producto
     *   }
     * })
     * 
    **/
    delete<T extends ProductoDeleteArgs>(
      args: SelectSubset<T, ProductoDeleteArgs>
    ): CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>>

    /**
     * Update one Producto.
     * @param {ProductoUpdateArgs} args - Arguments to update one Producto.
     * @example
     * // Update one Producto
     * const producto = await prisma.producto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ProductoUpdateArgs>(
      args: SelectSubset<T, ProductoUpdateArgs>
    ): CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>>

    /**
     * Delete zero or more Productos.
     * @param {ProductoDeleteManyArgs} args - Arguments to filter Productos to delete.
     * @example
     * // Delete a few Productos
     * const { count } = await prisma.producto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ProductoDeleteManyArgs>(
      args?: SelectSubset<T, ProductoDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Productos
     * const producto = await prisma.producto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ProductoUpdateManyArgs>(
      args: SelectSubset<T, ProductoUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Producto.
     * @param {ProductoUpsertArgs} args - Arguments to update or create a Producto.
     * @example
     * // Update or create a Producto
     * const producto = await prisma.producto.upsert({
     *   create: {
     *     // ... data to create a Producto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Producto we want to update
     *   }
     * })
    **/
    upsert<T extends ProductoUpsertArgs>(
      args: SelectSubset<T, ProductoUpsertArgs>
    ): CheckSelect<T, Prisma__ProductoClient<Producto>, Prisma__ProductoClient<ProductoGetPayload<T>>>

    /**
     * Count the number of Productos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoCountArgs} args - Arguments to filter Productos to count.
     * @example
     * // Count the number of Productos
     * const count = await prisma.producto.count({
     *   where: {
     *     // ... the filter for the Productos we want to count
     *   }
     * })
    **/
    count<T extends ProductoCountArgs>(
      args?: Subset<T, ProductoCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductoAggregateArgs>(args: Subset<T, ProductoAggregateArgs>): PrismaPromise<GetProductoAggregateType<T>>

    /**
     * Group by Producto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductoGroupByArgs['orderBy'] }
        : { orderBy?: ProductoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductoGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for Producto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ProductoClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    detalles<T extends VentaDetalleFindManyArgs = {}>(args?: Subset<T, VentaDetalleFindManyArgs>): CheckSelect<T, PrismaPromise<Array<VentaDetalle>>, PrismaPromise<Array<VentaDetalleGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Producto findUnique
   */
  export type ProductoFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * Throw an Error if a Producto can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Producto to fetch.
     * 
    **/
    where: ProductoWhereUniqueInput
  }


  /**
   * Producto findFirst
   */
  export type ProductoFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * Throw an Error if a Producto can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Producto to fetch.
     * 
    **/
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     * 
    **/
    orderBy?: Enumerable<ProductoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Productos.
     * 
    **/
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Productos.
     * 
    **/
    distinct?: Enumerable<ProductoScalarFieldEnum>
  }


  /**
   * Producto findMany
   */
  export type ProductoFindManyArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * Filter, which Productos to fetch.
     * 
    **/
    where?: ProductoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Productos to fetch.
     * 
    **/
    orderBy?: Enumerable<ProductoOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Productos.
     * 
    **/
    cursor?: ProductoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Productos from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Productos.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ProductoScalarFieldEnum>
  }


  /**
   * Producto create
   */
  export type ProductoCreateArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * The data needed to create a Producto.
     * 
    **/
    data: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
  }


  /**
   * Producto createMany
   */
  export type ProductoCreateManyArgs = {
    /**
     * The data used to create many Productos.
     * 
    **/
    data: Enumerable<ProductoCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Producto update
   */
  export type ProductoUpdateArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * The data needed to update a Producto.
     * 
    **/
    data: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
    /**
     * Choose, which Producto to update.
     * 
    **/
    where: ProductoWhereUniqueInput
  }


  /**
   * Producto updateMany
   */
  export type ProductoUpdateManyArgs = {
    /**
     * The data used to update Productos.
     * 
    **/
    data: XOR<ProductoUpdateManyMutationInput, ProductoUncheckedUpdateManyInput>
    /**
     * Filter which Productos to update
     * 
    **/
    where?: ProductoWhereInput
  }


  /**
   * Producto upsert
   */
  export type ProductoUpsertArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * The filter to search for the Producto to update in case it exists.
     * 
    **/
    where: ProductoWhereUniqueInput
    /**
     * In case the Producto found by the `where` argument doesn't exist, create a new Producto with this data.
     * 
    **/
    create: XOR<ProductoCreateInput, ProductoUncheckedCreateInput>
    /**
     * In case the Producto was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ProductoUpdateInput, ProductoUncheckedUpdateInput>
  }


  /**
   * Producto delete
   */
  export type ProductoDeleteArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
    /**
     * Filter which Producto to delete.
     * 
    **/
    where: ProductoWhereUniqueInput
  }


  /**
   * Producto deleteMany
   */
  export type ProductoDeleteManyArgs = {
    /**
     * Filter which Productos to delete
     * 
    **/
    where?: ProductoWhereInput
  }


  /**
   * Producto without action
   */
  export type ProductoArgs = {
    /**
     * Select specific fields to fetch from the Producto
     * 
    **/
    select?: ProductoSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProductoInclude | null
  }



  /**
   * Model Cliente
   */


  export type AggregateCliente = {
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  export type ClienteAvgAggregateOutputType = {
    id: number | null
  }

  export type ClienteSumAggregateOutputType = {
    id: number | null
  }

  export type ClienteMinAggregateOutputType = {
    id: number | null
    nombre: string | null
    telefono: string | null
    email: string | null
  }

  export type ClienteMaxAggregateOutputType = {
    id: number | null
    nombre: string | null
    telefono: string | null
    email: string | null
  }

  export type ClienteCountAggregateOutputType = {
    id: number
    nombre: number
    telefono: number
    email: number
    _all: number
  }


  export type ClienteAvgAggregateInputType = {
    id?: true
  }

  export type ClienteSumAggregateInputType = {
    id?: true
  }

  export type ClienteMinAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    email?: true
  }

  export type ClienteMaxAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    email?: true
  }

  export type ClienteCountAggregateInputType = {
    id?: true
    nombre?: true
    telefono?: true
    email?: true
    _all?: true
  }

  export type ClienteAggregateArgs = {
    /**
     * Filter which Cliente to aggregate.
     * 
    **/
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     * 
    **/
    orderBy?: Enumerable<ClienteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clientes
    **/
    _count?: true | ClienteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClienteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClienteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClienteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClienteMaxAggregateInputType
  }

  export type GetClienteAggregateType<T extends ClienteAggregateArgs> = {
        [P in keyof T & keyof AggregateCliente]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCliente[P]>
      : GetScalarType<T[P], AggregateCliente[P]>
  }




  export type ClienteGroupByArgs = {
    where?: ClienteWhereInput
    orderBy?: Enumerable<ClienteOrderByWithAggregationInput>
    by: Array<ClienteScalarFieldEnum>
    having?: ClienteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClienteCountAggregateInputType | true
    _avg?: ClienteAvgAggregateInputType
    _sum?: ClienteSumAggregateInputType
    _min?: ClienteMinAggregateInputType
    _max?: ClienteMaxAggregateInputType
  }


  export type ClienteGroupByOutputType = {
    id: number
    nombre: string
    telefono: string | null
    email: string | null
    _count: ClienteCountAggregateOutputType | null
    _avg: ClienteAvgAggregateOutputType | null
    _sum: ClienteSumAggregateOutputType | null
    _min: ClienteMinAggregateOutputType | null
    _max: ClienteMaxAggregateOutputType | null
  }

  type GetClienteGroupByPayload<T extends ClienteGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ClienteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClienteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClienteGroupByOutputType[P]>
            : GetScalarType<T[P], ClienteGroupByOutputType[P]>
        }
      >
    >


  export type ClienteSelect = {
    id?: boolean
    nombre?: boolean
    telefono?: boolean
    email?: boolean
    ventas?: boolean | VentaFindManyArgs
    _count?: boolean | ClienteCountOutputTypeArgs
  }

  export type ClienteInclude = {
    ventas?: boolean | VentaFindManyArgs
    _count?: boolean | ClienteCountOutputTypeArgs
  }

  export type ClienteGetPayload<
    S extends boolean | null | undefined | ClienteArgs,
    U = keyof S
      > = S extends true
        ? Cliente
    : S extends undefined
    ? never
    : S extends ClienteArgs | ClienteFindManyArgs
    ?'include' extends U
    ? Cliente  & {
    [P in TrueKeys<S['include']>]:
        P extends 'ventas' ? Array < VentaGetPayload<S['include'][P]>>  :
        P extends '_count' ? ClienteCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'ventas' ? Array < VentaGetPayload<S['select'][P]>>  :
        P extends '_count' ? ClienteCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Cliente ? Cliente[P] : never
  } 
    : Cliente
  : Cliente


  type ClienteCountArgs = Merge<
    Omit<ClienteFindManyArgs, 'select' | 'include'> & {
      select?: ClienteCountAggregateInputType | true
    }
  >

  export interface ClienteDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Cliente that matches the filter.
     * @param {ClienteFindUniqueArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ClienteFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ClienteFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Cliente'> extends True ? CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>> : CheckSelect<T, Prisma__ClienteClient<Cliente | null >, Prisma__ClienteClient<ClienteGetPayload<T> | null >>

    /**
     * Find the first Cliente that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindFirstArgs} args - Arguments to find a Cliente
     * @example
     * // Get one Cliente
     * const cliente = await prisma.cliente.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ClienteFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ClienteFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Cliente'> extends True ? CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>> : CheckSelect<T, Prisma__ClienteClient<Cliente | null >, Prisma__ClienteClient<ClienteGetPayload<T> | null >>

    /**
     * Find zero or more Clientes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clientes
     * const clientes = await prisma.cliente.findMany()
     * 
     * // Get first 10 Clientes
     * const clientes = await prisma.cliente.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clienteWithIdOnly = await prisma.cliente.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ClienteFindManyArgs>(
      args?: SelectSubset<T, ClienteFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Cliente>>, PrismaPromise<Array<ClienteGetPayload<T>>>>

    /**
     * Create a Cliente.
     * @param {ClienteCreateArgs} args - Arguments to create a Cliente.
     * @example
     * // Create one Cliente
     * const Cliente = await prisma.cliente.create({
     *   data: {
     *     // ... data to create a Cliente
     *   }
     * })
     * 
    **/
    create<T extends ClienteCreateArgs>(
      args: SelectSubset<T, ClienteCreateArgs>
    ): CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>>

    /**
     * Create many Clientes.
     *     @param {ClienteCreateManyArgs} args - Arguments to create many Clientes.
     *     @example
     *     // Create many Clientes
     *     const cliente = await prisma.cliente.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ClienteCreateManyArgs>(
      args?: SelectSubset<T, ClienteCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Cliente.
     * @param {ClienteDeleteArgs} args - Arguments to delete one Cliente.
     * @example
     * // Delete one Cliente
     * const Cliente = await prisma.cliente.delete({
     *   where: {
     *     // ... filter to delete one Cliente
     *   }
     * })
     * 
    **/
    delete<T extends ClienteDeleteArgs>(
      args: SelectSubset<T, ClienteDeleteArgs>
    ): CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>>

    /**
     * Update one Cliente.
     * @param {ClienteUpdateArgs} args - Arguments to update one Cliente.
     * @example
     * // Update one Cliente
     * const cliente = await prisma.cliente.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ClienteUpdateArgs>(
      args: SelectSubset<T, ClienteUpdateArgs>
    ): CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>>

    /**
     * Delete zero or more Clientes.
     * @param {ClienteDeleteManyArgs} args - Arguments to filter Clientes to delete.
     * @example
     * // Delete a few Clientes
     * const { count } = await prisma.cliente.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ClienteDeleteManyArgs>(
      args?: SelectSubset<T, ClienteDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clientes
     * const cliente = await prisma.cliente.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ClienteUpdateManyArgs>(
      args: SelectSubset<T, ClienteUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Cliente.
     * @param {ClienteUpsertArgs} args - Arguments to update or create a Cliente.
     * @example
     * // Update or create a Cliente
     * const cliente = await prisma.cliente.upsert({
     *   create: {
     *     // ... data to create a Cliente
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cliente we want to update
     *   }
     * })
    **/
    upsert<T extends ClienteUpsertArgs>(
      args: SelectSubset<T, ClienteUpsertArgs>
    ): CheckSelect<T, Prisma__ClienteClient<Cliente>, Prisma__ClienteClient<ClienteGetPayload<T>>>

    /**
     * Count the number of Clientes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteCountArgs} args - Arguments to filter Clientes to count.
     * @example
     * // Count the number of Clientes
     * const count = await prisma.cliente.count({
     *   where: {
     *     // ... the filter for the Clientes we want to count
     *   }
     * })
    **/
    count<T extends ClienteCountArgs>(
      args?: Subset<T, ClienteCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClienteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClienteAggregateArgs>(args: Subset<T, ClienteAggregateArgs>): PrismaPromise<GetClienteAggregateType<T>>

    /**
     * Group by Cliente.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClienteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClienteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClienteGroupByArgs['orderBy'] }
        : { orderBy?: ClienteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClienteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClienteGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cliente.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ClienteClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    ventas<T extends VentaFindManyArgs = {}>(args?: Subset<T, VentaFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Venta>>, PrismaPromise<Array<VentaGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Cliente findUnique
   */
  export type ClienteFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * Throw an Error if a Cliente can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Cliente to fetch.
     * 
    **/
    where: ClienteWhereUniqueInput
  }


  /**
   * Cliente findFirst
   */
  export type ClienteFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * Throw an Error if a Cliente can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Cliente to fetch.
     * 
    **/
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     * 
    **/
    orderBy?: Enumerable<ClienteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clientes.
     * 
    **/
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clientes.
     * 
    **/
    distinct?: Enumerable<ClienteScalarFieldEnum>
  }


  /**
   * Cliente findMany
   */
  export type ClienteFindManyArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * Filter, which Clientes to fetch.
     * 
    **/
    where?: ClienteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clientes to fetch.
     * 
    **/
    orderBy?: Enumerable<ClienteOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clientes.
     * 
    **/
    cursor?: ClienteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clientes from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clientes.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ClienteScalarFieldEnum>
  }


  /**
   * Cliente create
   */
  export type ClienteCreateArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * The data needed to create a Cliente.
     * 
    **/
    data: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
  }


  /**
   * Cliente createMany
   */
  export type ClienteCreateManyArgs = {
    /**
     * The data used to create many Clientes.
     * 
    **/
    data: Enumerable<ClienteCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Cliente update
   */
  export type ClienteUpdateArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * The data needed to update a Cliente.
     * 
    **/
    data: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
    /**
     * Choose, which Cliente to update.
     * 
    **/
    where: ClienteWhereUniqueInput
  }


  /**
   * Cliente updateMany
   */
  export type ClienteUpdateManyArgs = {
    /**
     * The data used to update Clientes.
     * 
    **/
    data: XOR<ClienteUpdateManyMutationInput, ClienteUncheckedUpdateManyInput>
    /**
     * Filter which Clientes to update
     * 
    **/
    where?: ClienteWhereInput
  }


  /**
   * Cliente upsert
   */
  export type ClienteUpsertArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * The filter to search for the Cliente to update in case it exists.
     * 
    **/
    where: ClienteWhereUniqueInput
    /**
     * In case the Cliente found by the `where` argument doesn't exist, create a new Cliente with this data.
     * 
    **/
    create: XOR<ClienteCreateInput, ClienteUncheckedCreateInput>
    /**
     * In case the Cliente was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ClienteUpdateInput, ClienteUncheckedUpdateInput>
  }


  /**
   * Cliente delete
   */
  export type ClienteDeleteArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
    /**
     * Filter which Cliente to delete.
     * 
    **/
    where: ClienteWhereUniqueInput
  }


  /**
   * Cliente deleteMany
   */
  export type ClienteDeleteManyArgs = {
    /**
     * Filter which Clientes to delete
     * 
    **/
    where?: ClienteWhereInput
  }


  /**
   * Cliente without action
   */
  export type ClienteArgs = {
    /**
     * Select specific fields to fetch from the Cliente
     * 
    **/
    select?: ClienteSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ClienteInclude | null
  }



  /**
   * Model Venta
   */


  export type AggregateVenta = {
    _count: VentaCountAggregateOutputType | null
    _avg: VentaAvgAggregateOutputType | null
    _sum: VentaSumAggregateOutputType | null
    _min: VentaMinAggregateOutputType | null
    _max: VentaMaxAggregateOutputType | null
  }

  export type VentaAvgAggregateOutputType = {
    id: number | null
    clienteId: number | null
    total: number | null
  }

  export type VentaSumAggregateOutputType = {
    id: number | null
    clienteId: number | null
    total: number | null
  }

  export type VentaMinAggregateOutputType = {
    id: number | null
    clienteId: number | null
    total: number | null
    fecha: Date | null
  }

  export type VentaMaxAggregateOutputType = {
    id: number | null
    clienteId: number | null
    total: number | null
    fecha: Date | null
  }

  export type VentaCountAggregateOutputType = {
    id: number
    clienteId: number
    total: number
    fecha: number
    _all: number
  }


  export type VentaAvgAggregateInputType = {
    id?: true
    clienteId?: true
    total?: true
  }

  export type VentaSumAggregateInputType = {
    id?: true
    clienteId?: true
    total?: true
  }

  export type VentaMinAggregateInputType = {
    id?: true
    clienteId?: true
    total?: true
    fecha?: true
  }

  export type VentaMaxAggregateInputType = {
    id?: true
    clienteId?: true
    total?: true
    fecha?: true
  }

  export type VentaCountAggregateInputType = {
    id?: true
    clienteId?: true
    total?: true
    fecha?: true
    _all?: true
  }

  export type VentaAggregateArgs = {
    /**
     * Filter which Venta to aggregate.
     * 
    **/
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ventas
    **/
    _count?: true | VentaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VentaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VentaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VentaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VentaMaxAggregateInputType
  }

  export type GetVentaAggregateType<T extends VentaAggregateArgs> = {
        [P in keyof T & keyof AggregateVenta]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVenta[P]>
      : GetScalarType<T[P], AggregateVenta[P]>
  }




  export type VentaGroupByArgs = {
    where?: VentaWhereInput
    orderBy?: Enumerable<VentaOrderByWithAggregationInput>
    by: Array<VentaScalarFieldEnum>
    having?: VentaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VentaCountAggregateInputType | true
    _avg?: VentaAvgAggregateInputType
    _sum?: VentaSumAggregateInputType
    _min?: VentaMinAggregateInputType
    _max?: VentaMaxAggregateInputType
  }


  export type VentaGroupByOutputType = {
    id: number
    clienteId: number
    total: number
    fecha: Date
    _count: VentaCountAggregateOutputType | null
    _avg: VentaAvgAggregateOutputType | null
    _sum: VentaSumAggregateOutputType | null
    _min: VentaMinAggregateOutputType | null
    _max: VentaMaxAggregateOutputType | null
  }

  type GetVentaGroupByPayload<T extends VentaGroupByArgs> = PrismaPromise<
    Array<
      PickArray<VentaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VentaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VentaGroupByOutputType[P]>
            : GetScalarType<T[P], VentaGroupByOutputType[P]>
        }
      >
    >


  export type VentaSelect = {
    id?: boolean
    clienteId?: boolean
    total?: boolean
    fecha?: boolean
    cliente?: boolean | ClienteArgs
    detalles?: boolean | VentaDetalleFindManyArgs
    _count?: boolean | VentaCountOutputTypeArgs
  }

  export type VentaInclude = {
    cliente?: boolean | ClienteArgs
    detalles?: boolean | VentaDetalleFindManyArgs
    _count?: boolean | VentaCountOutputTypeArgs
  }

  export type VentaGetPayload<
    S extends boolean | null | undefined | VentaArgs,
    U = keyof S
      > = S extends true
        ? Venta
    : S extends undefined
    ? never
    : S extends VentaArgs | VentaFindManyArgs
    ?'include' extends U
    ? Venta  & {
    [P in TrueKeys<S['include']>]:
        P extends 'cliente' ? ClienteGetPayload<S['include'][P]> :
        P extends 'detalles' ? Array < VentaDetalleGetPayload<S['include'][P]>>  :
        P extends '_count' ? VentaCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'cliente' ? ClienteGetPayload<S['select'][P]> :
        P extends 'detalles' ? Array < VentaDetalleGetPayload<S['select'][P]>>  :
        P extends '_count' ? VentaCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Venta ? Venta[P] : never
  } 
    : Venta
  : Venta


  type VentaCountArgs = Merge<
    Omit<VentaFindManyArgs, 'select' | 'include'> & {
      select?: VentaCountAggregateInputType | true
    }
  >

  export interface VentaDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Venta that matches the filter.
     * @param {VentaFindUniqueArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends VentaFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, VentaFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Venta'> extends True ? CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>> : CheckSelect<T, Prisma__VentaClient<Venta | null >, Prisma__VentaClient<VentaGetPayload<T> | null >>

    /**
     * Find the first Venta that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaFindFirstArgs} args - Arguments to find a Venta
     * @example
     * // Get one Venta
     * const venta = await prisma.venta.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends VentaFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, VentaFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Venta'> extends True ? CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>> : CheckSelect<T, Prisma__VentaClient<Venta | null >, Prisma__VentaClient<VentaGetPayload<T> | null >>

    /**
     * Find zero or more Ventas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ventas
     * const ventas = await prisma.venta.findMany()
     * 
     * // Get first 10 Ventas
     * const ventas = await prisma.venta.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ventaWithIdOnly = await prisma.venta.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends VentaFindManyArgs>(
      args?: SelectSubset<T, VentaFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Venta>>, PrismaPromise<Array<VentaGetPayload<T>>>>

    /**
     * Create a Venta.
     * @param {VentaCreateArgs} args - Arguments to create a Venta.
     * @example
     * // Create one Venta
     * const Venta = await prisma.venta.create({
     *   data: {
     *     // ... data to create a Venta
     *   }
     * })
     * 
    **/
    create<T extends VentaCreateArgs>(
      args: SelectSubset<T, VentaCreateArgs>
    ): CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>>

    /**
     * Create many Ventas.
     *     @param {VentaCreateManyArgs} args - Arguments to create many Ventas.
     *     @example
     *     // Create many Ventas
     *     const venta = await prisma.venta.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends VentaCreateManyArgs>(
      args?: SelectSubset<T, VentaCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Venta.
     * @param {VentaDeleteArgs} args - Arguments to delete one Venta.
     * @example
     * // Delete one Venta
     * const Venta = await prisma.venta.delete({
     *   where: {
     *     // ... filter to delete one Venta
     *   }
     * })
     * 
    **/
    delete<T extends VentaDeleteArgs>(
      args: SelectSubset<T, VentaDeleteArgs>
    ): CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>>

    /**
     * Update one Venta.
     * @param {VentaUpdateArgs} args - Arguments to update one Venta.
     * @example
     * // Update one Venta
     * const venta = await prisma.venta.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VentaUpdateArgs>(
      args: SelectSubset<T, VentaUpdateArgs>
    ): CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>>

    /**
     * Delete zero or more Ventas.
     * @param {VentaDeleteManyArgs} args - Arguments to filter Ventas to delete.
     * @example
     * // Delete a few Ventas
     * const { count } = await prisma.venta.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VentaDeleteManyArgs>(
      args?: SelectSubset<T, VentaDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ventas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ventas
     * const venta = await prisma.venta.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VentaUpdateManyArgs>(
      args: SelectSubset<T, VentaUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Venta.
     * @param {VentaUpsertArgs} args - Arguments to update or create a Venta.
     * @example
     * // Update or create a Venta
     * const venta = await prisma.venta.upsert({
     *   create: {
     *     // ... data to create a Venta
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Venta we want to update
     *   }
     * })
    **/
    upsert<T extends VentaUpsertArgs>(
      args: SelectSubset<T, VentaUpsertArgs>
    ): CheckSelect<T, Prisma__VentaClient<Venta>, Prisma__VentaClient<VentaGetPayload<T>>>

    /**
     * Count the number of Ventas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaCountArgs} args - Arguments to filter Ventas to count.
     * @example
     * // Count the number of Ventas
     * const count = await prisma.venta.count({
     *   where: {
     *     // ... the filter for the Ventas we want to count
     *   }
     * })
    **/
    count<T extends VentaCountArgs>(
      args?: Subset<T, VentaCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VentaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Venta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VentaAggregateArgs>(args: Subset<T, VentaAggregateArgs>): PrismaPromise<GetVentaAggregateType<T>>

    /**
     * Group by Venta.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VentaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VentaGroupByArgs['orderBy'] }
        : { orderBy?: VentaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VentaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVentaGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for Venta.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__VentaClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    cliente<T extends ClienteArgs = {}>(args?: Subset<T, ClienteArgs>): CheckSelect<T, Prisma__ClienteClient<Cliente | null >, Prisma__ClienteClient<ClienteGetPayload<T> | null >>;

    detalles<T extends VentaDetalleFindManyArgs = {}>(args?: Subset<T, VentaDetalleFindManyArgs>): CheckSelect<T, PrismaPromise<Array<VentaDetalle>>, PrismaPromise<Array<VentaDetalleGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * Venta findUnique
   */
  export type VentaFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * Throw an Error if a Venta can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Venta to fetch.
     * 
    **/
    where: VentaWhereUniqueInput
  }


  /**
   * Venta findFirst
   */
  export type VentaFindFirstArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * Throw an Error if a Venta can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which Venta to fetch.
     * 
    **/
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ventas.
     * 
    **/
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ventas.
     * 
    **/
    distinct?: Enumerable<VentaScalarFieldEnum>
  }


  /**
   * Venta findMany
   */
  export type VentaFindManyArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * Filter, which Ventas to fetch.
     * 
    **/
    where?: VentaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ventas to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ventas.
     * 
    **/
    cursor?: VentaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ventas from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ventas.
     * 
    **/
    skip?: number
    distinct?: Enumerable<VentaScalarFieldEnum>
  }


  /**
   * Venta create
   */
  export type VentaCreateArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * The data needed to create a Venta.
     * 
    **/
    data: XOR<VentaCreateInput, VentaUncheckedCreateInput>
  }


  /**
   * Venta createMany
   */
  export type VentaCreateManyArgs = {
    /**
     * The data used to create many Ventas.
     * 
    **/
    data: Enumerable<VentaCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Venta update
   */
  export type VentaUpdateArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * The data needed to update a Venta.
     * 
    **/
    data: XOR<VentaUpdateInput, VentaUncheckedUpdateInput>
    /**
     * Choose, which Venta to update.
     * 
    **/
    where: VentaWhereUniqueInput
  }


  /**
   * Venta updateMany
   */
  export type VentaUpdateManyArgs = {
    /**
     * The data used to update Ventas.
     * 
    **/
    data: XOR<VentaUpdateManyMutationInput, VentaUncheckedUpdateManyInput>
    /**
     * Filter which Ventas to update
     * 
    **/
    where?: VentaWhereInput
  }


  /**
   * Venta upsert
   */
  export type VentaUpsertArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * The filter to search for the Venta to update in case it exists.
     * 
    **/
    where: VentaWhereUniqueInput
    /**
     * In case the Venta found by the `where` argument doesn't exist, create a new Venta with this data.
     * 
    **/
    create: XOR<VentaCreateInput, VentaUncheckedCreateInput>
    /**
     * In case the Venta was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<VentaUpdateInput, VentaUncheckedUpdateInput>
  }


  /**
   * Venta delete
   */
  export type VentaDeleteArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
    /**
     * Filter which Venta to delete.
     * 
    **/
    where: VentaWhereUniqueInput
  }


  /**
   * Venta deleteMany
   */
  export type VentaDeleteManyArgs = {
    /**
     * Filter which Ventas to delete
     * 
    **/
    where?: VentaWhereInput
  }


  /**
   * Venta without action
   */
  export type VentaArgs = {
    /**
     * Select specific fields to fetch from the Venta
     * 
    **/
    select?: VentaSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaInclude | null
  }



  /**
   * Model VentaDetalle
   */


  export type AggregateVentaDetalle = {
    _count: VentaDetalleCountAggregateOutputType | null
    _avg: VentaDetalleAvgAggregateOutputType | null
    _sum: VentaDetalleSumAggregateOutputType | null
    _min: VentaDetalleMinAggregateOutputType | null
    _max: VentaDetalleMaxAggregateOutputType | null
  }

  export type VentaDetalleAvgAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnit: number | null
  }

  export type VentaDetalleSumAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnit: number | null
  }

  export type VentaDetalleMinAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnit: number | null
  }

  export type VentaDetalleMaxAggregateOutputType = {
    id: number | null
    ventaId: number | null
    productoId: number | null
    cantidad: number | null
    precioUnit: number | null
  }

  export type VentaDetalleCountAggregateOutputType = {
    id: number
    ventaId: number
    productoId: number
    cantidad: number
    precioUnit: number
    _all: number
  }


  export type VentaDetalleAvgAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precioUnit?: true
  }

  export type VentaDetalleSumAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precioUnit?: true
  }

  export type VentaDetalleMinAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precioUnit?: true
  }

  export type VentaDetalleMaxAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precioUnit?: true
  }

  export type VentaDetalleCountAggregateInputType = {
    id?: true
    ventaId?: true
    productoId?: true
    cantidad?: true
    precioUnit?: true
    _all?: true
  }

  export type VentaDetalleAggregateArgs = {
    /**
     * Filter which VentaDetalle to aggregate.
     * 
    **/
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaDetalleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VentaDetalles
    **/
    _count?: true | VentaDetalleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VentaDetalleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VentaDetalleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VentaDetalleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VentaDetalleMaxAggregateInputType
  }

  export type GetVentaDetalleAggregateType<T extends VentaDetalleAggregateArgs> = {
        [P in keyof T & keyof AggregateVentaDetalle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVentaDetalle[P]>
      : GetScalarType<T[P], AggregateVentaDetalle[P]>
  }




  export type VentaDetalleGroupByArgs = {
    where?: VentaDetalleWhereInput
    orderBy?: Enumerable<VentaDetalleOrderByWithAggregationInput>
    by: Array<VentaDetalleScalarFieldEnum>
    having?: VentaDetalleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VentaDetalleCountAggregateInputType | true
    _avg?: VentaDetalleAvgAggregateInputType
    _sum?: VentaDetalleSumAggregateInputType
    _min?: VentaDetalleMinAggregateInputType
    _max?: VentaDetalleMaxAggregateInputType
  }


  export type VentaDetalleGroupByOutputType = {
    id: number
    ventaId: number
    productoId: number
    cantidad: number
    precioUnit: number
    _count: VentaDetalleCountAggregateOutputType | null
    _avg: VentaDetalleAvgAggregateOutputType | null
    _sum: VentaDetalleSumAggregateOutputType | null
    _min: VentaDetalleMinAggregateOutputType | null
    _max: VentaDetalleMaxAggregateOutputType | null
  }

  type GetVentaDetalleGroupByPayload<T extends VentaDetalleGroupByArgs> = PrismaPromise<
    Array<
      PickArray<VentaDetalleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VentaDetalleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VentaDetalleGroupByOutputType[P]>
            : GetScalarType<T[P], VentaDetalleGroupByOutputType[P]>
        }
      >
    >


  export type VentaDetalleSelect = {
    id?: boolean
    ventaId?: boolean
    productoId?: boolean
    cantidad?: boolean
    precioUnit?: boolean
    venta?: boolean | VentaArgs
    producto?: boolean | ProductoArgs
  }

  export type VentaDetalleInclude = {
    venta?: boolean | VentaArgs
    producto?: boolean | ProductoArgs
  }

  export type VentaDetalleGetPayload<
    S extends boolean | null | undefined | VentaDetalleArgs,
    U = keyof S
      > = S extends true
        ? VentaDetalle
    : S extends undefined
    ? never
    : S extends VentaDetalleArgs | VentaDetalleFindManyArgs
    ?'include' extends U
    ? VentaDetalle  & {
    [P in TrueKeys<S['include']>]:
        P extends 'venta' ? VentaGetPayload<S['include'][P]> :
        P extends 'producto' ? ProductoGetPayload<S['include'][P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'venta' ? VentaGetPayload<S['select'][P]> :
        P extends 'producto' ? ProductoGetPayload<S['select'][P]> :  P extends keyof VentaDetalle ? VentaDetalle[P] : never
  } 
    : VentaDetalle
  : VentaDetalle


  type VentaDetalleCountArgs = Merge<
    Omit<VentaDetalleFindManyArgs, 'select' | 'include'> & {
      select?: VentaDetalleCountAggregateInputType | true
    }
  >

  export interface VentaDetalleDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one VentaDetalle that matches the filter.
     * @param {VentaDetalleFindUniqueArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends VentaDetalleFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, VentaDetalleFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'VentaDetalle'> extends True ? CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>> : CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle | null >, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T> | null >>

    /**
     * Find the first VentaDetalle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleFindFirstArgs} args - Arguments to find a VentaDetalle
     * @example
     * // Get one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends VentaDetalleFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, VentaDetalleFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'VentaDetalle'> extends True ? CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>> : CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle | null >, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T> | null >>

    /**
     * Find zero or more VentaDetalles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VentaDetalles
     * const ventaDetalles = await prisma.ventaDetalle.findMany()
     * 
     * // Get first 10 VentaDetalles
     * const ventaDetalles = await prisma.ventaDetalle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ventaDetalleWithIdOnly = await prisma.ventaDetalle.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends VentaDetalleFindManyArgs>(
      args?: SelectSubset<T, VentaDetalleFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<VentaDetalle>>, PrismaPromise<Array<VentaDetalleGetPayload<T>>>>

    /**
     * Create a VentaDetalle.
     * @param {VentaDetalleCreateArgs} args - Arguments to create a VentaDetalle.
     * @example
     * // Create one VentaDetalle
     * const VentaDetalle = await prisma.ventaDetalle.create({
     *   data: {
     *     // ... data to create a VentaDetalle
     *   }
     * })
     * 
    **/
    create<T extends VentaDetalleCreateArgs>(
      args: SelectSubset<T, VentaDetalleCreateArgs>
    ): CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>>

    /**
     * Create many VentaDetalles.
     *     @param {VentaDetalleCreateManyArgs} args - Arguments to create many VentaDetalles.
     *     @example
     *     // Create many VentaDetalles
     *     const ventaDetalle = await prisma.ventaDetalle.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends VentaDetalleCreateManyArgs>(
      args?: SelectSubset<T, VentaDetalleCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a VentaDetalle.
     * @param {VentaDetalleDeleteArgs} args - Arguments to delete one VentaDetalle.
     * @example
     * // Delete one VentaDetalle
     * const VentaDetalle = await prisma.ventaDetalle.delete({
     *   where: {
     *     // ... filter to delete one VentaDetalle
     *   }
     * })
     * 
    **/
    delete<T extends VentaDetalleDeleteArgs>(
      args: SelectSubset<T, VentaDetalleDeleteArgs>
    ): CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>>

    /**
     * Update one VentaDetalle.
     * @param {VentaDetalleUpdateArgs} args - Arguments to update one VentaDetalle.
     * @example
     * // Update one VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends VentaDetalleUpdateArgs>(
      args: SelectSubset<T, VentaDetalleUpdateArgs>
    ): CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>>

    /**
     * Delete zero or more VentaDetalles.
     * @param {VentaDetalleDeleteManyArgs} args - Arguments to filter VentaDetalles to delete.
     * @example
     * // Delete a few VentaDetalles
     * const { count } = await prisma.ventaDetalle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends VentaDetalleDeleteManyArgs>(
      args?: SelectSubset<T, VentaDetalleDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more VentaDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VentaDetalles
     * const ventaDetalle = await prisma.ventaDetalle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends VentaDetalleUpdateManyArgs>(
      args: SelectSubset<T, VentaDetalleUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one VentaDetalle.
     * @param {VentaDetalleUpsertArgs} args - Arguments to update or create a VentaDetalle.
     * @example
     * // Update or create a VentaDetalle
     * const ventaDetalle = await prisma.ventaDetalle.upsert({
     *   create: {
     *     // ... data to create a VentaDetalle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VentaDetalle we want to update
     *   }
     * })
    **/
    upsert<T extends VentaDetalleUpsertArgs>(
      args: SelectSubset<T, VentaDetalleUpsertArgs>
    ): CheckSelect<T, Prisma__VentaDetalleClient<VentaDetalle>, Prisma__VentaDetalleClient<VentaDetalleGetPayload<T>>>

    /**
     * Count the number of VentaDetalles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleCountArgs} args - Arguments to filter VentaDetalles to count.
     * @example
     * // Count the number of VentaDetalles
     * const count = await prisma.ventaDetalle.count({
     *   where: {
     *     // ... the filter for the VentaDetalles we want to count
     *   }
     * })
    **/
    count<T extends VentaDetalleCountArgs>(
      args?: Subset<T, VentaDetalleCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VentaDetalleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VentaDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VentaDetalleAggregateArgs>(args: Subset<T, VentaDetalleAggregateArgs>): PrismaPromise<GetVentaDetalleAggregateType<T>>

    /**
     * Group by VentaDetalle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VentaDetalleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VentaDetalleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VentaDetalleGroupByArgs['orderBy'] }
        : { orderBy?: VentaDetalleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VentaDetalleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVentaDetalleGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for VentaDetalle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__VentaDetalleClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    venta<T extends VentaArgs = {}>(args?: Subset<T, VentaArgs>): CheckSelect<T, Prisma__VentaClient<Venta | null >, Prisma__VentaClient<VentaGetPayload<T> | null >>;

    producto<T extends ProductoArgs = {}>(args?: Subset<T, ProductoArgs>): CheckSelect<T, Prisma__ProductoClient<Producto | null >, Prisma__ProductoClient<ProductoGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * VentaDetalle findUnique
   */
  export type VentaDetalleFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * Throw an Error if a VentaDetalle can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which VentaDetalle to fetch.
     * 
    **/
    where: VentaDetalleWhereUniqueInput
  }


  /**
   * VentaDetalle findFirst
   */
  export type VentaDetalleFindFirstArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * Throw an Error if a VentaDetalle can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which VentaDetalle to fetch.
     * 
    **/
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaDetalleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VentaDetalles.
     * 
    **/
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VentaDetalles.
     * 
    **/
    distinct?: Enumerable<VentaDetalleScalarFieldEnum>
  }


  /**
   * VentaDetalle findMany
   */
  export type VentaDetalleFindManyArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * Filter, which VentaDetalles to fetch.
     * 
    **/
    where?: VentaDetalleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VentaDetalles to fetch.
     * 
    **/
    orderBy?: Enumerable<VentaDetalleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VentaDetalles.
     * 
    **/
    cursor?: VentaDetalleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VentaDetalles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VentaDetalles.
     * 
    **/
    skip?: number
    distinct?: Enumerable<VentaDetalleScalarFieldEnum>
  }


  /**
   * VentaDetalle create
   */
  export type VentaDetalleCreateArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * The data needed to create a VentaDetalle.
     * 
    **/
    data: XOR<VentaDetalleCreateInput, VentaDetalleUncheckedCreateInput>
  }


  /**
   * VentaDetalle createMany
   */
  export type VentaDetalleCreateManyArgs = {
    /**
     * The data used to create many VentaDetalles.
     * 
    **/
    data: Enumerable<VentaDetalleCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * VentaDetalle update
   */
  export type VentaDetalleUpdateArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * The data needed to update a VentaDetalle.
     * 
    **/
    data: XOR<VentaDetalleUpdateInput, VentaDetalleUncheckedUpdateInput>
    /**
     * Choose, which VentaDetalle to update.
     * 
    **/
    where: VentaDetalleWhereUniqueInput
  }


  /**
   * VentaDetalle updateMany
   */
  export type VentaDetalleUpdateManyArgs = {
    /**
     * The data used to update VentaDetalles.
     * 
    **/
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyInput>
    /**
     * Filter which VentaDetalles to update
     * 
    **/
    where?: VentaDetalleWhereInput
  }


  /**
   * VentaDetalle upsert
   */
  export type VentaDetalleUpsertArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * The filter to search for the VentaDetalle to update in case it exists.
     * 
    **/
    where: VentaDetalleWhereUniqueInput
    /**
     * In case the VentaDetalle found by the `where` argument doesn't exist, create a new VentaDetalle with this data.
     * 
    **/
    create: XOR<VentaDetalleCreateInput, VentaDetalleUncheckedCreateInput>
    /**
     * In case the VentaDetalle was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<VentaDetalleUpdateInput, VentaDetalleUncheckedUpdateInput>
  }


  /**
   * VentaDetalle delete
   */
  export type VentaDetalleDeleteArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
    /**
     * Filter which VentaDetalle to delete.
     * 
    **/
    where: VentaDetalleWhereUniqueInput
  }


  /**
   * VentaDetalle deleteMany
   */
  export type VentaDetalleDeleteManyArgs = {
    /**
     * Filter which VentaDetalles to delete
     * 
    **/
    where?: VentaDetalleWhereInput
  }


  /**
   * VentaDetalle without action
   */
  export type VentaDetalleArgs = {
    /**
     * Select specific fields to fetch from the VentaDetalle
     * 
    **/
    select?: VentaDetalleSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: VentaDetalleInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const ProductoScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    codigo: 'codigo',
    precio: 'precio',
    costo: 'costo',
    stock: 'stock',
    createdAt: 'createdAt'
  };

  export type ProductoScalarFieldEnum = (typeof ProductoScalarFieldEnum)[keyof typeof ProductoScalarFieldEnum]


  export const ClienteScalarFieldEnum: {
    id: 'id',
    nombre: 'nombre',
    telefono: 'telefono',
    email: 'email'
  };

  export type ClienteScalarFieldEnum = (typeof ClienteScalarFieldEnum)[keyof typeof ClienteScalarFieldEnum]


  export const VentaScalarFieldEnum: {
    id: 'id',
    clienteId: 'clienteId',
    total: 'total',
    fecha: 'fecha'
  };

  export type VentaScalarFieldEnum = (typeof VentaScalarFieldEnum)[keyof typeof VentaScalarFieldEnum]


  export const VentaDetalleScalarFieldEnum: {
    id: 'id',
    ventaId: 'ventaId',
    productoId: 'productoId',
    cantidad: 'cantidad',
    precioUnit: 'precioUnit'
  };

  export type VentaDetalleScalarFieldEnum = (typeof VentaDetalleScalarFieldEnum)[keyof typeof VentaDetalleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Deep Input Types
   */


  export type ProductoWhereInput = {
    AND?: Enumerable<ProductoWhereInput>
    OR?: Enumerable<ProductoWhereInput>
    NOT?: Enumerable<ProductoWhereInput>
    id?: IntFilter | number
    nombre?: StringFilter | string
    codigo?: StringFilter | string
    precio?: FloatFilter | number
    costo?: FloatFilter | number
    stock?: IntFilter | number
    createdAt?: DateTimeFilter | Date | string
    detalles?: VentaDetalleListRelationFilter
  }

  export type ProductoOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    codigo?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    detalles?: VentaDetalleOrderByRelationAggregateInput
  }

  export type ProductoWhereUniqueInput = {
    id?: number
    codigo?: string
  }

  export type ProductoOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    codigo?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    _count?: ProductoCountOrderByAggregateInput
    _avg?: ProductoAvgOrderByAggregateInput
    _max?: ProductoMaxOrderByAggregateInput
    _min?: ProductoMinOrderByAggregateInput
    _sum?: ProductoSumOrderByAggregateInput
  }

  export type ProductoScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ProductoScalarWhereWithAggregatesInput>
    OR?: Enumerable<ProductoScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ProductoScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    nombre?: StringWithAggregatesFilter | string
    codigo?: StringWithAggregatesFilter | string
    precio?: FloatWithAggregatesFilter | number
    costo?: FloatWithAggregatesFilter | number
    stock?: IntWithAggregatesFilter | number
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type ClienteWhereInput = {
    AND?: Enumerable<ClienteWhereInput>
    OR?: Enumerable<ClienteWhereInput>
    NOT?: Enumerable<ClienteWhereInput>
    id?: IntFilter | number
    nombre?: StringFilter | string
    telefono?: StringNullableFilter | string | null
    email?: StringNullableFilter | string | null
    ventas?: VentaListRelationFilter
  }

  export type ClienteOrderByWithRelationInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    ventas?: VentaOrderByRelationAggregateInput
  }

  export type ClienteWhereUniqueInput = {
    id?: number
  }

  export type ClienteOrderByWithAggregationInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
    _count?: ClienteCountOrderByAggregateInput
    _avg?: ClienteAvgOrderByAggregateInput
    _max?: ClienteMaxOrderByAggregateInput
    _min?: ClienteMinOrderByAggregateInput
    _sum?: ClienteSumOrderByAggregateInput
  }

  export type ClienteScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ClienteScalarWhereWithAggregatesInput>
    OR?: Enumerable<ClienteScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ClienteScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    nombre?: StringWithAggregatesFilter | string
    telefono?: StringNullableWithAggregatesFilter | string | null
    email?: StringNullableWithAggregatesFilter | string | null
  }

  export type VentaWhereInput = {
    AND?: Enumerable<VentaWhereInput>
    OR?: Enumerable<VentaWhereInput>
    NOT?: Enumerable<VentaWhereInput>
    id?: IntFilter | number
    clienteId?: IntFilter | number
    total?: FloatFilter | number
    fecha?: DateTimeFilter | Date | string
    cliente?: XOR<ClienteRelationFilter, ClienteWhereInput>
    detalles?: VentaDetalleListRelationFilter
  }

  export type VentaOrderByWithRelationInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
    fecha?: SortOrder
    cliente?: ClienteOrderByWithRelationInput
    detalles?: VentaDetalleOrderByRelationAggregateInput
  }

  export type VentaWhereUniqueInput = {
    id?: number
  }

  export type VentaOrderByWithAggregationInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
    fecha?: SortOrder
    _count?: VentaCountOrderByAggregateInput
    _avg?: VentaAvgOrderByAggregateInput
    _max?: VentaMaxOrderByAggregateInput
    _min?: VentaMinOrderByAggregateInput
    _sum?: VentaSumOrderByAggregateInput
  }

  export type VentaScalarWhereWithAggregatesInput = {
    AND?: Enumerable<VentaScalarWhereWithAggregatesInput>
    OR?: Enumerable<VentaScalarWhereWithAggregatesInput>
    NOT?: Enumerable<VentaScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    clienteId?: IntWithAggregatesFilter | number
    total?: FloatWithAggregatesFilter | number
    fecha?: DateTimeWithAggregatesFilter | Date | string
  }

  export type VentaDetalleWhereInput = {
    AND?: Enumerable<VentaDetalleWhereInput>
    OR?: Enumerable<VentaDetalleWhereInput>
    NOT?: Enumerable<VentaDetalleWhereInput>
    id?: IntFilter | number
    ventaId?: IntFilter | number
    productoId?: IntFilter | number
    cantidad?: IntFilter | number
    precioUnit?: FloatFilter | number
    venta?: XOR<VentaRelationFilter, VentaWhereInput>
    producto?: XOR<ProductoRelationFilter, ProductoWhereInput>
  }

  export type VentaDetalleOrderByWithRelationInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
    venta?: VentaOrderByWithRelationInput
    producto?: ProductoOrderByWithRelationInput
  }

  export type VentaDetalleWhereUniqueInput = {
    id?: number
  }

  export type VentaDetalleOrderByWithAggregationInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
    _count?: VentaDetalleCountOrderByAggregateInput
    _avg?: VentaDetalleAvgOrderByAggregateInput
    _max?: VentaDetalleMaxOrderByAggregateInput
    _min?: VentaDetalleMinOrderByAggregateInput
    _sum?: VentaDetalleSumOrderByAggregateInput
  }

  export type VentaDetalleScalarWhereWithAggregatesInput = {
    AND?: Enumerable<VentaDetalleScalarWhereWithAggregatesInput>
    OR?: Enumerable<VentaDetalleScalarWhereWithAggregatesInput>
    NOT?: Enumerable<VentaDetalleScalarWhereWithAggregatesInput>
    id?: IntWithAggregatesFilter | number
    ventaId?: IntWithAggregatesFilter | number
    productoId?: IntWithAggregatesFilter | number
    cantidad?: IntWithAggregatesFilter | number
    precioUnit?: FloatWithAggregatesFilter | number
  }

  export type ProductoCreateInput = {
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock?: number
    createdAt?: Date | string
    detalles?: VentaDetalleCreateNestedManyWithoutProductoInput
  }

  export type ProductoUncheckedCreateInput = {
    id?: number
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock?: number
    createdAt?: Date | string
    detalles?: VentaDetalleUncheckedCreateNestedManyWithoutProductoInput
  }

  export type ProductoUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: VentaDetalleUpdateManyWithoutProductoInput
  }

  export type ProductoUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: VentaDetalleUncheckedUpdateManyWithoutProductoInput
  }

  export type ProductoCreateManyInput = {
    id?: number
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock?: number
    createdAt?: Date | string
  }

  export type ProductoUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductoUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClienteCreateInput = {
    nombre: string
    telefono?: string | null
    email?: string | null
    ventas?: VentaCreateNestedManyWithoutClienteInput
  }

  export type ClienteUncheckedCreateInput = {
    id?: number
    nombre: string
    telefono?: string | null
    email?: string | null
    ventas?: VentaUncheckedCreateNestedManyWithoutClienteInput
  }

  export type ClienteUpdateInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    ventas?: VentaUpdateManyWithoutClienteInput
  }

  export type ClienteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    ventas?: VentaUncheckedUpdateManyWithoutClienteInput
  }

  export type ClienteCreateManyInput = {
    id?: number
    nombre: string
    telefono?: string | null
    email?: string | null
  }

  export type ClienteUpdateManyMutationInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClienteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VentaCreateInput = {
    total: number
    fecha?: Date | string
    cliente: ClienteCreateNestedOneWithoutVentasInput
    detalles?: VentaDetalleCreateNestedManyWithoutVentaInput
  }

  export type VentaUncheckedCreateInput = {
    id?: number
    clienteId: number
    total: number
    fecha?: Date | string
    detalles?: VentaDetalleUncheckedCreateNestedManyWithoutVentaInput
  }

  export type VentaUpdateInput = {
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutVentasInput
    detalles?: VentaDetalleUpdateManyWithoutVentaInput
  }

  export type VentaUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    clienteId?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: VentaDetalleUncheckedUpdateManyWithoutVentaInput
  }

  export type VentaCreateManyInput = {
    id?: number
    clienteId: number
    total: number
    fecha?: Date | string
  }

  export type VentaUpdateManyMutationInput = {
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    clienteId?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaDetalleCreateInput = {
    cantidad: number
    precioUnit: number
    venta: VentaCreateNestedOneWithoutDetallesInput
    producto: ProductoCreateNestedOneWithoutDetallesInput
  }

  export type VentaDetalleUncheckedCreateInput = {
    id?: number
    ventaId: number
    productoId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleUpdateInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
    venta?: VentaUpdateOneRequiredWithoutDetallesInput
    producto?: ProductoUpdateOneRequiredWithoutDetallesInput
  }

  export type VentaDetalleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleCreateManyInput = {
    id?: number
    ventaId: number
    productoId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleUpdateManyMutationInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type VentaDetalleListRelationFilter = {
    every?: VentaDetalleWhereInput
    some?: VentaDetalleWhereInput
    none?: VentaDetalleWhereInput
  }

  export type VentaDetalleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductoCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    codigo?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductoAvgOrderByAggregateInput = {
    id?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
  }

  export type ProductoMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    codigo?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductoMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    codigo?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
  }

  export type ProductoSumOrderByAggregateInput = {
    id?: SortOrder
    precio?: SortOrder
    costo?: SortOrder
    stock?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type VentaListRelationFilter = {
    every?: VentaWhereInput
    some?: VentaWhereInput
    none?: VentaWhereInput
  }

  export type VentaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClienteCountOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
  }

  export type ClienteAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ClienteMaxOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
  }

  export type ClienteMinOrderByAggregateInput = {
    id?: SortOrder
    nombre?: SortOrder
    telefono?: SortOrder
    email?: SortOrder
  }

  export type ClienteSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type ClienteRelationFilter = {
    is?: ClienteWhereInput
    isNot?: ClienteWhereInput
  }

  export type VentaCountOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
    fecha?: SortOrder
  }

  export type VentaAvgOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
  }

  export type VentaMaxOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
    fecha?: SortOrder
  }

  export type VentaMinOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
    fecha?: SortOrder
  }

  export type VentaSumOrderByAggregateInput = {
    id?: SortOrder
    clienteId?: SortOrder
    total?: SortOrder
  }

  export type VentaRelationFilter = {
    is?: VentaWhereInput
    isNot?: VentaWhereInput
  }

  export type ProductoRelationFilter = {
    is?: ProductoWhereInput
    isNot?: ProductoWhereInput
  }

  export type VentaDetalleCountOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
  }

  export type VentaDetalleAvgOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
  }

  export type VentaDetalleMaxOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
  }

  export type VentaDetalleMinOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
  }

  export type VentaDetalleSumOrderByAggregateInput = {
    id?: SortOrder
    ventaId?: SortOrder
    productoId?: SortOrder
    cantidad?: SortOrder
    precioUnit?: SortOrder
  }

  export type VentaDetalleCreateNestedManyWithoutProductoInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutProductoInput>, Enumerable<VentaDetalleUncheckedCreateWithoutProductoInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutProductoInput>
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
  }

  export type VentaDetalleUncheckedCreateNestedManyWithoutProductoInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutProductoInput>, Enumerable<VentaDetalleUncheckedCreateWithoutProductoInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutProductoInput>
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VentaDetalleUpdateManyWithoutProductoInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutProductoInput>, Enumerable<VentaDetalleUncheckedCreateWithoutProductoInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutProductoInput>
    upsert?: Enumerable<VentaDetalleUpsertWithWhereUniqueWithoutProductoInput>
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    set?: Enumerable<VentaDetalleWhereUniqueInput>
    disconnect?: Enumerable<VentaDetalleWhereUniqueInput>
    delete?: Enumerable<VentaDetalleWhereUniqueInput>
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
    update?: Enumerable<VentaDetalleUpdateWithWhereUniqueWithoutProductoInput>
    updateMany?: Enumerable<VentaDetalleUpdateManyWithWhereWithoutProductoInput>
    deleteMany?: Enumerable<VentaDetalleScalarWhereInput>
  }

  export type VentaDetalleUncheckedUpdateManyWithoutProductoInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutProductoInput>, Enumerable<VentaDetalleUncheckedCreateWithoutProductoInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutProductoInput>
    upsert?: Enumerable<VentaDetalleUpsertWithWhereUniqueWithoutProductoInput>
    createMany?: VentaDetalleCreateManyProductoInputEnvelope
    set?: Enumerable<VentaDetalleWhereUniqueInput>
    disconnect?: Enumerable<VentaDetalleWhereUniqueInput>
    delete?: Enumerable<VentaDetalleWhereUniqueInput>
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
    update?: Enumerable<VentaDetalleUpdateWithWhereUniqueWithoutProductoInput>
    updateMany?: Enumerable<VentaDetalleUpdateManyWithWhereWithoutProductoInput>
    deleteMany?: Enumerable<VentaDetalleScalarWhereInput>
  }

  export type VentaCreateNestedManyWithoutClienteInput = {
    create?: XOR<Enumerable<VentaCreateWithoutClienteInput>, Enumerable<VentaUncheckedCreateWithoutClienteInput>>
    connectOrCreate?: Enumerable<VentaCreateOrConnectWithoutClienteInput>
    createMany?: VentaCreateManyClienteInputEnvelope
    connect?: Enumerable<VentaWhereUniqueInput>
  }

  export type VentaUncheckedCreateNestedManyWithoutClienteInput = {
    create?: XOR<Enumerable<VentaCreateWithoutClienteInput>, Enumerable<VentaUncheckedCreateWithoutClienteInput>>
    connectOrCreate?: Enumerable<VentaCreateOrConnectWithoutClienteInput>
    createMany?: VentaCreateManyClienteInputEnvelope
    connect?: Enumerable<VentaWhereUniqueInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type VentaUpdateManyWithoutClienteInput = {
    create?: XOR<Enumerable<VentaCreateWithoutClienteInput>, Enumerable<VentaUncheckedCreateWithoutClienteInput>>
    connectOrCreate?: Enumerable<VentaCreateOrConnectWithoutClienteInput>
    upsert?: Enumerable<VentaUpsertWithWhereUniqueWithoutClienteInput>
    createMany?: VentaCreateManyClienteInputEnvelope
    set?: Enumerable<VentaWhereUniqueInput>
    disconnect?: Enumerable<VentaWhereUniqueInput>
    delete?: Enumerable<VentaWhereUniqueInput>
    connect?: Enumerable<VentaWhereUniqueInput>
    update?: Enumerable<VentaUpdateWithWhereUniqueWithoutClienteInput>
    updateMany?: Enumerable<VentaUpdateManyWithWhereWithoutClienteInput>
    deleteMany?: Enumerable<VentaScalarWhereInput>
  }

  export type VentaUncheckedUpdateManyWithoutClienteInput = {
    create?: XOR<Enumerable<VentaCreateWithoutClienteInput>, Enumerable<VentaUncheckedCreateWithoutClienteInput>>
    connectOrCreate?: Enumerable<VentaCreateOrConnectWithoutClienteInput>
    upsert?: Enumerable<VentaUpsertWithWhereUniqueWithoutClienteInput>
    createMany?: VentaCreateManyClienteInputEnvelope
    set?: Enumerable<VentaWhereUniqueInput>
    disconnect?: Enumerable<VentaWhereUniqueInput>
    delete?: Enumerable<VentaWhereUniqueInput>
    connect?: Enumerable<VentaWhereUniqueInput>
    update?: Enumerable<VentaUpdateWithWhereUniqueWithoutClienteInput>
    updateMany?: Enumerable<VentaUpdateManyWithWhereWithoutClienteInput>
    deleteMany?: Enumerable<VentaScalarWhereInput>
  }

  export type ClienteCreateNestedOneWithoutVentasInput = {
    create?: XOR<ClienteCreateWithoutVentasInput, ClienteUncheckedCreateWithoutVentasInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutVentasInput
    connect?: ClienteWhereUniqueInput
  }

  export type VentaDetalleCreateNestedManyWithoutVentaInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutVentaInput>, Enumerable<VentaDetalleUncheckedCreateWithoutVentaInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutVentaInput>
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
  }

  export type VentaDetalleUncheckedCreateNestedManyWithoutVentaInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutVentaInput>, Enumerable<VentaDetalleUncheckedCreateWithoutVentaInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutVentaInput>
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
  }

  export type ClienteUpdateOneRequiredWithoutVentasInput = {
    create?: XOR<ClienteCreateWithoutVentasInput, ClienteUncheckedCreateWithoutVentasInput>
    connectOrCreate?: ClienteCreateOrConnectWithoutVentasInput
    upsert?: ClienteUpsertWithoutVentasInput
    connect?: ClienteWhereUniqueInput
    update?: XOR<ClienteUpdateWithoutVentasInput, ClienteUncheckedUpdateWithoutVentasInput>
  }

  export type VentaDetalleUpdateManyWithoutVentaInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutVentaInput>, Enumerable<VentaDetalleUncheckedCreateWithoutVentaInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutVentaInput>
    upsert?: Enumerable<VentaDetalleUpsertWithWhereUniqueWithoutVentaInput>
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    set?: Enumerable<VentaDetalleWhereUniqueInput>
    disconnect?: Enumerable<VentaDetalleWhereUniqueInput>
    delete?: Enumerable<VentaDetalleWhereUniqueInput>
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
    update?: Enumerable<VentaDetalleUpdateWithWhereUniqueWithoutVentaInput>
    updateMany?: Enumerable<VentaDetalleUpdateManyWithWhereWithoutVentaInput>
    deleteMany?: Enumerable<VentaDetalleScalarWhereInput>
  }

  export type VentaDetalleUncheckedUpdateManyWithoutVentaInput = {
    create?: XOR<Enumerable<VentaDetalleCreateWithoutVentaInput>, Enumerable<VentaDetalleUncheckedCreateWithoutVentaInput>>
    connectOrCreate?: Enumerable<VentaDetalleCreateOrConnectWithoutVentaInput>
    upsert?: Enumerable<VentaDetalleUpsertWithWhereUniqueWithoutVentaInput>
    createMany?: VentaDetalleCreateManyVentaInputEnvelope
    set?: Enumerable<VentaDetalleWhereUniqueInput>
    disconnect?: Enumerable<VentaDetalleWhereUniqueInput>
    delete?: Enumerable<VentaDetalleWhereUniqueInput>
    connect?: Enumerable<VentaDetalleWhereUniqueInput>
    update?: Enumerable<VentaDetalleUpdateWithWhereUniqueWithoutVentaInput>
    updateMany?: Enumerable<VentaDetalleUpdateManyWithWhereWithoutVentaInput>
    deleteMany?: Enumerable<VentaDetalleScalarWhereInput>
  }

  export type VentaCreateNestedOneWithoutDetallesInput = {
    create?: XOR<VentaCreateWithoutDetallesInput, VentaUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: VentaCreateOrConnectWithoutDetallesInput
    connect?: VentaWhereUniqueInput
  }

  export type ProductoCreateNestedOneWithoutDetallesInput = {
    create?: XOR<ProductoCreateWithoutDetallesInput, ProductoUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutDetallesInput
    connect?: ProductoWhereUniqueInput
  }

  export type VentaUpdateOneRequiredWithoutDetallesInput = {
    create?: XOR<VentaCreateWithoutDetallesInput, VentaUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: VentaCreateOrConnectWithoutDetallesInput
    upsert?: VentaUpsertWithoutDetallesInput
    connect?: VentaWhereUniqueInput
    update?: XOR<VentaUpdateWithoutDetallesInput, VentaUncheckedUpdateWithoutDetallesInput>
  }

  export type ProductoUpdateOneRequiredWithoutDetallesInput = {
    create?: XOR<ProductoCreateWithoutDetallesInput, ProductoUncheckedCreateWithoutDetallesInput>
    connectOrCreate?: ProductoCreateOrConnectWithoutDetallesInput
    upsert?: ProductoUpsertWithoutDetallesInput
    connect?: ProductoWhereUniqueInput
    update?: XOR<ProductoUpdateWithoutDetallesInput, ProductoUncheckedUpdateWithoutDetallesInput>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type VentaDetalleCreateWithoutProductoInput = {
    cantidad: number
    precioUnit: number
    venta: VentaCreateNestedOneWithoutDetallesInput
  }

  export type VentaDetalleUncheckedCreateWithoutProductoInput = {
    id?: number
    ventaId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleCreateOrConnectWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    create: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput>
  }

  export type VentaDetalleCreateManyProductoInputEnvelope = {
    data: Enumerable<VentaDetalleCreateManyProductoInput>
    skipDuplicates?: boolean
  }

  export type VentaDetalleUpsertWithWhereUniqueWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    update: XOR<VentaDetalleUpdateWithoutProductoInput, VentaDetalleUncheckedUpdateWithoutProductoInput>
    create: XOR<VentaDetalleCreateWithoutProductoInput, VentaDetalleUncheckedCreateWithoutProductoInput>
  }

  export type VentaDetalleUpdateWithWhereUniqueWithoutProductoInput = {
    where: VentaDetalleWhereUniqueInput
    data: XOR<VentaDetalleUpdateWithoutProductoInput, VentaDetalleUncheckedUpdateWithoutProductoInput>
  }

  export type VentaDetalleUpdateManyWithWhereWithoutProductoInput = {
    where: VentaDetalleScalarWhereInput
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyWithoutDetallesInput>
  }

  export type VentaDetalleScalarWhereInput = {
    AND?: Enumerable<VentaDetalleScalarWhereInput>
    OR?: Enumerable<VentaDetalleScalarWhereInput>
    NOT?: Enumerable<VentaDetalleScalarWhereInput>
    id?: IntFilter | number
    ventaId?: IntFilter | number
    productoId?: IntFilter | number
    cantidad?: IntFilter | number
    precioUnit?: FloatFilter | number
  }

  export type VentaCreateWithoutClienteInput = {
    total: number
    fecha?: Date | string
    detalles?: VentaDetalleCreateNestedManyWithoutVentaInput
  }

  export type VentaUncheckedCreateWithoutClienteInput = {
    id?: number
    total: number
    fecha?: Date | string
    detalles?: VentaDetalleUncheckedCreateNestedManyWithoutVentaInput
  }

  export type VentaCreateOrConnectWithoutClienteInput = {
    where: VentaWhereUniqueInput
    create: XOR<VentaCreateWithoutClienteInput, VentaUncheckedCreateWithoutClienteInput>
  }

  export type VentaCreateManyClienteInputEnvelope = {
    data: Enumerable<VentaCreateManyClienteInput>
    skipDuplicates?: boolean
  }

  export type VentaUpsertWithWhereUniqueWithoutClienteInput = {
    where: VentaWhereUniqueInput
    update: XOR<VentaUpdateWithoutClienteInput, VentaUncheckedUpdateWithoutClienteInput>
    create: XOR<VentaCreateWithoutClienteInput, VentaUncheckedCreateWithoutClienteInput>
  }

  export type VentaUpdateWithWhereUniqueWithoutClienteInput = {
    where: VentaWhereUniqueInput
    data: XOR<VentaUpdateWithoutClienteInput, VentaUncheckedUpdateWithoutClienteInput>
  }

  export type VentaUpdateManyWithWhereWithoutClienteInput = {
    where: VentaScalarWhereInput
    data: XOR<VentaUpdateManyMutationInput, VentaUncheckedUpdateManyWithoutVentasInput>
  }

  export type VentaScalarWhereInput = {
    AND?: Enumerable<VentaScalarWhereInput>
    OR?: Enumerable<VentaScalarWhereInput>
    NOT?: Enumerable<VentaScalarWhereInput>
    id?: IntFilter | number
    clienteId?: IntFilter | number
    total?: FloatFilter | number
    fecha?: DateTimeFilter | Date | string
  }

  export type ClienteCreateWithoutVentasInput = {
    nombre: string
    telefono?: string | null
    email?: string | null
  }

  export type ClienteUncheckedCreateWithoutVentasInput = {
    id?: number
    nombre: string
    telefono?: string | null
    email?: string | null
  }

  export type ClienteCreateOrConnectWithoutVentasInput = {
    where: ClienteWhereUniqueInput
    create: XOR<ClienteCreateWithoutVentasInput, ClienteUncheckedCreateWithoutVentasInput>
  }

  export type VentaDetalleCreateWithoutVentaInput = {
    cantidad: number
    precioUnit: number
    producto: ProductoCreateNestedOneWithoutDetallesInput
  }

  export type VentaDetalleUncheckedCreateWithoutVentaInput = {
    id?: number
    productoId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleCreateOrConnectWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    create: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput>
  }

  export type VentaDetalleCreateManyVentaInputEnvelope = {
    data: Enumerable<VentaDetalleCreateManyVentaInput>
    skipDuplicates?: boolean
  }

  export type ClienteUpsertWithoutVentasInput = {
    update: XOR<ClienteUpdateWithoutVentasInput, ClienteUncheckedUpdateWithoutVentasInput>
    create: XOR<ClienteCreateWithoutVentasInput, ClienteUncheckedCreateWithoutVentasInput>
  }

  export type ClienteUpdateWithoutVentasInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ClienteUncheckedUpdateWithoutVentasInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    telefono?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VentaDetalleUpsertWithWhereUniqueWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    update: XOR<VentaDetalleUpdateWithoutVentaInput, VentaDetalleUncheckedUpdateWithoutVentaInput>
    create: XOR<VentaDetalleCreateWithoutVentaInput, VentaDetalleUncheckedCreateWithoutVentaInput>
  }

  export type VentaDetalleUpdateWithWhereUniqueWithoutVentaInput = {
    where: VentaDetalleWhereUniqueInput
    data: XOR<VentaDetalleUpdateWithoutVentaInput, VentaDetalleUncheckedUpdateWithoutVentaInput>
  }

  export type VentaDetalleUpdateManyWithWhereWithoutVentaInput = {
    where: VentaDetalleScalarWhereInput
    data: XOR<VentaDetalleUpdateManyMutationInput, VentaDetalleUncheckedUpdateManyWithoutDetallesInput>
  }

  export type VentaCreateWithoutDetallesInput = {
    total: number
    fecha?: Date | string
    cliente: ClienteCreateNestedOneWithoutVentasInput
  }

  export type VentaUncheckedCreateWithoutDetallesInput = {
    id?: number
    clienteId: number
    total: number
    fecha?: Date | string
  }

  export type VentaCreateOrConnectWithoutDetallesInput = {
    where: VentaWhereUniqueInput
    create: XOR<VentaCreateWithoutDetallesInput, VentaUncheckedCreateWithoutDetallesInput>
  }

  export type ProductoCreateWithoutDetallesInput = {
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock?: number
    createdAt?: Date | string
  }

  export type ProductoUncheckedCreateWithoutDetallesInput = {
    id?: number
    nombre: string
    codigo: string
    precio: number
    costo: number
    stock?: number
    createdAt?: Date | string
  }

  export type ProductoCreateOrConnectWithoutDetallesInput = {
    where: ProductoWhereUniqueInput
    create: XOR<ProductoCreateWithoutDetallesInput, ProductoUncheckedCreateWithoutDetallesInput>
  }

  export type VentaUpsertWithoutDetallesInput = {
    update: XOR<VentaUpdateWithoutDetallesInput, VentaUncheckedUpdateWithoutDetallesInput>
    create: XOR<VentaCreateWithoutDetallesInput, VentaUncheckedCreateWithoutDetallesInput>
  }

  export type VentaUpdateWithoutDetallesInput = {
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    cliente?: ClienteUpdateOneRequiredWithoutVentasInput
  }

  export type VentaUncheckedUpdateWithoutDetallesInput = {
    id?: IntFieldUpdateOperationsInput | number
    clienteId?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductoUpsertWithoutDetallesInput = {
    update: XOR<ProductoUpdateWithoutDetallesInput, ProductoUncheckedUpdateWithoutDetallesInput>
    create: XOR<ProductoCreateWithoutDetallesInput, ProductoUncheckedCreateWithoutDetallesInput>
  }

  export type ProductoUpdateWithoutDetallesInput = {
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductoUncheckedUpdateWithoutDetallesInput = {
    id?: IntFieldUpdateOperationsInput | number
    nombre?: StringFieldUpdateOperationsInput | string
    codigo?: StringFieldUpdateOperationsInput | string
    precio?: FloatFieldUpdateOperationsInput | number
    costo?: FloatFieldUpdateOperationsInput | number
    stock?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaDetalleCreateManyProductoInput = {
    id?: number
    ventaId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleUpdateWithoutProductoInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
    venta?: VentaUpdateOneRequiredWithoutDetallesInput
  }

  export type VentaDetalleUncheckedUpdateWithoutProductoInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaDetalleUncheckedUpdateManyWithoutDetallesInput = {
    id?: IntFieldUpdateOperationsInput | number
    ventaId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }

  export type VentaCreateManyClienteInput = {
    id?: number
    total: number
    fecha?: Date | string
  }

  export type VentaUpdateWithoutClienteInput = {
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: VentaDetalleUpdateManyWithoutVentaInput
  }

  export type VentaUncheckedUpdateWithoutClienteInput = {
    id?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
    detalles?: VentaDetalleUncheckedUpdateManyWithoutVentaInput
  }

  export type VentaUncheckedUpdateManyWithoutVentasInput = {
    id?: IntFieldUpdateOperationsInput | number
    total?: FloatFieldUpdateOperationsInput | number
    fecha?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VentaDetalleCreateManyVentaInput = {
    id?: number
    productoId: number
    cantidad: number
    precioUnit: number
  }

  export type VentaDetalleUpdateWithoutVentaInput = {
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
    producto?: ProductoUpdateOneRequiredWithoutDetallesInput
  }

  export type VentaDetalleUncheckedUpdateWithoutVentaInput = {
    id?: IntFieldUpdateOperationsInput | number
    productoId?: IntFieldUpdateOperationsInput | number
    cantidad?: IntFieldUpdateOperationsInput | number
    precioUnit?: FloatFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}