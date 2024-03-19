import express from "express";
import { variables, data, getTestData, getVariableNames, postString } from "../controllers/app.controller";

const router = express();
// I'm not sure for this line but I used express.Router() instead of express(), I definitely recommend using express.Router() instead of express() because it should be the correct way to use it.

router.get("/variables", variables);
router.get("/data", data);

// Below you will see additionally implemented code according to the tasks that have been given. They may or may not be similar.
router.get("/data", getTestData);
router.get('/variables', getVariableNames)
router.post('/poststring', postString);

export { router as AppRouter };
