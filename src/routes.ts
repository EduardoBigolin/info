import { Router } from "express";
import { CreateUserController } from "./controllers/create-user.controller";
import { upload } from "./utils/uploadImage";

const routes = Router();

routes.get("/", (req, res) => {
    return res.json({
        message: "Welcome to my API"
    })
})
routes.post("/createUser", upload.single('photo'), CreateUserController.execute)



export default routes;
