import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { queuePostSafly } from "./eventQueue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const postsFilePath = join(__dirname, "../Posts.json");

export const readPosts = async () => {
  try {
    const data = await fs.readFile(postsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

export const writePosts = async (newPost) => {
  try {
    await fs.writeFile(postsFilePath, JSON.stringify(newPost, null, 2));
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async (postContent) => {
  try {
    await queuePostSafly(async () => {
      const allPosts = (await readPosts()) || [];
      allPosts.push(postContent);
      await writePosts(allPosts);
    });
  } catch (error) {
    console.log(error);
  }
};
