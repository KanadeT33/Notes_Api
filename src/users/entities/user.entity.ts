import { Note } from "src/notes/entities/note.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string
    @Column()
    password: string
    @OneToMany(type=> Note, note=> note.user)
    note: Note[]
}
