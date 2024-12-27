import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/admin.guard';
import { AdminService } from 'src/services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('details')
  @UseGuards(new RolesGuard('admin')) // Require 'admin' role for this route
  async getChatDetails() {
    return await this.adminService.getChatDetails();
  }
}
