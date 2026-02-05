import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFilePath = join(__dirname, "../users.json");

const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeUsers = async (newUsers) => {
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(newUsers, null, 2));
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (userContent) => {
  try {
    const allUsers = (await readUsers()) || [];
    allUsers.push(userContent);
    await writeUsers(allUsers);
  } catch (error) {
    console.log(error);
  }
};

const validateUser = async (username, password) => {
  try {
    const allUsers = await readUsers();
    return allUsers.find((user) => user.username === username && user.password === password);
  } catch (error) {
    console.log(error);
  }
};

export { readUsers, writeUsers, addUser, validateUser };
