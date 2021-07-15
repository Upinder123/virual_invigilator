import { NextFunction, Request, Response } from 'express';
import { checkValidObjectId } from '../helpers/checkValidObjectID';
const db = require('../models');

interface Question {
  type: 'multiple' | 'boolean' | 'integer' | 'many';
  statement: string;
  correct_answers: Array<string>;
  incorrect_answer: Array<string>;
  marks: number;
}

interface Params {
  name: string;
  subjectId: string;
  maxMarks: number;
  questions: Array<Question>;
  end: Date;
  start: Date;
  teachers: Array<string>;
}

export async function addExam(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name,
      subjectId,
      maxMarks,
      questions,
      start,
      end,
      teachers,
    }: Params = req.body;

    if (
      !name ||
      !subjectId ||
      !maxMarks ||
      !questions ||
      !start ||
      !end ||
      !teachers ||
      !Array.isArray(questions) ||
      !Array.isArray(teachers) ||
      !questions.length ||
      !teachers.length
    ) {
      return next({
        status: 400,
        message: 'incomplete / invalid Exam Details Provided!!!',
      });
    }

    if (!checkValidObjectId(subjectId))
      return next({
        status: 400,
        message: 'Invalid subject provided!',
      });

    const subject = await db.Subject.findOne({ _id: subjectId });

    if (!subject)
      return next({
        status: 400,
        message: 'Given subject does not exist!',
      });

    if (!subject.batches || !subject.batches.length)
      return next({
        status: 400,
        message: 'Given subject is not assigned to any batch!',
      });

    /* validate All questions */
    questions.forEach((question: Question, i: number) => {
      if (
        !question.type ||
        (question.type != 'many' &&
          (!question.incorrect_answer || !question.incorrect_answer.length)) ||
        !question.correct_answers ||
        !Array.isArray(question.correct_answers) ||
        !question.correct_answers.length ||
        !question.marks ||
        !question.statement
      )
        return next({
          status: 400,
          message: `invalid question format of question number ${i + 1}`,
        });
    });

    /*
     * Check that the batches assigned to the subject do not have exams at the same time
     * find all batches (one subject may be assigned to more than one batch according to our Schema)
     * NOTE: all subject must have batches (if they are assigned to any batch)
     * We only want names and list of exams from each batch (not users, subjects or batchStartDate )
     * Also, We want to just populate `exam` field in returned Batches (path)
     * And in returned batches, Match those exams that:
     * (start >= givenStart && start <= givenEnd) || (end >= givenStart && end <= givenEnd)
     * Basically given time-period should not collapse with one of the given time periods
     * If the returned list has length > 0, that means our exam time is clashing
     */
    const batchesHavingOtherExamsAtSameTime = await db.Batch.find(
      {
        _id: {
          $in: subject.batches,
        },
      },
      { users: 0, subjects: 0, start: 0 }
    ).populate({
      path: 'exams',
      match: {
        $or: [
          { $and: [{ start: { $gte: start } }, { start: { $lte: end } }] },
          { $and: [{ end: { $gte: start } }, { start: { $lte: end } }] },
        ],
      },
    });

    if (
      batchesHavingOtherExamsAtSameTime &&
      batchesHavingOtherExamsAtSameTime.length
    )
      return next({
        status: 400,
        message:
          'Given time interval clashed with one of the batches assigned to given subject!',
        info: { batchesHavingOtherExamsAtSameTime },
      });

    /* Get all teachers of given subject and check if these subjects are assigned to them */
    const foundTeachers = await db.User.find({
      _id: {
        $in: teachers,
      },
    });

    let teacherNotassignedToGivenSubject = false,
      teacherEmail = '',
      batchesFound: string[] = [];
    foundTeachers.forEach((teacher: any) => {
      if (
        !teacher.subjects ||
        !teacher.subjects.length ||
        !teacher.subjects.includes(subjectId)
      ) {
        teacherNotassignedToGivenSubject = true;
        teacherEmail = teacher.email;
      }
      batchesFound.push(...teacher.batches);
    });

    if (teacherNotassignedToGivenSubject)
      return next({
        status: 400,
        message: `Teacher with email ${teacherEmail} has not been assigned to the given subject!`,
      });

    /* If all the tests pass, then create a new exam */
    const newExam = await db.Exam.create(req.body);
    console.log('newExam', newExam);

    /* Add this exam to batch so that we can easily find collapsing exam schedules net time */
    await db.Batch.updateMany(
      {
        _id: {
          $in: subject.batches,
        },
      },
      {
        $addToSet: { exams: newExam._id },
      }
    );

    /* Add this exam to Subject */
    subject.exams.push(newExam);
    subject.save();

    return res.status(200).json(batchesHavingOtherExamsAtSameTime);
  } catch (e) {
    console.log(e);
    return next(e);
  }
}

export async function getUpcomingExmasOfTecher(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { teacherId } = req.params;

    if (!teacherId)
      return next({
        status: 400,
        message: 'no teacher ID provided for fetching upcoming exams',
      });

    const upcomingExams = await db.Teacher.findById(teacherId, { upcoming: 1 });
    res.status(200).json(upcomingExams);
  } catch (e) {
    console.log(e);
    return next(e);
  }
}
