import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { salesTransactionService } from '../services/salesTransactionService.js';
import { createApiResponse } from '../utils/index.js';

export class SalesTransactionController {
  static async list(req: Request, res: Response) {
    try {
      const { status, salesperson, vehicle, search, from, to } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 25;
  const listParams: any = { page, limit };
  if (status) listParams.status = status;
  if (salesperson) listParams.salesperson = salesperson;
  if (vehicle) listParams.vehicle = vehicle;
  if (search) listParams.search = search;
  if (from) listParams.from = new Date(from as string);
  if (to) listParams.to = new Date(to as string);
  const result = await salesTransactionService.list(listParams);
      res.json(createApiResponse(true, 'Sales transactions retrieved', result));
  return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to list sales transactions', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const doc = await salesTransactionService.getById(req.params.id);
  if (!doc) { res.status(404).json(createApiResponse(false, 'Sale not found')); return; }
  res.json(createApiResponse(true, 'Sale retrieved', doc));
  return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to get sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json(createApiResponse(false, 'Validation failed', null, errors.array().map(e => `${(e as any).param}: ${e.msg}`).join(', '))); return; }
      const doc = await salesTransactionService.create(req.body);
  res.status(201).json(createApiResponse(true, 'Sale created', doc)); return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to create sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json(createApiResponse(false, 'Validation failed', null, errors.array().map(e => `${(e as any).param}: ${e.msg}`).join(', '))); return; }
      const doc = await salesTransactionService.update(req.params.id, req.body);
  if (!doc) { res.status(404).json(createApiResponse(false, 'Sale not found')); return; }
  res.json(createApiResponse(true, 'Sale updated', doc)); return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to update sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async complete(req: Request, res: Response) {
    try {
      const doc = await salesTransactionService.markCompleted(req.params.id);
  if (!doc) { res.status(404).json(createApiResponse(false, 'Sale not found')); return; }
  res.json(createApiResponse(true, 'Sale completed', doc)); return;
    } catch (err) {
      res.status(400).json(createApiResponse(false, 'Failed to complete sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async cancel(req: Request, res: Response) {
    try {
      const doc = await salesTransactionService.markCancelled(req.params.id);
  if (!doc) { res.status(404).json(createApiResponse(false, 'Sale not found')); return; }
  res.json(createApiResponse(true, 'Sale cancelled', doc)); return;
    } catch (err) {
      res.status(400).json(createApiResponse(false, 'Failed to cancel sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      const doc = await salesTransactionService.remove(req.params.id);
  if (!doc) { res.status(404).json(createApiResponse(false, 'Sale not found or not deletable')); return; }
  res.json(createApiResponse(true, 'Sale deleted', { id: req.params.id })); return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to delete sale', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }

  static async summary(req: Request, res: Response) {
    try {
      const { from, to, salesperson } = req.query;
  const summaryParams: any = {};
  if (from) summaryParams.from = new Date(from as string);
  if (to) summaryParams.to = new Date(to as string);
  if (salesperson) summaryParams.salesperson = salesperson;
  const data = await salesTransactionService.summary(summaryParams);
  res.json(createApiResponse(true, 'Sales summary', data)); return;
    } catch (err) {
      res.status(500).json(createApiResponse(false, 'Failed to get summary', null, err instanceof Error ? err.message : 'Error'));
  return;
    }
  }
}
