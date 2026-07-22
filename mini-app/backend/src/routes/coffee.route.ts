
import { getCoffees } from "../controllers/coffee.controller";
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { importCoffee } from "../controllers/coffee.controller";

const router = Router();

router.post(
    "/coffees/import",
    authenticate,
    importCoffee
)
router.get(
    "/coffees",
    authenticate,
    getCoffees
);;

export default router;
