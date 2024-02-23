import 'reflect-metadata';
import dotenv from 'dotenv';

import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

dotenv.config({});

import { createExpressServer } from 'routing-controllers';
import { EventController } from '../src/controllers/EventController';
import { initTypeOrm } from './bootstrap/initTypeOrm';
import { RecurringEventController } from './controllers/RecurringEventController';

async function init() {

    const PORT = process.env.PORT || 3000
    useContainer(Container);
    // creates express app, registers all controller routes and returns you express app instance
    const app = createExpressServer({
        controllers: [EventController, RecurringEventController], // we specify controllers we want to use
        validation: true
    });

    await initTypeOrm();
    app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
}
init();