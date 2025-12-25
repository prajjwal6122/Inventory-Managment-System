const express = require('express');
const router = express.Router();

const { getProducts, getLedger } = require('../controllers/productController');
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const { produceEvent } = require("../kafka/producer");
const productController = require("../controllers/productController");
const ledgerController = require("../controllers/ledgerController");
const eventController = require("../controllers/eventController");
const auditController = require("../controllers/auditController");
const authController = require("../controllers/authController");

// Auth
router.post("/auth/login", authController.login);

// Protected endpoints
router.use(requireAuth);

// Products
router.get("/products", requireAuth, productController.getProducts);
router.get("/products/:id", requireAuth, productController.getProductDetail);

// Ledger
router.get("/ledger", requireAuth, ledgerController.getLedger);

// Manual events (HTTP)
router.post("/purchase", requireAuth, eventController.postPurchase);
router.post("/sale", requireAuth, eventController.postSale);

// Simulator (trigger Kafka producer)
router.post("/simulate", requireAuth, eventController.simulate);

// Audit
router.get("/batches", requireAuth, auditController.getBatches);
router.get("/sales/:id", requireAuth, auditController.getSaleDetail);
// endpoint to fire a simulator event from frontend (for convenience)

router.get("/admin", requireRole("admin"), (req, res) => {
  res.json({ data: "Admin stuff" });
});
module.exports = router;


