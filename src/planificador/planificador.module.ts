import { Module } from '@nestjs/common';
import { PlanificadorController } from './planificador.controller';
import { PlanificadorService } from './planificador.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlanificadorController],
  providers: [PlanificadorService],
})
export class PlanificadorModule {}
