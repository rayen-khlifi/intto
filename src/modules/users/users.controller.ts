import { Body, Controller, Get, Put, Req, UseGuards,Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  async me(@Req() req: any) {
    const user = await this.users.findById(req.user.userId);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      profile: user.profile,
    };
  }

  @Put('profile')
  update(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.userId, dto);
  }
   @Delete('me')
deleteMe(@Req() req: any) {
  return this.users.deleteUser(req.user.userId);
}

}
