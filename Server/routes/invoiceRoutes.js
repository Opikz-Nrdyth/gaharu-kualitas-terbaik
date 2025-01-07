const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/", invoiceController.createInvoice);
router.put("/", invoiceController.updateInvoice);
router.delete("/All", invoiceController.deleteInvoiceAll);
router.delete("/id/:id", invoiceController.deleteInvoice);
router.get("/status/:status", invoiceController.getStatusInvoices);
router.get("/:id", invoiceController.getInvoice);
router.get("/", invoiceController.getAllInvoices);
router.get("/fake/invoice", invoiceController.getFakeInvoice);

module.exports = router;
