import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';

const auditRouter = Router();
const auditController = new AuditController();

auditRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  return auditController.getAuditLogs(req, res);
});

auditRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAuditInput' } }
  // #swagger.responses[201] = { description: 'Audit log dicatat' }
  return auditController.createAuditLog(req, res);
});

export { auditRouter };