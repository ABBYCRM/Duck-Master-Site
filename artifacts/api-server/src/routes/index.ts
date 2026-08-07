import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import searchRouter from "./search";
import workspaceRouter from "./workspace";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(searchRouter);
router.use(workspaceRouter);

export default router;
