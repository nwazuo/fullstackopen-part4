const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    if(blogs.length === 0 || !blogs) {
        return 0
    }
    return blogs.reduce((prev, cur) => {
        return (prev + cur.likes)
    }, 0)
}

const favoriteBlog = (blogs) => {
    if(!blogs || blogs.length === 0) {
        return null
    } 
    if(blogs.length === 1) return blogs[0]
    let result =  [...blogs].sort((a, b) => a.likes - b.likes)[blogs.length - 1];
    return result
}

module.exports = {
    dummy, totalLikes, favoriteBlog
}