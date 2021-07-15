# Server

## To start server 
1. `cd server`
2. Make sure dependencies are installed (Run `npm i` if not)
3. add environment variables in `/server/.env` file
4. run `npm run dev`

## Work Flow
1. Create a new batch (e.g., `D3CSE-C3`)
2. Create a new student.
3. Add a student to batch.
4. Create a new subject.
5. Add a subject to batch.
6. Assign user to a batch (*User cannot be assigned a subject unless assigned a batch *)
7. Add individual subjects to teachers, or *non-compulsory* ones to students (*Teacher should be assigned to a batch before assigning subjects. Also, Given user cannot be assigned subjects of a batch which does not belongs to her/him*).
8. Create an exam for an existing subject.
9. Show upcoming exams of a given user.
10. Show past exams of a given user.