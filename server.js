import { extractPage } from "./extractMagnetLink/extractMagnetLink.js";
import { movieSearchInPage } from "./movieSearchInPage.js";
import { scrapeMalayalamLinks } from "./extractHomePage.js";
import { addToTorrent } from "./addTOTorrent.js";


async function main(){
  // const movieUrl = "https://www.1tamilmv.earth/index.php?/forums/topic/196597-ochu-2023-malayalam%C2%A0true-web-dl-1080p-720p-avc-dd51-384kbps-28gb-14gb-x264-700mb-400mb-esub/";
  // await extractPage(movieUrl);
  // const url = "https://www.1tamilmv.earth/index.php?/forums/forum/36-web-hd-itunes-hd-bluray/";
  // await movieSearchInPage(url)
  console.log('process started');
 const links = await scrapeMalayalamLinks();
 for (const value of links){
  await extractPage(value)
 }
await addToTorrent();

 console.log('process completed')
}
main();