import mongoose, { Mongoose } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IBatch extends mongoose.Document {
  name: {
    type: String;
    required: true;
    unique: true;
    index: {
      unique: true;
      collation: { locale: 'en_US'; strength: 2; caseLevel: true };
    };
  };
  start: Date;
  end: Date;
  users?: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'User';
    }
  ];
  subjects?: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Subject';
    }
  ];
  exams?: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Exam';
    }
  ];
}

const batchSchema = new mongoose.Schema<IBatch>({
  name: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true,
      collation: { locale: 'en_US', strength: 2, caseLevel: true },
    },
  },
  start: {
    type: Date,
    required: true,
    default: () => Date.now(),
  },
  end: {
    type: Date,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  exams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    },
  ],
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;

// Batch.find({
//   _id: {
//     $in: [],
//   },
// })
//   .populate('exams')
//   .then((exams_: any) => {
//     console.log(exams_);
//   });
