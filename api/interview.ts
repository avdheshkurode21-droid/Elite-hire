
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Gutted AI implementation. The logic is now handled deterministically in the frontend 
// for maximum speed, but this endpoint is kept as a stub to prevent breaking fetch calls
// if the app is scaled to a real backend later.
export async function interview(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return { 
        status: 200, 
        jsonBody: { message: "Deterministic processing active." } 
    };
}

app.http('interview', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: interview
});
