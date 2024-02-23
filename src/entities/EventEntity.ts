import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EventEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ type: 'timestamp' })
    startDate: Date

    @Column({ type: 'timestamp' })
    endDate: Date

    static async findByDateRange(startDate: Date, endDate: Date): Promise<EventEntity[]> {
        return this.createQueryBuilder("event")
            .where("event.startDate >= :startDate", { startDate })
            .andWhere("event.endDate <= :endDate", { endDate })
            .getMany();
    }

    static async findOverlapEvents(startDate: Date): Promise<EventEntity[]> {
        return this.createQueryBuilder("event")
            .where("event.endDate >= :startDate AND event.startDate <= :startDate", { startDate })
            .getMany()
    }
}