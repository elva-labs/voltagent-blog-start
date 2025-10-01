# AI Agent Starter Project

A reference implementation demonstrating how to build production-ready AI agents with autonomous task execution capabilities.

> **Note:** This project accompanies the blog article ["Robots Are Taking Our Jobs: Understanding AI Agents"](https://blog.example.com/robots-taking-jobs-ai-agents) _(coming soon)_

## What This Project Demonstrates

This starter kit shows you how to build an AI agent that:

- Executes multi-step tasks autonomously
- Uses fictional tools to retrieve information
- Maintains conversation context and memory
- Runs in a dockerized enivronment
- Uses a supervisor pattern with specific subagent for specific tasks

Built with [VoltAgent](https://voltagent.dev) and deployed using [SST](https://sst.dev), this project provides a foundation for creating your own custom agents.

## Prerequisites

- Node.js 20+
- Git
- pnpm (install with `npm install -g pnpm`)
- AWS Account (for deployment and bedrock access)

## Local Development

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd my-agent-app

# Install dependencies
pnpm install
```

### Step 2: Set up AWS Credentials

This project uses AWS and AWS Bedrock for access to an LLM.
Set up your credentials for your AWS account with access to AWS Bedrock as environment variables.

A tip, checkout [sesh](https://github.com/elva-labs/awsesh) which is an excellent tool for accessing multiple AWS accounts.

If you prefer other providers, checkout the [VoltAgent](https://voltagent.dev) docs how to reconfigure the model.

### Step 3: Run Locally

```bash
# Start development server with hot reload
pnpm dev
```

Your agent is now running at `http://localhost:3141` which exposes and API and API docs, VoltAgent comes with a really nice
console which is referenced via the termonal output to test the agents out.

### Step 4: Test Your Agent

The agent includes example tools and workflows. You can interact with it via HTTP requests or integrate it into your applications.

Example tools included:

- **Weather Tool**: Demonstrates external API integration
- **Meme agent** Which only return reponses in memes
- Custom tools can be added in `src/tools/`

## Deployment to AWS

This project uses [SST (Serverless Stack)](https://sst.dev) for deployment, which creates a serverless API running your agent.

### AWS Resources Created

The deployment uses a ECS and fargate which is a very cheap way of hosting your docker containers, but this still has a ticking cost. Make sure to tear down your stack if you are just playing around.

### Step 1: Configure AWS Credentials

Ensure you have AWS credentials configured:

```bash
# Option 1: Using AWS CLI
aws configure

# Option 2: Set environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
```

### Step 2: Deploy

```bash
# Deploy to your AWS account
pnpm sst deploy
```

The deployment will output your API endpoint URL. Your agent is now accessible via this public endpoint.

### Step 3: Remove Stack When Done

**Important:** To avoid ongoing AWS charges, remove the stack when you're finished:

```bash
# Remove all AWS resources
pnpm sst remove
```

## Extending Your Agent

### Adding Custom Tools

Create new tools in `src/tools/`:

```typescript
import { createTool } from "@voltagent/core";
import { z } from "zod";

export const myTool = createTool({
  name: "myTool",
  description: "Description of what this tool does",
  input: z.object({
    param: z.string(),
  }),
  output: z.string(),
  handler: async ({ param }) => {
    // Tool logic here
    return `Result: ${param}`;
  },
});
```

Then export it from `src/tools/index.ts` and register it in `src/index.ts`.

### Connecting to External Systems

Tools can interact with any external system:

- APIs and webhooks
- Databases
- Cloud services (S3, DynamoDB, etc.)
- Third-party integrations (Stripe, SendGrid, etc.)

See the weather tool (`src/tools/weather.ts`) for an example of external API integration.

## Docker Deployment

Alternative deployment option using Docker:

```bash
# Build image
docker build -t my-agent-app .

# Run container
docker run -p 3141:3141 --env-file .env my-agent-app
```

## Learn More

### About VoltAgent

- **Documentation**: [voltagent.dev](https://voltagent.dev)
- **Examples**: [github.com/VoltAgent/voltagent](https://github.com/VoltAgent/voltagent)
- **Community**: [VoltAgent Discord](https://s.voltagent.dev/discord)

### About SST (Serverless Stack)

- **Documentation**: [sst.dev](https://sst.dev)
- **Getting Started**: [sst.dev/docs](https://sst.dev/docs)
- **Discord Community**: [SST Discord](https://sst.dev/discord)

### Related Articles

- [Moving Past the AI Hype: Introducing MCP](https://blog.elva-group.com/moving-past-the-ai-hype-introducing-mcp)
- [Solving AI Context with MCP Servers](https://blog.elva-group.com/solving-ai-context-with-mcp-servers)

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Run production build locally
- `pnpm sst deploy` - Deploy to AWS
- `pnpm sst remove` - Remove AWS resources
