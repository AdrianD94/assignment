import { Get, Param, Post, Body, Put, Delete, JsonController, OnUndefined, QueryParam } from "routing-controllers";
import { CreateEventDto } from "./dtos/CreateEventDto";
import { Service } from "typedi";
import { EventService } from "../services/EventService";

@JsonController()
@Service()
export class EventController {
    constructor(private eventService: EventService) { }
    @Get('/events')
    getAll(@QueryParam('startDate') startDate: Date, @QueryParam('endDate') endDate: Date) {
        return this.eventService.getEventsBetweenDates(startDate, endDate);
    }

    @OnUndefined(201)
    @Post('/event')
    public async post(@Body() event: CreateEventDto) {
        await this.eventService.save(event);
    }

    @Put('/event/:id')
    @OnUndefined(204)
    put(@Param('id') id: number, @Body() event: Partial<CreateEventDto>) {
        return this.eventService.updateEvent(id, event);
    }

    @Delete('/event/:id')
    @OnUndefined(204)
    async remove(@Param('id') id: number): Promise<void> {
        return this.eventService.deleteEvents(id);
    }
}