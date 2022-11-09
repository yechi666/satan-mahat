import { Request, Response, Router } from 'express';
import service from '../services/groupService';

const router = Router();

router.get('/all', async (_req: Request, res: Response) => {
  try {
    res.json(await service.getAll());
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/names', async (_req: Request, res: Response) => {
  try {
    res.json(await service.getAllGroupNames());
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/admin/:personalNumber', async (req: Request, res: Response) => {
  try {
    res.json(await service.getAllGroupByAdmin(req.params.personalNumber));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get(
  '/admin/:personalNumber/names',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getAllGroupNamesByAdmin(req.params.personalNumber)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.get('/name/:name', async (req: Request, res: Response) => {
  try {
    res.json(await service.getGroupByName(req.params.name));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:name', async (req: Request, res: Response) => {
  try {
    await service.addNewGroup(req.params.name);
    res.json('הקבוצה נוספה בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/', async (req: Request, res: Response) => {
  try {
    await service.addWholeGroup(req.body);
    res.json('הקבוצה נוספה בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/delete/:id', async (req: Request, res: Response) => {
  try {
    await service.deleteGroup(req.params.id);
    res.json('הקבוצה נמחקה בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
