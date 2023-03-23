import express from "express";
import routes from "./routes";


const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.listen(3000, () => {
    console.log(`
        [HTTP] your app is listen at http://localhost:3000
    `);

})
