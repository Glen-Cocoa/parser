const fs = require('fs')
const path = require('path')

const [,, oldFile, newFile] = process.argv

const readPath =  path.join(__dirname, oldFile || 'sample.txt')
const writePath = path.join(__dirname, newFile || 'new.txt')
const encoding = 'utf-8'

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

const readText = (path) => {
    try {
        return fs.readFileSync(path, encoding)
    } catch (e) {
        console.error(e)
    }
}

const writeText = (text) => {
    try{
        fs.writeFileSync(writePath, text)
    } catch (e) {
        console.error(e)
    }
}

const replace = (text) => {
    try {
        return text.replace(/(?=(\r\n ))/g, 'PLACEHOLD').replace(/(\r\n|\r|\n)/g, ' ')
    } catch (e) {
        console.error(e)
    }
}

const breakToLines = (text, lineLength=80) => {
    let wordArr = text.split(' ').filter( entry => entry !== '')
    let line = ''
    let result = []
    let cursor=wordArr[0]

    for(let i=1; i <= wordArr.length; i++){
        if(line.length + cursor.length >= 80){
            result.push(line)
            line = ''
        }
        line += ` ${ cursor}`
        cursor=wordArr[i]
    }
    result.push(line)
    
    return result.join('\n').replace(/(PLACEHOLD)/g, '\n\n')
}

pipe(
    readText,
    replace,
    breakToLines,
    writeText
    )(readPath)