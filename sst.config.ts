/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "agent",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "eu-west-1",
        },
      },
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("AgentVpc", {});
    const cluster = new sst.aws.Cluster("AgentCluster", { vpc });

    const service = new sst.aws.Service("Agent", {
      cluster,
      serviceRegistry: {
        port: 3141,
      },
      permissions: [
        {
          actions: [
            "bedrock:InvokeModel",
            "bedrock:InvokeModelWithResponseStream",
          ],
          resources: ["*"],
        },
      ],
    });

    const api = new sst.aws.ApiGatewayV2("Api", { vpc });
    api.routePrivate("$default", service.nodes.cloudmapService.arn);
  },
});
