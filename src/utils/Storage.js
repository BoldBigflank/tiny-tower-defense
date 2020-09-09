export class Storage {
    constructor(namespace) {
        this.localStorage = window.localStorage
        this.namespace = namespace || 'bbf20'
        this.isSupported = this.testLocalStorage()
    }

    testLocalStorage() {
        try {
            this.set('test', '1')
            this.remove('test')
            return true
        } catch (error) {
            return false
        }
    }

    set(key, val) {
        this.localStorage.setItem(`${this.namespace}-${key}`, val)
        return true
    }

    get(key) {
        const value = this.localStorage.getItem(`${this.namespace}-${key}`)
        return value
    }

    remove(key) {
        this.localStorage.removeItem(`${this.namespace}-${key}`)
        return true
    }
}
