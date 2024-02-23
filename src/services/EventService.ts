import { add } from "date-fns";
import { CreateEventDto } from "../controllers/dtos/CreateEventDto";
import { EventEntity } from "../entities/EventEntity";
import { Service } from "typedi";
import { BadRequestError, NotFoundError } from "routing-controllers";

@Service()
export class EventService {
    constructor() {

    }

    public async getEventsBetweenDates(startDate: Date, endDate: Date): Promise<EventEntity[]> {
        return EventEntity.findByDateRange(startDate, endDate);
    }

    public async save(eventDto: CreateEventDto): Promise<undefined> {
        const endDate = add(eventDto.startDate, { [eventDto.duration.timeUnit]: eventDto.duration.value })
        const event = EventEntity.create({ title: eventDto.title, startDate: new Date(eventDto.startDate), endDate });

        const overlapEvents = await this.getOverlapEvents(event.startDate);

        if (overlapEvents.length > 0 && !eventDto.force) {
            throw new BadRequestError(`event with startDate ${event.startDate} - endDate ${event.endDate} overlaps with other event`)
        }

        if (overlapEvents.length > 0 && eventDto.force) {
            // delete all overlap event to allow the force override
            await Promise.all(overlapEvents.map(async (event) => {
                await EventEntity.remove(event);
            }));
            await event.save();
            return;
        }
        await event.save();

        return;
    }


    public async deleteEvents(id: number): Promise<void> {
        const event: EventEntity = await EventEntity.findOneBy({ id }) as EventEntity;

        if (!event) {
            throw new NotFoundError(`Event with ID ${id} not found`);
        }

        await EventEntity.remove(event);
    }

    public async updateEvent(id: number, updateEventDto: Partial<CreateEventDto>): Promise<void> {
        const event: EventEntity = await EventEntity.findOneBy({ id }) as EventEntity;

        if (!event) {
            throw new NotFoundError(`Event with ID ${id} not found`);
        }
        if (updateEventDto.startDate) {

            const overlapEvents = await this.getOverlapEvents(updateEventDto.startDate);

            if (overlapEvents.length > 0 && !updateEventDto.force) {
                throw new BadRequestError(`event with startDate ${event.startDate} - endDate ${event.endDate} overlaps with other event`)
            }

            if (overlapEvents.length > 0 && updateEventDto.force) {
                // delete all overlap event to allow the force override
                await Promise.all(overlapEvents.map(async (event) => {
                    await EventEntity.remove(event);
                }));
                await EventEntity.save({ ...event, ...updateEventDto });
                return;
            }
        }

        await EventEntity.save({ ...event, ...updateEventDto });
    }

    private async getOverlapEvents(startDate: Date): Promise<EventEntity[]> {
        return EventEntity.findOverlapEvents(startDate);
    }
}