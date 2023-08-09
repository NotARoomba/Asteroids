import express, {Request, Response} from 'express';
import {collections} from '../services/database.service';
import Score from '../models/score';

export const scoresRouter = express.Router();

scoresRouter.use(express.json());

scoresRouter.get('/', async (req: Request, res: Response) => {
  try {
    let scores: Score[] = [];
    if (collections.scores) {
      scores = (await collections.scores.find({}).toArray()) as unknown as Score[];
    }
    res.status(200).send({scores, error: false, msg: 'Scores Exist!'});
  } catch (error) {
    res.status(500).send({error: true, msg: error});
  }
});
scoresRouter.post('/', async (req: Request, res: Response) => {
  const name = req.body.name;
  const score = req.body.score;
  const level = req.body.level;
  try {
    if (collections.scores) {
      await collections.scores.insertOne(new Score(name, level, score));
    }
    res.status(200).send({error: false, msg: 'Inserted Score!'});
  } catch (error) {
    res.status(500).send({error: true, msg: error});
  }
});
