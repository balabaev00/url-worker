import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { Params } from 'nestjs-pino';
import { LoggerOptions } from 'pino';

type LogLevel = {
    logLevel: string;
};

/**
 * Создает конфиг для PinoLogger
 * @returns Конфиг для PinoLogger
 */
export const createLoggerConfig = (configService: ConfigService): Params => {
    const stage = configService.getOrThrow('STAGE');

    return {
        pinoHttp: {
            name: configService.getOrThrow('PROJECT_NAME'),
            level: stage === 'production' ? 'info' : 'debug',
            quietReqLogger: true,
            messageKey: 'message',
            genReqId: (req: IncomingMessage): string => (req.headers['x-request-id'] as string) || randomUUID(),
            timestamp: (): string => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
            customReceivedMessage: (): string => 'request received',
            customReceivedObject: (req: IncomingMessage): unknown => ({ req }),
            redact: {
                paths: ['req.headers.authorization'],
                censor: '*SENSITIVE DATA*',
            },
            formatters,
            serializers: {
                req: (req): unknown => {
                    if (stage !== 'production') {
                        req.body = req.raw.body;
                    }

                    return req;
                },
            },
        },
        exclude: ['api/internal/health', 'api/internal/ping', 'metrics', 'internal/health', 'internal/ping'],
    };
};

const formatters: LoggerOptions['formatters'] = {
    level: (name): LogLevel => ({ logLevel: name }),
    log: ({ context, ...object }): Record<string, unknown> => {
        if (!context) {
            return object;
        }

        let newContext: string;
        try {
            if (typeof context === 'string') {
                newContext = context;
            } else {
                newContext = JSON.stringify(context);
            }
        } catch (e) {
            newContext = ['[Parsing error]', (e as Error)?.message].filter(Boolean).join(' ');
        }

        return {
            ...object,
            context: newContext,
        };
    },
};
