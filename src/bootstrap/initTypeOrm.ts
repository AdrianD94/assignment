import { EventEntity } from "../entities/EventEntity";
import { DataSource } from "typeorm";

export async function initTypeOrm(): Promise<void> {
    try {
        const appDataSource: DataSource = new DataSource({
            entities: [EventEntity],
            url: process.env.DATABASE_URL,
            synchronize: true,
            type: 'postgres',
            logging: true
        });

        await appDataSource.initialize();

        console.log('DB connected!');
    } catch (error) {
        console.error('Error during DB initialization', error);
        throw error;
    }
}
