import { initTypeOrm } from '../../src/bootstrap/initTypeOrm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EventEntity } from '../../src/entities/EventEntity';

// Mocking DataSource
jest.mock('typeorm', () => {
    const mockDataSource = jest.fn();
    mockDataSource.prototype.initialize = jest.fn();
    const MockPrimaryGeneratedColumn = jest.fn();
    const MockBaseEntity = jest.fn();
    const MockColumn = jest.fn();
    const MockEntity = jest.fn();
    return {
      DataSource: mockDataSource,
      BaseEntity: MockBaseEntity,
      PrimaryGeneratedColumn: MockPrimaryGeneratedColumn,
      Column: MockColumn,
      Entity: MockEntity
    };
  });
// Mocking EventEntity
jest.mock('../../src/entities/EventEntity');

describe('initTypeOrm', () => {
  it('should initialize DataSource with correct configuration', async () => {
    // Mock process.env.DATABASE_URL
    process.env.DATABASE_URL = 'your-database-url';

    await initTypeOrm();

    // Assert DataSource is initialized with correct configuration
    expect(DataSource).toHaveBeenCalledWith({
      entities: [EventEntity],
      url: process.env.DATABASE_URL,
      synchronize: true,
      type: 'postgres',
      logging: true,
    });

    // Assert DataSource is initialized
    const dataSourceInstance = new DataSource({} as DataSourceOptions);
    expect(dataSourceInstance.initialize).toHaveBeenCalled();

    // Reset process.env.DATABASE_URL after the test
    delete process.env.DATABASE_URL;
  });

  it('should log "DB connected!" when initialization succeeds', async () => {
    // Mock console.log
    const consoleLogSpy = jest.spyOn(console, 'log');

    await initTypeOrm();

    // Assert "DB connected!" is logged
    expect(consoleLogSpy).toHaveBeenCalledWith('DB connected!');

    // Restore console.log after the test
    consoleLogSpy.mockRestore();
  });

  it('should throw an error and log it when initialization fails', async () => {
    // Mock console.error
    const consoleErrorSpy = jest.spyOn(console, 'error');

    // Mock DataSource initialize method to throw an error
    const initializeMock = jest.fn().mockRejectedValueOnce(new Error('Initialization error'));
    DataSource.prototype.initialize = initializeMock;

    // Execute initTypeOrm
    await expect(initTypeOrm()).rejects.toThrow('Initialization error');

    // Assert error is logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error during DB initialization', expect.any(Error));

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });
});