import { DocumentReference, Timestamp } from "firebase/firestore";
import { User } from "./user.model";
import { Service } from "./service.model";

export interface Incident {
  id?: string;
  date: Timestamp;
  description: string;
  status: string;
  refOperator: DocumentReference<User>;
  refService: DocumentReference<Service>;
}
