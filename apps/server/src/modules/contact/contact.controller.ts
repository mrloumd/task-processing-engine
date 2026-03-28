import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Body() dto: ContactDto): Promise<{ message: string }> {
    await this.contactService.send(dto);
    return { message: 'Message sent successfully.' };
  }
}
