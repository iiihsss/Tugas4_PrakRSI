import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[201] = { description: 'Like ditambahkan' }
  return likeController.addLike(req, res);
});

likeRouter.delete('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[200] = { description: 'Like dihapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return likeController.removeLike(req, res);
});

export { likeRouter };