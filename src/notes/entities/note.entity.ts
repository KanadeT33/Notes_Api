import * as moment from "moment";
import { Category } from "src/categories/entities/category.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    id:number
    @Column({default: moment()})
    updatedAt: Date
    @Column()
    title:string
    @Column()
    content:string
    @Column({default: false})
    archived: boolean
    @ManyToMany(() => Category, { cascade: true }) category: Category[];
    @ManyToOne(type=> Users, user => user.note)
    user:Users

}
