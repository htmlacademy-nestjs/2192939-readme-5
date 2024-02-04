import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckAuthGuard } from './guards/check.auth.guard';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CreatePublicDto } from './dto/create-public.dto';
import { HttpService } from '@nestjs/axios';
import { ApplicationServiceURL } from './app.config';
import { UserIdInterceptor } from './interceptors/user-id-interceptor';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepostPublicDto } from './dto/repost-public.dto';
import { CreateCommentDto } from 'apps/publication/src/app/comment/dto/create-comment.dto';
import { LikeDto } from 'apps/publication/src/app/like/dto/like.dto';
import { UpdatePublicDto } from './dto/update-public.dto';
import { PublicQuery } from './query/public.query';
import { SearchQuery } from './query/search.query';

@ApiTags('Publics')
@ApiExtraModels(CreatePublicDto, UpdatePublicDto)
@Controller('/')
@UseFilters(AxiosExceptionFilter)
export class PublicController {
  constructor(private readonly httpService: HttpService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Publication added successfully',
  })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @Post('publics')
  public async create(@Body() dto: CreatePublicDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Public}/`,
      dto
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Publication added successfully',
  })
  @Post(`files/upload/photo`)
  @UseInterceptors(FileInterceptor('photo'))
  public async createPhotoPublication(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body('tags') tags?: string
  ) {
    const { data: photo } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Uploader}/upload/photo`,
      file,
      {
        headers: {
          'Content-Type': req.headers['content-type'],
        },
      }
    );

    const dto = { type: 'photo', photo: photo.id, tags: [] };

    if (tags) {
      dto.tags = tags.split(',');
    }
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Public}/upload/photo`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of publications is showing',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There are no posts that can be loaded',
  })
  @Get('publics/ribbon')
  public async ribbon(@Query() query: PublicQuery) {
    const { data: user } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.User}/${query.userId}`
    );
    let ribbon = [];
    const { data: subscriber } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}`,
      { params: query }
    );

    ribbon = [...subscriber.entities];

    for (const subscription of user.subscriptions) {
      query.userId = subscription;
      const { data } = await this.httpService.axiosRef.get(
        `${ApplicationServiceURL.Public}`,
        { params: query }
      );
      ribbon = [...ribbon, ...data.entities];
    }

    return ribbon;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Publication updated',
  })
  @UseGuards(CheckAuthGuard)
  @Patch(`publics/:id}`)
  public async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdatePublicDto
  ) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Public}/${id}`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Publication reposted',
  })
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(UserIdInterceptor)
  @Post(`publics/repost/:id`)
  public async repost(@Param('id') id: string, @Body() dto: RepostPublicDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Public}/repost/${id}`,
      dto
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Publication removed',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Publication is not deleted',
  })
  @UseGuards(CheckAuthGuard)
  @Delete(`publics/:id`)
  public async delete(@Param('id') id: string, @Req() req: Request) {
    await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Public}/${id}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of publications is showing',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There are no posts that can be loaded',
  })
  @Get('publics')
  public async index(@Query() query: PublicQuery) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}`,
      { params: query }
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of publications is showing',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There are no posts that can be loaded',
  })
  @Get('publics/search')
  public async searchPublicationsByTitle(@Query() query: SearchQuery) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}/search`,
      {
        params: query,
      }
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of publications is showing',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'There are no posts that can be loaded',
  })
  @UseGuards(CheckAuthGuard)
  @Get('publics/drafts/:userId')
  async showDrafts(@Param('userId') userId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}/drafts/${userId}`
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Publications sent',
  })
  @UseGuards(CheckAuthGuard)
  @Get('publics/send-news/:id/:email')
  public async sendNews(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('email') email: string
  ) {
    await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}/send-news/:id/:email`,
      { params: { id, email } }
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Publication is showing',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Publication is not found',
  })
  @Get('publics/:id')
  public async showPublicationById(@Param('id') id: string) {
    const { data: publicationData } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Public}/${id}`
    );
    return publicationData;
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Comment added successfully',
  })
  @UseGuards(CheckAuthGuard)
  @Post('publics/comments/:publicId')
  public async createComment(
    @Param('publicId') publicId: string,
    @Body() dto: CreateCommentDto
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Comment}/${publicId}`,
      dto
    );
    return data;
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All comments are shown',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Publication is not found',
  })
  @Get('publics/comments/:publicId')
  public async showCommentsByPostId(@Param('publicId') publicId: string) {
    const { data: publicComments } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Comment}/${publicId}`
    );

    return publicComments;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment removed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Comment with this id is not found',
  })
  @UseGuards(CheckAuthGuard)
  @Delete(`publics/comments/:publicId`)
  public async remove(@Param('publicId') publicId: string) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Comment}/${publicId}`
    );
    return data;
  }

  @ApiResponse({
    type: LikeDto,
    status: HttpStatus.CREATED,
    description: 'Like added successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('/publics/likes/:publicId')
  public async addLike(
    @Param('publicId') publicId: string,
    @Body() dto: LikeDto,
    @Req() req: Request
  ) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Like}/${publicId}`,
      dto,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );

    return data;
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Like has deleted now',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Publication or like not found',
  })
  @Delete('/publics/likes/:publicId/:userId')
  public async removeLike(
    @Param('publicId') publicId: string,
    @Param('userId') userId: string,
    @Req() req: Request
  ) {
    const { data } = await this.httpService.axiosRef.delete(
      `${ApplicationServiceURL.Like}/${publicId}/${userId}`,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }
}
