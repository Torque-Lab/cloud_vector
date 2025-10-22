import { Router } from "express";
import { createVm,deleteVm,getAllVm,getVm,updateVm } from "../../controller/infra/virtual_machine.controller";
const router=Router()

router.post("/vm-create",createVm)
router.get("/all-vm",getAllVm)
router.get("/vm-get/:vmId",getVm)
router.patch("/vm-update/:vmId",updateVm)
router.delete("/vm-delete/:vmId",deleteVm)

export default router
