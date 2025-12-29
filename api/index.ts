import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    context.res = {
      status: 500,
      body: { error: "Gemini API key missing" }
    };
    return;
  }

  const { question } = req.body || {};

  if (!question) {
    context.res = {
      status: 400,
      body: { error: "Question required" }
    };
    return;
  }

  context.res = {
    status: 200,
    body: {
      reply: "API is working. Gemini will respond here."
    }
  };
};

export default httpTrigger;
