export default interface CustomError extends Error {
  status?: number;
  // For some additional info required to be sent to the client
  info?: string;
}
