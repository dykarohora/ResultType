import { Result } from './Result'

describe('Resultクラスのテスト', () => {
    describe('Successのテスト', () => {
        it('Result.okで作成したインスタンスは処理の成功を表すオブジェクトである', () => {
            const result = Result.ok()
            expect(result.isSuccess).toBeTruthy()
            expect(result.isFailure).toBeFalsy()
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

    describe('ユーティリティ系メソッドのテスト', () => {
        it('メソッドチェーンで処理に成功した場合と失敗した場合で、それぞれ処理を記述できる', () => {
            expect.assertions(2)
            const successResult = Result.ok(5)

            successResult
              .onSuccess((value: number) => {
                  expect(value).toBe(5)
              })
              .onFailure((error: any) => {
                  console.log('not reached here')
              })

            const errorMessage = 'error occurred'
            const failureResult = Result.fail(errorMessage)

            failureResult
              .onSuccess(() => {
                  console.log('not reached here')
              })
              .onFailure(error => {
                  expect(error).toBe(errorMessage)
              })
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
