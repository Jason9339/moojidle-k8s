let nextId = 0
const subscribers = new Set()

export function onAlert(callback) {
    subscribers.add(callback)
    return () => subscribers.delete(callback)
}

export function addAlert(message, level = 'info') {
    const alert = { id: nextId++, message, level }
    subscribers.forEach(fn => fn(alert))
}
