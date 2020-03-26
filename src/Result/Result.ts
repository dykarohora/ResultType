export class Result<T, E> {
    public readonly isSuccess: boolean
    public readonly isFailure: boolean
    private readonly value?: T
    private readonly error?: E

    private constructor(isSuccess: boolean, value?: T, error?: E) {
        if (!isSuccess && !error) {
            throw new Error('[InvalidOperationException]: Needs to set error obbject when failure.')
        }

        if (isSuccess && error) {
            throw new Error('[InvalidOperationException]: Error object cannot be set when success.')
        }

        this.isSuccess = isSuccess
        this.isFailure = !isSuccess

        this.error = error
        this.value = value
    }

    public getValue(): T {
        if (!this.isSuccess || this.value === undefined) {
            throw new Error('[InvalidOperationException]: Cannot get the value of an failure result.')
        }
        return this.value
    }

    public getError(): E {
        if (this.isSuccess || this.error === undefined) {
            throw new Error('[InvalidOperationException]: Cannot get the error of a success result.')
        }
        return this.error
    }

    public static ok(): Result<void, never>
    public static ok<U>(value: U): Result<U, never>
    public static ok<U>(value?: U): Result<U, never> {
        if (value === undefined) {
            return new Result(true)
        }
        return new Result<U, never>(true, value)
    }

    public static fail<E>(error: E): Result<never, E> {
        return new Result<never, E>(false, undefined, error)
    }

    public onSuccess<NextT, NextE>(func: OnSuccessCallback<T, NextT, NextE>): Result<NextT, E | NextE>
    public onSuccess<NextT, NextE>(func: Function) {
        if (this.isSuccess) {
            const result = this.hasValue ? func(this.getValue()) : func()

            if (result instanceof Result) {
                return result
            }

            return Result.ok(result)
        }
        return Result.fail(this.getError())
    }

    private get hasValue(): boolean {
        return this.value !== undefined
    }

    public onFailure<NextT, NextE>(func: (error: E) => Result<NextT, NextE> | NextT): Result<T | NextT, NextE> {
        if (this.isFailure) {
            const result = func(this.getError())

            if (result instanceof Result) {
                return result
            }

            return Result.ok(result)
        }

        if (this.hasValue) {
            return Result.ok(this.getValue())
        }
        return new Result(true)
    }

    public static all<U1, U2, U3, U4, U5, U6, U7, U8, U9, U10, E1, E2, E3, E4, E5, E6, E7, E8, E9, E10>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>,
        Exclude<U6, Promise<any>> | Result<Exclude<U6, Promise<any>>, E6>,
        Exclude<U7, Promise<any>> | Result<Exclude<U7, Promise<any>>, E7>,
        Exclude<U8, Promise<any>> | Result<Exclude<U8, Promise<any>>, E8>,
        Exclude<U9, Promise<any>> | Result<Exclude<U9, Promise<any>>, E9>,
        Exclude<U10, Promise<any>> | Result<Exclude<U10, Promise<any>>, E10>,
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8, U9, U10], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10>

    public static all<U1, U2, U3, U4, U5, U6, U7, U8, U9, E1, E2, E3, E4, E5, E6, E7, E8, E9>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>,
        Exclude<U6, Promise<any>> | Result<Exclude<U6, Promise<any>>, E6>,
        Exclude<U7, Promise<any>> | Result<Exclude<U7, Promise<any>>, E7>,
        Exclude<U8, Promise<any>> | Result<Exclude<U8, Promise<any>>, E8>,
        Exclude<U9, Promise<any>> | Result<Exclude<U9, Promise<any>>, E9>,
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8, U9], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9>

    public static all<U1, U2, U3, U4, U5, U6, U7, U8, E1, E2, E3, E4, E5, E6, E7, E8>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>,
        Exclude<U6, Promise<any>> | Result<Exclude<U6, Promise<any>>, E6>,
        Exclude<U7, Promise<any>> | Result<Exclude<U7, Promise<any>>, E7>,
        Exclude<U8, Promise<any>> | Result<Exclude<U8, Promise<any>>, E8>,
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8>

    public static all<U1, U2, U3, U4, U5, U6, U7, E1, E2, E3, E4, E5, E6, E7>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>,
        Exclude<U6, Promise<any>> | Result<Exclude<U6, Promise<any>>, E6>,
        Exclude<U7, Promise<any>> | Result<Exclude<U7, Promise<any>>, E7>,
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7], E1 | E2 | E3 | E4 | E5 | E6 | E7>

    public static all<U1, U2, U3, U4, U5, U6, E1, E2, E3, E4, E5, E6>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>,
        Exclude<U6, Promise<any>> | Result<Exclude<U6, Promise<any>>, E6>,
      ]
    ): Result<[U1, U2, U3, U4, U5, U6], E1 | E2 | E3 | E4 | E5 | E6>

    public static all<U1, U2, U3, U4, U5, E1, E2, E3, E4, E5>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>,
        Exclude<U5, Promise<any>> | Result<Exclude<U5, Promise<any>>, E5>
      ]
    ): Result<[U1, U2, U3, U4, U5], E1 | E2 | E3 | E4 | E5>

    public static all<U1, U2, U3, U4, E1, E2, E3, E4>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>,
        Exclude<U4, Promise<any>> | Result<Exclude<U4, Promise<any>>, E4>
      ]
    ): Result<[U1, U2, U3, U4], E1 | E2 | E3 | E4>

    public static all<U1, U2, U3, E1, E2, E3>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>,
        Exclude<U3, Promise<any>> | Result<Exclude<U3, Promise<any>>, E3>
      ]
    ): Result<[U1, U2, U3], E1 | E2 | E3>

    public static all<U1, U2, E1, E2>(
      results: readonly [
        Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>,
        Exclude<U2, Promise<any>> | Result<Exclude<U2, Promise<any>>, E2>
      ]
    ): Result<[U1, U2], E1 | E2>

    public static all<U1, E1>(results: readonly [Exclude<U1, Promise<any>> | Result<Exclude<U1, Promise<any>>, E1>]): Result<[U1], E1>

    public static all<U, E>(results: readonly (U | Result<U, E>)[]): Result<U[], E> {
        const values = []
        for (const result of results) {
            if (result instanceof Result) {
                if (result.isSuccess) {
                    values.push(result.getValue())
                } else {
                    return Result.fail(result.getError())
                }
            } else {
                values.push(result)
            }
        }
        return Result.ok(values)
    }
}

// type OnSuccessCallback<T, TNext, ENext> = T extends void ? () => Result<TNext, ENext> | Exclude<TNext, Promise<any>> : (value: T) => Result<TNext, ENext> | Exclude<TNext, Promise<any>>
type OnSuccessCallback<T, TNext, ENext> = T extends void ? () => Result<TNext, ENext> | TNext : (value: T) => Result<TNext, ENext> | TNext
