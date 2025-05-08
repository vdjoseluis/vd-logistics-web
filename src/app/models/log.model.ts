import { DocumentReference, Timestamp } from "firebase/firestore";
import { User } from "./user.model";
import { Service } from "./service.model";

export interface Log {
  id?: string;
  date: Timestamp;
  action: string;
  refOperator: DocumentReference<User>;
  refService: DocumentReference<Service>;
}
