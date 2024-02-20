import { SchemaFieldTypes, createClient } from "redis";
import express, { Request, Response } from "express";
import cors from "cors";
// const client = createClient({
//   password: "UJEa9OT3p9mbHjHhBtMGFkzJioms8BU1",
//   socket: {
//     host: "redis-18451.c281.us-east-1-2.ec2.cloud.redislabs.com",
//     port: 18451,
//   },
// });

const client = createClient();

// const main = async () => {
//   await client.connect();

//   try {
//     // await client.ft.create(
//     //   "idx:notes",
//     //   {
//     //     "$.title": {
//     //       type: SchemaFieldTypes.TEXT,
//     //       SORTABLE: true,
//     //     },
//     //     "$.content": {
//     //       type: SchemaFieldTypes.TEXT,
//     //       AS: "content",
//     //     },
//     //   },
//     //   {
//     //     ON: "JSON",
//     //     PREFIX: "note:",
//     //   }
//     // );

//     // await client.ft.create(
//     //   "idx:blocks",
//     //   {
//     //     "$.type": {
//     //       type: SchemaFieldTypes.TEXT,
//     //       SORTABLE: true,
//     //     },
//     //     "$.text": {
//     //       type: SchemaFieldTypes.TEXT,
//     //       AS: "content",
//     //     },
//     //   },
//     //   {
//     //     ON: "JSON",
//     //     PREFIX: "note:",
//     //   }
//     // );

//     // await client.json.set("note:4", "$", {
//     //   title: "Daily Report",
//     //   content: JSON.stringify({
//     //     data: {
//     //       items: ["foo", "@bar", "baz"],
//     //       type: "list",
//     //     },
//     //   }),
//     // });

//     // await Promise.all([
//     //   client.json.set("note:1", "$", {
//     //     title: "Daily Report",
//     //     content: "This is the content about the daily report",
//     //   }),
//     //   client.json.set("note:2", "$", {
//     //     title: "Regular Summary",
//     //     content: "It was okay, nothing special",
//     //   }),
//     // ]);

//     let result = await client.ft.search("idx:notes", "@bar");
//     console.log(JSON.stringify(result, null, 2));
//     process.exit(1);
//   } catch (e: any) {
//     if (e.message === "Index already exists") {
//       console.log("Index exists already, skipped creation.");
//     } else {
//       // Something went wrong, perhaps RediSearch isn't installed...
//       console.error(e);
//       process.exit(1);
//     }
//   }
// };

// main();

const app = express();
app.use(express.json());
app.use(cors());
app.post("/notes", (req: Request, res: Response) => {
  const body = req.body;
  console.log(JSON.stringify(body, null, 2));
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
