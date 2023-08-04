
import { Users } from 'src/users/entities/user.entity';

export class UpdateNoteDto {
    id: number;
    title: string;
    content: string;
    categories: string;
    user: Users;
  }
