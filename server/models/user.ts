import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/* Required using mongo hook with TS */
export interface IUser extends mongoose.Document {
  email: string;
  name?: string;
  password: string;
  profileImageURL?: string;
  roles: Array<string>;
  /* A teacher may have more than one batch */
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Batch';
    }
  ];
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Subject';
    }
  ];
  // upcomingExams: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId;
  //     ref: 'Exam';
  //   }
  // ];
}

// User -> Subject -> Exam

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    dropDups: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  profileImageURL: {
    type: String,
  },
  roles: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
  },
  batches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      // unique: true,
    },
  ],
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  // upcomingExams: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Exam',
  //   },
  // ],
});

function arrayLimit(val: Array<any>) {
  return val.length <= 3;
}

userSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;

    /* Since it is asynchronous, we need to specify when to move on */
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword, next) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// User.updateMany(
//   {
//     _id: {
//       $in: [],
//     },
//   },
//   {
//     $addToSet: { upcomingExams: new User() },
//   }
// );
