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

    public onSuccess<NextT, NextE>(func: (value: T) => Result<NextT, NextE> | NextT): Result<NextT, E | NextE>
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
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>,
        U6 | Result<U6, E6>,
        U7 | Result<U7, E7>,
        U8 | Result<U8, E8>,
        U9 | Result<U9, E9>,
        U10 | Result<U10, E10>
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8, U9, U10], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10>

    public static all<U1, U2, U3, U4, U5, U6, U7, U8, U9, E1, E2, E3, E4, E5, E6, E7, E8, E9>(
      results: readonly [
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>,
        U6 | Result<U6, E6>,
        U7 | Result<U7, E7>,
        U8 | Result<U8, E8>,
        U9 | Result<U9, E9>
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8, U9], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9>

    public static all<U1, U2, U3, U4, U5, U6, U7, U8, E1, E2, E3, E4, E5, E6, E7, E8>(
      results: readonly [
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>,
        U6 | Result<U6, E6>,
        U7 | Result<U7, E7>,
        U8 | Result<U8, E8>
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7, U8], E1 | E2 | E3 | E4 | E5 | E6 | E7 | E8>

    public static all<U1, U2, U3, U4, U5, U6, U7, E1, E2, E3, E4, E5, E6, E7>(
      results: readonly [
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>,
        U6 | Result<U6, E6>,
        U7 | Result<U7, E7>
      ]
    ): Result<[U1, U2, U3, U4, U5, U6, U7], E1 | E2 | E3 | E4 | E5 | E6 | E7>

    public static all<U1, U2, U3, U4, U5, U6, E1, E2, E3, E4, E5, E6>(
      results: readonly [
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>,
        U6 | Result<U6, E6>
      ]
    ): Result<[U1, U2, U3, U4, U5, U6], E1 | E2 | E3 | E4 | E5 | E6>

    public static all<U1, U2, U3, U4, U5, E1, E2, E3, E4, E5>(
      results: readonly [
        U1 | Result<U1, E1>,
        U2 | Result<U2, E2>,
        U3 | Result<U3, E3>,
        U4 | Result<U4, E4>,
        U5 | Result<U5, E5>
      ]
    ): Result<[U1, U2, U3, U4, U5], E1 | E2 | E3 | E4 | E5>

    public static all<U1, U2, U3, U4, E1, E2, E3, E4>(
      results: readonly [U1 | Result<U1, E1>, U2 | Result<U2, E2>, U3 | Result<U3, E3>, U4 | Result<U4, E4>]
    ): Result<[U1, U2, U3, U4], E1 | E2 | E3 | E4>

    public static all<U1, U2, U3, E1, E2, E3>(
      results: readonly [U1 | Result<U1, E1>, U2 | Result<U2, E2>, U3 | Result<U3, E3>]
    ): Result<[U1, U2, U3], E1 | E2 | E3>

    public static all<U1, U2, E1, E2>(
      results: readonly [U1 | Result<U1, E1>, U2 | Result<U2, E2>]
    ): Result<[U1, U2], E1 | E2>

    public static all<U1, E1>(results: readonly [U1 | Result<U1, E1>]): Result<[U1], E1>

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
