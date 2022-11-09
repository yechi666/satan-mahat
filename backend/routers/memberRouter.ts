import { Member } from '../DALs/memberDAL';
import { Request, Response, Router } from 'express';
import service from '../services/memberService';

const router = Router();

router.get(
  '/:groupName/personalNumber/:personalNumber/reservations',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getAllReservations(req.params.groupName, req.params.personalNumber)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.delete(
  '/:groupName/personalNumber/:personalNumber/reservations',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      res.json(
        await service.deleteReservation(req.params.groupName, req.params.personalNumber, id)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.put(
  '/:groupName/personalNumber/:personalNumber/reservations',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.updateReservation(
          req.params.groupName,
          req.params.personalNumber,
          req.body
        )
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.post(
  '/:groupName/personalNumber/:personalNumber/reservations',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.addReservation(req.params.groupName, req.params.personalNumber, req.body)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.get('/:groupName/all', async (req: Request, res: Response) => {
  try {
    res.json(await service.getMembersByGroup(req.params.groupName));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get(
  '/:groupName/personalNumber/:personalNumber',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getMemberByPerNum(req.params.groupName, req.params.personalNumber)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.get('/:groupName/name/:name', async (req: Request, res: Response) => {
  try {
    res.json(await service.getMemberByName(req.params.groupName, req.params.name));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    res.json((await service.getAllMembers())[0].members);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/add', async (req: Request, res: Response) => {
  try {
    await service.addMemberToGroup(req.params.groupName, req.body);
    res.json('איש הצוות נוסף בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/remove', async (req: Request, res: Response) => {
  try {
    await service.removeMemberFromGroup(req.params.groupName as string, req.body as Member);
    res.json('איש הצוות הוסר בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
