export class Storage {
    constructor(namespace) {
        this.localStorage = window.localStorage
        this.namespace = namespace || 'bbf20'
        this.isSupported = this.testLocalStorage()
    }

    testLocalStorage() {
        this.isSupported = true
        try {
            this.set('test', '1')
            this.remove('test')
            return true
        } catch (error) {
            return false
        }
    }

    set(key, val) {
        if (this.isSupported) this.localStorage.setItem(`${this.namespace}-${key}`, val)
        return true
    }

    get(key) {
        if (!this.isSupported) return null
        const value = this.localStorage.getItem(`${this.namespace}-${key}`)
        return value
    }

    remove(key) {
        if (!this.isSupported) return false
        this.localStorage.removeItem(`${this.namespace}-${key}`)
        return true
    }
}
