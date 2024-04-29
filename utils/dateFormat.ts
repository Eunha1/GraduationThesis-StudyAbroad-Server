export const dateFormat = ()=>{
    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateFormat = `${day}-${month}-${year}`
    return dateFormat.toString();
}