import { addSection } from "@/store/slices/profileSectionsSlice";
import { nanoid } from "nanoid";

export function addProfileSectionReturnId(dispatch: any, type: string, content: string) {
  const id = nanoid(8);
  dispatch(addSection({id, type, content}));
  return id;
} 