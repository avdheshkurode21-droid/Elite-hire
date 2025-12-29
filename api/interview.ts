const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
  context.res = {
    status: 500,
    body: { error: "Gemini key missing" }
  };
  return;
}

