import { Request, Response, Router } from 'express';
import service from '../services/missionService';

const router = Router();

router.get('/:groupName/memberName/:memberName', async (req: Request, res: Response) => {
  try {
    res.json(
      await service.getMissionsByMemberName(req.params.groupName, req.params.memberName)
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:groupName/all', async (req: Request, res: Response) => {
  try {
    res.json(await service.getGroupMissions(req.params.groupName));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get(
  '/:groupName/memberPersonalNumber/:memberPersonalNumber',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getMissionsByMemberPerNum(
          req.params.groupName,
          req.params.memberPersonalNumber
        )
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.get('/:groupName/memberName/:memberName/:type', async (req: Request, res: Response) => {
  try {
    res.json(
      await service.getMissionsByMemberNameAndType(
        req.params.groupName,
        req.params.memberName,
        req.params.type
      )
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get(
  '/:groupName/memberPersonalNumber/:memberPersonalNumber/:type',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getMissionsByMemberPerNumAndType(
          req.params.groupName,
          req.params.memberPersonalNumber,
          req.params.type
        )
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.get('/:groupName/guardings/:testName', async (req: Request, res: Response) => {
  try {
    res.json(
      await service.getGuardingsByGroupAndTest(req.params.groupName, req.params.testName)
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:groupName/guarding/time/', async (req: Request, res: Response) => {
  try {
    console.log('fdjgjfdgufdbguf');
    res.json(await service.getGuardingTimeByMembers(req.params.groupName));
  } catch (error) {
    console.log('fdsf');
  }
});

router.get(
  '/:groupName/memberAssigmentsCount/:assignment',
  async (req: Request, res: Response) => {
    try {
      res.json(
        await service.getAssignmentCountByMember(req.params.groupName, req.params.assignment)
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.put('/:groupName/schedulingGurading', async (req: Request, res: Response) => {
  try {
    res.json(await service.sendGuardings(req.body, req.params.groupName));
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/memberName/:memberName', async (req: Request, res: Response) => {
  try {
    await service.addMissionsByMemberName(
      req.params.groupName,
      req.params.memberName,
      req.body
    );
    res.json('שמירות הוספו בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/updateGuarding', async (req: Request, res: Response) => {
  try {
    await service.updateGuarding(req.body, req.params.groupName);
    res.json('שמירה שונתה בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/schedulingGurading/:groupName', async (req: Request, res: Response) => {
  try {
    await Promise.all(await service.sendGuardings(req.body, req.params.groupName));
    res.json('שמירות נשלחו בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/deleteGuarding', async (req: Request, res: Response) => {
  try {
    await service.deleteGuarding(req.body, req.params.groupName);
    res.json('שמירה התבטלה בהצלחה');
  } catch (error) {
    error.message === 'המשימה אינה קיימת'
      ? res.status(304).json({ error })
      : res.status(500).json({ error });
  }
});

router.put('/:groupName/deleteMultipleGuardings', async (req: Request, res: Response) => {
  try {
    await service.deleteMultipleGuardings(req.body, req.params.groupName);
    res.json('שמירות התבטלו בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:groupName/schedulingMissions', async (req: Request, res: Response) => {
  try {
    await service.sendMissions(req.body, req.params.groupName);
    res.json('המשימות נשלחו בהצלחה');
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:groupName/old/:firstDay', async (req: Request, res: Response) => {
  try {
    const response = await service.getOldMissions(
      req.params.groupName,
      new Date(req.params.firstDay)
    );

    res.json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:groupName/:type', async (req: Request, res: Response) => {
  try {
    res.json(await service.getGroupMissionsByType(req.params.groupName, req.params.type));
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
