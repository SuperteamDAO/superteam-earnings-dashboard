const overflowText = (str, limit) => {
    if (!str) {
        return ""
    }
    if (str.length < limit) {
        return str
    }
    return str.slice(0, limit) + '...'
}

export default overflowText