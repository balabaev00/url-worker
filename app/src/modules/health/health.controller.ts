import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

import { PingDto } from './dto/ping.dto';

@ApiTags('Internal')
@Controller('internal')
export class HealthController {
    constructor(private health: HealthCheckService) { }

    @Get('health')
    @HealthCheck()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([]);
    }

    @Get('ping')
    @ApiOkResponse({ type: PingDto })
    pingCheck(): PingDto {
        return { ping: 'ok' };
    }
}
