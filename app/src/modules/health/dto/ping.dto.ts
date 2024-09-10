import { Expose } from 'class-transformer';

export class PingDto {
    @Expose()
    ping: string = 'ok';
}
