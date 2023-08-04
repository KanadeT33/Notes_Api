import { Category } from "src/categories/entities/category.entity";
import { Users } from "src/users/entities/user.entity";

export class CreateNoteDto {
  id: number;
  title: string;
  content: string;
  categories: Category[];
  user: Users;
}
