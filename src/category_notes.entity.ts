import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './categories/entities/category.entity';
import { Note } from './notes/entities/note.entity';


@Entity()
export class CategoryNote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Note, (note) => note.category, { onDelete: 'CASCADE' })
  @JoinColumn()
  note: Note;

  @ManyToOne(() => Category, (category) => category.note, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category;
}