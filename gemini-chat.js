import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout, // Fix: corrected from 'out' to 'output'
});

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [], // start with an empty history
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  async function askAndRespond() {
    rl.question("You: ", async (msg) => {
      if (msg.toLowerCase() === "exit") {
        rl.close();
      } else {
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = await response.text();
        console.log("AI: ", text);
        askAndRespond(); // Continue the conversation loop
      }
    });
  }

  askAndRespond(); // Start the conversation loop
}

run();
