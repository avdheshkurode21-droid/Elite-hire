import express from "express";
import { TableClient } from "@azure/data-tables";

const app = express();
app.use(express.json());

const tableClient = TableClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING,
  "Assessments"
);

app.post("/save", async (req, res) => {
  const { name, score } = req.body;

  await tableClient.createEntity({
    partitionKey: "users",
    rowKey: Date.now().toString(),
    name,
    score
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("API running"));
