import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { GoogleGenAI, Type } from "@google/genai";



export async function interview(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    context.log(`Http function processed request for url "${request.url}"`);



    try {

        const body: any = await request.json();

        const { action, userData, history } = body;



        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });



        if (action === 'generateQuestion') {

            const model = "gemini-3-flash-preview";

            const historyText = history.length > 0 

                ? history.map((h: any) => `Q: ${h.question}\nA: ${h.answer}`).join('\n') 

                : "This is the start of the interview.";



            const prompt = `

                You are an expert HR interviewer for the role of ${userData.domain}.

                The candidate's name is ${userData.fullName}.

                

                Current Interview History:

                ${historyText}

                

                Based on the history and the domain, generate the NEXT professional interview question.

                If there is no history, ask an introductory technical or behavioral question related to ${userData.domain}.

                Keep the question concise and professional.

                Return ONLY the question text.

            `;



            const response = await ai.models.generateContent({ model, contents: prompt });

            return { jsonBody: { text: response.text } };

        } 



        if (action === 'evaluate') {

            const model = "gemini-3-pro-preview";

            const prompt = `

                Analyze the following interview performance for a ${userData.domain} position.

                Candidate: ${userData.fullName}

                Domain: ${userData.domain}

                Interview Transcript:

                ${history.map((h: any) => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}

                Evaluate candidate on scale 0-100. Provide recommendation ('Recommended' or 'Not Recommended') and a short summary.

                Return result in JSON format.

            `;



            const response = await ai.models.generateContent({

                model,

                contents: prompt,

                config: {

                    responseMimeType: "application/json",

                    responseSchema: {

                        type: Type.OBJECT,

                        properties: {

                            score: { type: Type.NUMBER },

                            recommendation: { type: Type.STRING },

                            summary: { type: Type.STRING }

                        },

                        required: ["score", "recommendation", "summary"]

                    }

                }

            });



            return { jsonBody: JSON.parse(response.text || "{}") };

        }



        return { status: 400, body: "Invalid action" };



    } catch (error: any) {

        context.error(error);

        return { status: 500, body: error.message };

    }

}



app.http('interview', {

    methods: ['POST'],

    authLevel: 'anonymous',

    handler: interview

});
