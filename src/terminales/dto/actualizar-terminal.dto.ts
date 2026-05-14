import { PartialType } from '@nestjs/mapped-types';
import { CrearTerminalDto } from './crear-terminal.dto';

export class ActualizarTerminalDto extends PartialType(CrearTerminalDto) {}
