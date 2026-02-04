import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { ApplicationsService } from './applications.service';
import { ApplyDto } from './dto/apply.dto';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly apps: ApplicationsService) {}

  @Roles(Role.JOB_SEEKER)
  @Post('apply')
  apply(@Req() req: any, @Body() dto: ApplyDto) {
    return this.apps.apply(req.user.userId, dto.jobId);
  }

  @Get('user')
  listMine(@Req() req: any) {
    return this.apps.listForUser(req.user.userId);
  }

  @Roles(Role.COMPANY)
  @Get('company')
  listCompany(@Req() req: any) {
    return this.apps.listForCompany(req.user.userId);
  }
}
