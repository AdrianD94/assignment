import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEnum, IsInstance, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

enum UnitOfTime {
    minutes = 'minutes',
    hours = 'hours',
    days = 'days',
    weeks = 'weeks',
    months = 'months'
}

class Duration {
    @IsEnum(UnitOfTime)
    timeUnit: string;

    @IsNumber()
    @IsInt()
    value: number
}

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    title: string

    @IsDateString()
    startDate: Date

    @IsOptional()
    @IsBoolean()
    force: Boolean;

    @Type(() => Duration)
    @ValidateNested()
    @IsInstance(Duration)
    duration: Duration
}