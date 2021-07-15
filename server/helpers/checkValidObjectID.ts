import mongoose from 'mongoose';

export function checkValidObjectId(idOrIds: string | Array<string>) {
  if (typeof idOrIds == 'string') return mongoose.isValidObjectId(idOrIds);

  return idOrIds.every(id => mongoose.isValidObjectId(id));
}
