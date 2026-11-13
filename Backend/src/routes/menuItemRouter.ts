import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar menu' }
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateMenuItemInput' } }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateMenuItemInput' } }
  // #swagger.responses[200] = { description: 'Menu ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };