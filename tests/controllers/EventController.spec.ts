import 'reflect-metadata';
import { EventController } from "../../src/controllers/EventController";
import { CreateEventDto } from "../../src/controllers/dtos/CreateEventDto";
import { EventService } from "../../src/services/EventService";


// Mocking EventService
jest.mock('../../src/services/EventService');

describe('EventController', () => {
    let eventController: EventController;
    let eventServiceMock: jest.Mocked<EventService>;

    beforeEach(() => {
        eventServiceMock = new EventService() as jest.Mocked<EventService>;
        eventController = new EventController(eventServiceMock);
    });

    describe('getAll', () => {
        it('should call eventService.getEventsBetweenDates with provided startDate and endDate', () => {
            const startDate = new Date('2024-02-16');
            const endDate = new Date('2024-02-17');
            eventController.getAll(startDate, endDate);

            expect(eventServiceMock.getEventsBetweenDates).toHaveBeenCalledWith(startDate, endDate);
        });
    });

    describe('post', () => {
        it('should call eventService.save with the provided event', async () => {
            const createEventDto: CreateEventDto = { duration: { timeUnit: 'weeks', value: 1 }, title: 'foo', startDate: new Date(), force: false };
            await eventController.post(createEventDto);

            expect(eventServiceMock.save).toHaveBeenCalledWith(createEventDto);
        });
    });

    describe('put', () => {
        it('should call eventService.updateEvent with the provided id and event', () => {
            const id = 1;
            const event: Partial<CreateEventDto> = { title: 'foo' };
            eventController.put(id, event);

            expect(eventServiceMock.updateEvent).toHaveBeenCalledWith(id, event);
        });
    });

    describe('remove', () => {
        it('should call eventService.deleteEvents with the provided id', async () => {
            const id = 1;
            await eventController.remove(id);

            expect(eventServiceMock.deleteEvents).toHaveBeenCalledWith(id);
        });
    });
});
