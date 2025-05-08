import { DocumentReference, Timestamp } from "firebase/firestore";
import { User } from "./user.model";
import { Customer } from "./customer.model";

export interface Service {
  id?: string;
  date: Timestamp;
  description: string;
  type: string;
  status: string;
  comments: string;
  refOperator: DocumentReference<User>;
  refCustomer: DocumentReference<Customer>;
}
