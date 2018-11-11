function dateParse(data) {
    let date = new Date(data)
    let hours = (date.getHours()+1).toString().padStart('2', 0)
    let minutes = date.getMinutes().toString().padStart('2', 0)
    return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${hours}:${minutes}`
}
export {
    dateParse
}