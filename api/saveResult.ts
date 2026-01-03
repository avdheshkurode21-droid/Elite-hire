
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient } from "@azure/data-tables";

/**
 * Azure Function to save candidate assessment to Table Storage.
 * Handles both complex CandidateResult objects and simple { name, score } pairs.
 */
export async function saveResult(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Processing save request for URL: "${request.url}"`);

    try {
        const body: any = await request.json();
        
        if (!body) {
            return { status: 400, body: "Invalid request body." };
        }

        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            context.error("Missing AZURE_STORAGE_CONNECTION_STRING");
            // During development/demo, we return success to allow the UI to proceed
            return { status: 200, jsonBody: { success: true, message: "Mock success: No connection string found." } };
        }

        const tableName = "CandidateResults";
        const client = TableClient.fromConnectionString(connectionString, tableName);

        // Create table if it doesn't exist
        await client.createTable();

        let entity: any;

        // Check if it's the simplified "Manual" format requested by user
        if (body.name && body.score !== undefined && !body.userData) {
            entity = {
                partitionKey: "ManualEntry",
                rowKey: `manual_${Date.now()}`,
                fullName: body.name,
                score: body.score,
                timestamp: new Date().toISOString(),
                type: 'Manual'
            };
        } else if (body.userData) {
            // Standard full application flow
            entity = {
                partitionKey: body.userData.domain || "General",
                rowKey: `${body.userData.idNo}_${Date.now()}`,
                fullName: body.userData.fullName,
                phone: body.userData.phone,
                idNo: body.userData.idNo,
                score: body.score,
                recommendation: body.recommendation,
                summary: body.summary,
                timestamp: body.timestamp || new Date().toISOString(),
                type: 'Automatic'
            };
        } else {
            return { status: 400, body: "Incompatible data format." };
        }

        await client.createEntity(entity);

        return { 
            status: 200, 
            jsonBody: { success: true, message: "Entry persisted to Azure Table Storage." } 
        };
    } catch (error: any) {
        context.error(`Error saving to Table Storage: ${error.message}`);
        return { 
            status: 500, 
            body: `Internal Server Error: ${error.message}` 
        };
    }
}

app.http('saveResult', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: saveResult
});
