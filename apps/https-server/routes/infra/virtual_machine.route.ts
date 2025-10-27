import { Router } from "express";
import { createVm,deleteVm,getAllVm,getVm,updateVm } from "../../controller/infra/virtual_machine.controller";
import { genricRateLimiter } from "../../middlware/ratelimit.middlware";
import { authenticate } from "../../middlware/auth.middlware";
const router=Router()

router.post("/vm-create",genricRateLimiter(15, 300),authenticate,createVm)
router.get("/all-vm",genricRateLimiter(15, 300),authenticate,getAllVm)
router.get("/vm-get/:vmId",genricRateLimiter(15, 300),authenticate,getVm)
router.patch("/vm-update/:vmId",genricRateLimiter(15, 300),authenticate,updateVm)
router.delete("/vm-delete/:vmId",genricRateLimiter(15, 300),authenticate,deleteVm)

export default router
