import { Note } from "src/notes/entities/note.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @ManyToMany(() => Note, (note) => note.category,{nullable: false})
    note: Note

}
