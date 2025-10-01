import "dotenv/config";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { Agent, Memory, VoltAgent, VoltOpsClient } from "@voltagent/core";
import { LibSQLMemoryAdapter } from "@voltagent/libsql";
import { createPinoLogger } from "@voltagent/logger";
import { honoServer } from "@voltagent/server-hono";
import { weatherTool } from "./tools";

const logger = createPinoLogger({
	name: "agent",
	level: "info",
});

const memory = new Memory({
	storage: new LibSQLMemoryAdapter({
		url: "file:./.voltagent/memory.db",
		logger: logger.child({ component: "libsql" }),
	}),
});

export const bedrock = createAmazonBedrock({
	region: "eu-north-1",
	credentialProvider: fromNodeProviderChain(),
});

export const model = bedrock("eu.anthropic.claude-sonnet-4-5-20250929-v1:0");

const memeAgent = new Agent({
	name: "meme",
	instructions:
		"You are a funny agent who only answers in memes, regardless of what question you are given, return a meme.",
	model,
	memory,
});

const weatherAgent = new Agent({
	name: "weather",
	instructions: "You are a helpful agent that provides weather information.",
	model,
	tools: [weatherTool],
	memory,
});

const agent = new Agent({
	name: "supervisor",
	instructions: `You are a super agent that can delegate tasks to sub-agents.
You have access to a weather agent and a meme agent. Use the weather agent to get weather information and the meme agent to respond with memes.`,
	model,
	subAgents: [memeAgent, weatherAgent],
	memory,
});

new VoltAgent({
	agents: {
		agent,
	},
	server: honoServer(),
	logger,
	voltOpsClient: new VoltOpsClient({
		publicKey: process.env.VOLTAGENT_PUBLIC_KEY || "",
		secretKey: process.env.VOLTAGENT_SECRET_KEY || "",
	}),
});
