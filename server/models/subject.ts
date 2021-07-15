import mongoose from 'mongoose';

interface ISubject extends mongoose.Document {
  name: {
    type: string;
    unique: true;
  };
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Exam';
    }
  ];
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Batch';
    }
  ];
  compulsory: boolean;
}

const subjectSchema = new mongoose.Schema<ISubject>({
  name: {
    required: true,
    type: String,
    unique: true,
  },
  /* query Upcoming exams on basis of subject only */
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      // required: true,
    },
  ],
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
  ],
  compulsory: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
