const fs=require('fs');
const ytdl=require('ytdl-core');
const url="https://www.youtube.com/watch?v=zYlS_PEJ7Zw";
const urls=[
    "https://www.youtube.com/watch?v=zYlS_PEJ7Zw",
    "https://www.youtube.com/watch?v=Src4T1uNI7w",
    "https://www.youtube.com/watch?v=1AYs9qwGuXc",
    "https://www.youtube.com/watch?v=4vO8l2YVcE0"
]
//console.log("test");
// ytdl.getBasicInfo(url).then(info=>{

//     console.log(JSON.stringify(info,null," "))
// })tdl.getBasicInfo(url).then(info=>{

//     console.log(JSON.stringify(info,null," "))
// })
async function printInfoFromUrls(){

    urls.forEach(async url=>
        console.log(JSON.stringify(await getInfo(url)))
        );
}

async function getInfo(url){
    let info=await ytdl.getBasicInfo(url);
    let result={
        formats:info.fmt_list,
        title:info.title,
        thumbnail:info.thumbnail_url,
    }
    // console.log(result)
    return result;
}
printInfoFromUrls();
let s=ytdl(urls[1],{quality:18})
s.on("info",(info)=>{
    console.log("<>Info event",info,s.videoInfo,s.videoFormat)
})

s.on("response",(r)=>{
    console.log("<>Response",r);
})
// s.on("progress",(a,b,c)=>
// console.log("<>PROG",a,b,c));
// s.on("data",(chunk)=>{
    // console.log("DATA",chunk.length);
// })

//.pipe(fs.createWriteStream('video.mp4'))