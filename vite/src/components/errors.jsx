export class CharacterNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'CharacterNotFoundError'
    }
}

export class CharacterUndefinedError extends Error {
    constructor(message) {
        super(message)
        this.name='CharacterUndefinedError'
    }
}