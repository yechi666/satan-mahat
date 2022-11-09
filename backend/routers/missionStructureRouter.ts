import { Request, Response, Router } from 'express';
import service from '../services/missionStructureService';

const router = Router();

router.get('/:groupName/all', async (req: Request, res: Response) => {
  try {
    res.json(await service.getGroupMissionStructure(req.params.groupName));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:groupName/:type', async (req: Request, res: Response) => {
  try {
    res.json(
      await service.getGroupMissionStructureByType(
        req.params.groupName,
        req.params.type
      )
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName', async (req: Request, res: Response) => {
  try {
    await service.addMissionStructureToGroup(req.params.groupName, req.body);
    res.json('המשימה נוספה לקבוצה בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
