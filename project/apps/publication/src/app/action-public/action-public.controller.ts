import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ActionPublicService } from './action-public.service';
import { CreatePublicDto } from './dto/create-dto/create-public.dto';
import { fillDto } from '@project/shared/helpers';
import { PublicRdo } from './rdo/public.rdo';
import { PublicQuery } from '../repo-public/query/public.query';
import { PublicWithPaginationRdo } from './rdo/public-with-pagination.rdo';
import { UpdatePublicDto } from './dto/update-dto/update-public.dto';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchQuery } from '../repo-public/query/search.query';
import { NotifyService } from '../notify/notify.service';
import { RepostPublicDto } from './dto/repost-dto/repost-public.dto';

@ApiTags('Publication')
@Controller('publics')
export class ActionPublicController {
  constructor(
    private readonly actionPublicService: ActionPublicService,
    private readonly notifyService: NotifyService
  ) {}

  @ApiResponse({
    type: PublicRdo,
    status: HttpStatus.OK,
    description: 'Publication created',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @Post('/')
  public async create(@Body() dto: CreatePublicDto) {
    const newPublic = await this.actionPublicService.createPublic(dto);

    return fillDto(PublicRdo, newPublic.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Publications sent',
  })
  @Get('send-news/:userId/:email')
  public async sendNews(
    @Param('userId') userId: string,
    @Param('email') email: string
  ) {
    const publics = await this.actionPublicService.getPublicsForSend();

    return this.notifyService.sendNewsletter({
      email,
      publics,
      id: userId,
    });
  }

  @ApiResponse({
    type: PublicRdo,
    status: HttpStatus.OK,
    description: 'Publications found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Get('/drafts/:userId')
  public async drafts(@Param('userId') userId: string) {
    const result = this.actionPublicService.getDrafts(userId);
    return fillDto(PublicRdo, result);
  }

  @ApiResponse({
    type: PublicWithPaginationRdo,
    status: HttpStatus.OK,
    description: 'Publications found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Get('/search')
  public async indexByTitle(@Query() query: SearchQuery) {
    const results = await this.actionPublicService.searchByTitle(query);
    return fillDto(PublicRdo, results);
  }

  @ApiResponse({
    type: PublicRdo,
    status: HttpStatus.OK,
    description: 'Publication reposted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  // @UseGuards(JwtAuthGuard)
  @Post('/repost/:publicId')
  public async repost(
    @Param('publicId') publicId: string,
    @Body() dto: RepostPublicDto
  ) {
    const userId = dto.userId;
    const repostPublic = await this.actionPublicService.createRepost(
      publicId,
      userId
    );
    return fillDto(PublicRdo, repostPublic.toPOJO());
  }

  @ApiResponse({
    type: PublicRdo,
    status: HttpStatus.OK,
    description: 'Publication found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Publication not found',
  })
  @Get('/:id')
  public async show(@Param('id') id: string) {
    const existPublic = await this.actionPublicService.getPublic(id);

    return fillDto(PublicRdo, existPublic.toPOJO());
  }

  @ApiResponse({
    type: PublicWithPaginationRdo,
    status: HttpStatus.OK,
    description: 'Publications found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Get('/')
  public async index(@Query() query: PublicQuery) {
    const publicsWithPagination = await this.actionPublicService.getPublics(
      query
    );

    const result = {
      ...publicsWithPagination,
      entities: publicsWithPagination.entities.map((items) => items.toPOJO()),
    };

    return fillDto(PublicWithPaginationRdo, result);
  }

  @ApiResponse({
    type: PublicRdo,
    status: HttpStatus.OK,
    description: 'Publication changed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Patch('/:id')
  public async changePublic(
    @Param('id') id: string,
    @Body() dto: UpdatePublicDto
  ) {
    const updatePublic = await this.actionPublicService.changePublic(id, dto);

    return fillDto(PublicRdo, updatePublic.toPOJO());
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Publication deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.actionPublicService.remove(id);
  }
}
