import mongoose from 'mongoose';
type questionType = 'multiple' | 'boolean' | 'integer';

interface Question {
  question: string;
  correctAnswers: [];
  incorrectAnswers?: [];
  marks: string;
  type: questionType;
}

/* Required using mongo hook with TS */
interface IExam extends mongoose.Document {
  name: string;
  maxMarks: string;
  marksObtained?: string;
  questions: [Question];
  start: Date;
  end: Date;
  subject: {
    type: mongoose.Schema.Types.ObjectId;
    ref: 'Subject';
    required: true;
  };
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Subject';
      required: true;
    }
  ];
}

const examSchema = new mongoose.Schema<IExam>({
  maxMarks: {
    required: true,
    type: String,
  },
  marksObtained: {
    // required: true,
    type: String,
  },
  /*
   * MCQ
   * Single integer type
   * One line ()
   */
  questions: {
    required: true,
    type: [
      {
        question: String,
        correctAnswers: [],
        incorrectAnswers: [],
        mark: String,
        type: String,
      },
    ],
  },
  name: {
    required: true,
    type: String,
  },
  start: {
    type: Date,
    required: true,
    // default: () => Date.now(),
  },
  end: {
    type: Date,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  },
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
