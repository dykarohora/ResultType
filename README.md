# type-result

[![CircleCI](https://circleci.com/gh/dykarohora/ResultType.svg?style=svg)](https://circleci.com/gh/dykarohora/ResultType)
[![codecov](https://codecov.io/gh/dykarohora/ResultType/branch/master/graph/badge.svg)](https://codecov.io/gh/dykarohora/ResultType)

Package for type-safe error handling without exception.

## install

`npm install type-result`

## Usage

### Basic Usage

```typescript
import { Result } from 'type-result'

interface User {
    name: string
    age: number
}

function findUserByName(name: string): Result<User, string> {
    const users: User[] = [
        {name: 'alice', age: 25},
        {name: 'bob', age: 19}
    ]

    const user = users.find(user => user.name === name)
    
    // Failure Result object is created by `fail` method
    if (user === undefined) {
        return Result.fail('not found')
    }
    
    // Successed Result object is created by `ok` method
    return Result.ok(user)
}

// success case
const isAliceResult = findUserByName('alice')
if (isAliceResult.isFailure) {
    // Do not reach here
    console.log(isAliceResult.getError())
} else {
    const alice = isAliceResult.getValue()
    console.log(`She is ${alice.name}, ${alice.age} years old.`) // She is alice, 25 years old.
}

// failure case
const isCateResult = findUserByName('cate')
if (isCateResult.isFailure) {
    console.log(isCateResult.getError()) // not found
} else {
    // Do not reach here
}

// method chain
findUserByName('bob')
  .onSuccess(user => console.log(`He is ${user.name}, ${user.age} years old`)) // He is bob, 19 years old
  .onFailure(error => console.log(error))
```

### `onSuccess` & `onFailure`

The `Result` object can describe sequential processing with a method chain like *Promise Chain*.

```typescript
findUserByName('alice')
  .onSuccess(user => {
      return findUserByName('cate')
  })
  .onFailure(error =>{
      return findUserByName('bob')
  })
  // `findUserByName('cate')` returns failure Result object.
  // So, execute function passed `onFailure`
  .onSuccess(user => {
      console.log(`${user.name}`) // alice
  })

findUserByName('alice')
  .onSuccess(user => {
      return findUserByName('alice')
  })
  .onFailure(error =>{
      return findUserByName('bob')
  })
  // The second `findUserByName('alice')` returns success Result object.
  // So, the function inside the above onFailure is not executed.
  // Below onSuccess, passed success Result object that Result.ok({name:'alice', age:25}) 
  .onSuccess(user => {
      console.log(`${user.name}`) // bob
  })
```

### `all<T, E>`

Unwrap multiple Result objects at once.

```typescript
import { Result } from '../../src'

const results = Result.all([
  Result.ok(1),
  Result.ok('str'),
  Result.ok({msg:'messaeg'})
])

const unwrapResult = results.getValue() // Return type is `[number, string, {msg:string}]
```

Type assertion is not required for unwrapped objects because type inference is in effect.

## Type-Safe Error Handling

When considering business rules, there is almost one pattern of success in performing a certain process, but there are often multiple patterns of failure. For example, imagine the process of registering a web service account.The success pattern for this process is only the completion of account registration. On the other hand, there are several possible failure patterns, such as a poorly formatted email address or a password that does not match security requirements.  

In cases where there are multiple failure patterns, it is difficult to express failures using simple types. As in the case of the callback function of Node, there is a method of returning the reason for failure and the result of processing as a tuple, but expressing the reason for failure with a primitive type makes maintenance difficult later.  

One idea is to use the `type-result` and Union Type to express errors on business rules.

```typescript
abstract class AppError {
    public abstract readonly errorType: string
    public readonly message: string

    protected constructor(message: string) {
        this.message = message
    }
}

class InvalidEmailError extends AppError {
    public readonly errorType = 'InvalidEmailError'

    public static create(): InvalidEmailError {
        return new InvalidEmailError('Invalid e-mail address')
    }
}

class InvalidPasswordError extends AppError {
    public readonly errorType = 'InvalidPasswordError'

    public static create(): InvalidPasswordError {
        return new InvalidPasswordError('Invalid password')
    }
}

function registerAccount(email: string, password: string): Result<void, InvalidEmailError | InvalidPasswordError> {
    if (!validateEmail(email)) {
        return Result.fail(InvalidEmailError.create())
    }

    if (!validatePassword(email)) {
        return Result.fail(InvalidPasswordError.create())
    }

    // register user...
    return Result.ok()
}

const registerAccountResult = registerAccount('alice', 'password')

if(registerAccountResult.isFailure) {
    switch (registerAccountResult.getError().errorType) {
        case 'InvalidEmailError':
            // Email error handling
            break;
        case 'InvalidPasswordError':
            // Password error handling
            break;
    }
}
```

Inheriting the abstract error type, it expresses errors on concrete business rules in concrete form. By using a discriminant union for concrete types that represent failure, you can use the power of type inference when determining the type of an error. Depending on the IDE, the switch statement can be automatically generated.  

## TODO

* Asynchronous operation
* Pattern matching like Rust

## Lincence

[MIT License](https://github.com/dykarohora/ResultType/blob/master/LICENSE)

## Author

[@d_yama](https://twitter.com/dy_karous)  
GitHub : [dykarohora](https://github.com/dykarohora)  
blog : [D.YAMA BLOG](https://blog-mk2.d-yama7.com/)
