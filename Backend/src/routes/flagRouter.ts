import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar flag' }
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id/status', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateFlagStatusInput' } }
  // #swagger.responses[200] = { description: 'Status flag ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return flagController.updateFlagStatus(req, res);
});

export { flagRouter };