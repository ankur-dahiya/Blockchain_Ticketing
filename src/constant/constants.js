import "dotenv/config";
export default class Constants{
    static PORT = process.env.PORT;
    static DB_URL = process.env.DB_URL;
    static OWNER_ADDR = process.env.OWNER_ADDR;
    static OWNER_PVT_KEY = process.env.OWNER_PVT_KEY;
    static JWT_SECRET = process.env.JWT_SECRET;
}