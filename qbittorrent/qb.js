import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const jar = new CookieJar();

const qb = wrapper(axios.create({
  baseURL: "http://192.168.0.90:8080",
  jar,
  withCredentials: true
}));

export async function loginQB() {
  await qb.post("/api/v2/auth/login", 
    new URLSearchParams({
      username: "admin",
      password: "z6we4dj4"
    })
  );
}

export async function addMagnet(magnet) {

  const today = new Date().toISOString().split("T")[0]; 

  await qb.post("/api/v2/torrents/add",
    new URLSearchParams({
      urls: magnet,
      category: "2tbEnglish",
      tags: `malayalam,script,${today}`
        // optional
    })
  );
}
