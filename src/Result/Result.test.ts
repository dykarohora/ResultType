import { Result } from './Result'

describe('Resultクラスのテスト', () => {
    describe('Successのテスト', () => {
        it('Result.okで作成したインスタンスは処理の成功を表すオブジェクトである', () => {
            const result = Result.ok()
            expect(result.isSuccess).toBeTruthy()
            expect(result.isFailure).toBeFalsy()
            expect(result.getValue).toThrow()
        })

        it('処理の結果を持つ場合、メソッド経由で取得できる', () => {
            const result = Result.ok(1)
            expect(result.getValue()).toBe(1)
        })

        it('成功を表すResultオブジェクトから、エラーを取得することはできない', () => {
            const result = Result.ok()
            expect(result.getError).toThrow()
        })
    })

    describe('Failureのテスト', () => {
        it('Result.failで作成したインスタンスは処理の失敗を表すオブジェクトである', () => {
            const errorMessage = 'error occurred'
            const result = Result.fail(errorMessage)
            expect(result.isSuccess).toBeFalsy()
            expect(result.isFailure).toBeTruthy()
        })

        it('メソッド経由でエラーオブジェクトを取得できる', () => {
            const errorMessage = 'error occurred'
            const result = Result.fail(errorMessage)
            expect(result.getError()).toBe(errorMessage)
        })

        it('失敗を表すResultオブジェクトから、処理の結果は取得できない', () => {
            const errorMessage = 'error occurred'
            const result = Result.fail(errorMessage)
            expect(result.getValue).toThrow()
        })
    })

    describe('メソッドチェーンのテスト', () => {
        const successIfEven = function (num: number): Result<void, string> {
            if (num % 2 === 0) {
                return Result.ok()
            }
            return Result.fail('not even')
        }

        const successIfEvenWithNumberValue = function (num: number): Result<number, string> {
            if (num % 2 === 0) {
                return Result.ok(num)
            }
            return Result.fail('not even')
        }

        const successIfEvenWithStringValue = function (num: number): Result<string, string> {
            if (num % 2 === 0) {
                return Result.ok(`${num} is even.`)
            }
            return Result.fail('not even')
        }

        it('onSuccessとonFailureを一つずつ', () => {
            expect.assertions(2)
            successIfEven(6)
              .onSuccess(() => {
                  expect(true).toBeTruthy()
              })
              .onFailure(() => {
                  throw new Error('failed')
              })

            successIfEven(5)
              .onSuccess(() => {
                  throw new Error('failed')
              })
              .onFailure(() => {
                  expect(true).toBeTruthy()
              })
        })

        it('onSuccessにResult型でない値を返す関数を渡すと、その値をResult.okでラップして返す', () => {
            const value = 5
            successIfEven(2)
              .onSuccess(() => {
                  return value
              })
              .onSuccess(num => {
                  expect(num).toBe(value)
              })
        })

        it('onSuccessにResult型を返す関数を渡すと、onSuccessはそのResultを返す', () => {
            const value = 4
            successIfEven(value)
              .onSuccess(() => successIfEvenWithNumberValue(value))
              .onSuccess(num => {
                  expect(num).toBe(value)
                  return successIfEvenWithStringValue(value)
              })
              .onSuccess(str => {
                  expect(str).toBe(`${value} is even.`)
              })
        })

        it('onFailureにResult型でない値を返す関数を渡すと、その値をResult.okでラップして返す', () => {
            const value = 7
            successIfEven(5)
              .onSuccess(() => {throw new Error('failed')})
              .onFailure(error => value)
              .onSuccess(num => expect(num).toBe(value))
        })

        it('onFailureにResult型を返す関数を渡すと、onSuccessはそのResultを返す', () => {
            const value = 6
            successIfEven(5)
              .onSuccess(() => {throw new Error('failed')})
              .onFailure(error => successIfEvenWithStringValue(value))
              .onSuccess(str => expect(str).toBe(`${value} is even.`))
        })
    })

    describe('allのテスト', () => {
        describe('成功', () => {
            it('単一', () => {
                const result = Result.all([Result.ok(5)])
                expect(result.isSuccess)
                expect(result.getValue()).toContain(5)
            })

            it('2つ、同じResult型', () => {
                const results = Result.all([Result.ok(1), Result.ok(2)])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain(1)
                expect(results.getValue()).toContain(2)
            })

            it('3つ、同じResult型', () => {
                const results = Result.all([Result.ok('abc'), Result.ok('efg'), Result.ok('hij')])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain('abc')
                expect(results.getValue()).toContain('efg')
                expect(results.getValue()).toContain('hij')
            })

            it('2つ、違うResult型', () => {
                const results = Result.all([Result.ok(1), Result.ok('abc')])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain(1)
                expect(results.getValue()).toContain('abc')
            })

            it('3つ、違うResult型', () => {
                const results = Result.all([Result.ok(1), Result.ok('abc'), Result.ok(true)])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain(1)
                expect(results.getValue()).toContain('abc')
                expect(results.getValue()).toContain(true)
            })

            it('2つ、結果は同じ型、Resultと生が混在', () => {
                const results = Result.all([Result.ok(1), 10])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain(1)
                expect(results.getValue()).toContain(10)
            })

            it('2つ、結果は違う型、Resultと生が混在', () => {
                const results = Result.all([Result.ok(1), 'abc'])
                expect(results.isSuccess).toBeTruthy()

                expect(results.getValue()).toContain(1)
                expect(results.getValue()).toContain('abc')
            })
        })

        describe('失敗', () => {
            it('単一', () => {
                const result = Result.all([Result.fail('error')])
                expect(result.isFailure).toBeTruthy()
                expect(result.getError()).toBe('error')
            })

            it('2つ、片方が失敗', () => {
                const results = Result.all([Result.ok(1), Result.fail('error')])
                expect(results.isFailure).toBeTruthy()
                expect(results.getError()).toBe('error')
            })

            it('2つ、両方が失敗', () => {
                const results = Result.all([Result.fail(1), Result.fail('error')])
                expect(results.isFailure).toBeTruthy()
                expect(results.getError()).toBe(1)
            })
        })
    })
})
