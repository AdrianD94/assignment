import { Service } from 'typedi';
import { RRule } from 'rrule';
import { add } from 'date-fns';

import { UnitOfTime } from '../../src/controllers/dtos/CreateEventDto';
import { CreateRecurringEventDto } from '../../src/controllers/dtos/CreateRecurringEventDto';
import { EventEntity } from '../../src/entities/EventEntity';

import { EventService } from './EventService';

const mapUnitOfTimeToRule: Record<string, number> = {
  [UnitOfTime.days]: RRule.DAILY,
  [UnitOfTime.weeks]: RRule.WEEKLY,
  [UnitOfTime.months]: RRule.MONTHLY
};

@Service()
export class RecurringEventService extends EventService {
  constructor() {
    super();
  }

  public async saveRecurringEvents(event: CreateRecurringEventDto) {
    const rule = new RRule({
      freq: mapUnitOfTimeToRule[event.duration.timeUnit],
      dtstart: new Date(event.startDate),
      until: add(event.startDate, { months: 6 })
    });

    const dates = rule.all();

    await Promise.all(
      dates.map(async (date) => {
        await super.save({ duration: event.duration, startDate: date, force: event.force, title: event.title });
      })
    );
  }

  public async getRecurringEvents(): Promise<EventEntity[]> {
    const recurringEvent = await EventEntity.findRecurringEvents();
    return recurringEvent.length > 1 ? recurringEvent : [];
  }
}
