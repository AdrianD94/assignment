import { Get, Post, Body, JsonController, OnUndefined } from 'routing-controllers';
import { Service } from 'typedi';

import { RecurringEventService } from '../../src/services/RecurringEventService';

import { CreateEventDto } from './dtos/CreateEventDto';

@JsonController()
@Service()
export class RecurringEventController {
  constructor(private recurringEventService: RecurringEventService) {}
  @Get('/recurring-events')
  getAll() {
    return this.recurringEventService.getRecurringEvents();
  }

  @OnUndefined(201)
  @Post('/recurring-event')
  public async post(@Body() event: CreateEventDto) {
    await this.recurringEventService.saveRecurringEvents(event);
  }

  // @Put('/event/:id')
  // @OnUndefined(204)
  // put(@Param('id') id: number, @Body() event: Partial<CreateEventDto>) {
  //     return this.eventService.updateEvent(id, event);
  // }

  // @Delete('/event/:id')
  // @OnUndefined(204)
  // async remove(@Param('id') id: number): Promise<void> {
  //     return this.eventService.deleteEvents(id);
  // }
}
