import { PrismaClient } from '@prisma/client';

const PublicUuid = {
  First: '749e2ffa-3bab-464e-b049-c82c1a434eb5',
  Second: '598b72f1-5500-44c4-8159-c0e827923312',
  Third: '4a582fd4-7167-41ce-94ac-174d990a2fb3',
  Fourth: '8a1af1cc-308f-436f-8585-9502431a6a29',
  Fifth: '75a10f99-92b1-4617-adc2-59d1316a999f',
  Sixth: 'e898ff23-8a50-46f5-a57d-67bae3c7b1f0',
} as const;

const UserId = {
  First: '658170cbb954e9f5b905ccf4',
  Second: '6581762309c030b503e30512',
};

const INIT_COUNT_VALUE = 0;

function getPublics() {
  return [
    {
      publicId: PublicUuid.First,
      userId: UserId.First,

      // Repost
      isRepost: false,

      // VideoPublic
      title: 'Movie',
      video:
        'https://www.youtube.com/watch?v=2BcYD_F3QrA&list=RD2BcYD_F3QrA&start_radio=1',

      // Common
      tags: ['sing', 'movie'],

      // Counts
      commentsCount: INIT_COUNT_VALUE,
      likesCount: INIT_COUNT_VALUE,

      publicType: 'video',
      publicStatus: 'posted',
    },
    {
      publicId: PublicUuid.Second,
      userId: UserId.First,

      // Repost
      isRepost: false,

      // TextPublic
      title:
        'Выбранный нами инновационный путь не стал ограничивающим фактором',
      notice: 'Новый закон накладывает вето на детский заливистый смех',
      text: 'Безусловно, сплочённость команды профессионалов способствует повышению качества экспериментов, поражающих по своей масштабности и грандиозности.',

      // Counts
      commentsCount: INIT_COUNT_VALUE,
      likesCount: INIT_COUNT_VALUE,

      publicType: 'text',
      publicStatus: 'draft',
    },
    {
      publicId: PublicUuid.Fifth,
      userId: UserId.Second,

      // Repost
      isRepost: false,

      // PhotoPublic
      photo:
        'https://yandex.ru/images/search?text=%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%A1%D0%B2%D0%B8%D0%BD%D0%BA%D0%B0&nl=1&source=morda',

      // Counts
      commentsCount: INIT_COUNT_VALUE,
      likesCount: INIT_COUNT_VALUE,

      // Common
      tags: ['animals'],

      publicType: 'photo',
      publicStatus: 'posted',
    },
    {
      publicId: PublicUuid.Sixth,
      userId: UserId.Second,

      // Repost
      isRepost: false,

      // LinkPublic
      link: 'https://htmlacademy.ru/study',
      description: 'HTMLAcademy',

      // Counts
      commentsCount: INIT_COUNT_VALUE,
      likesCount: INIT_COUNT_VALUE,

      publicType: 'link',
      publicStatus: 'posted',
    },
    {
      publicId: PublicUuid.Fourth,
      userId: UserId.Second,

      // Repost
      isRepost: false,

      // QuotePublic
      quote:
        'Может показаться странным, но чистосердечное признание облегчает душу',
      author: 'Ильф и Петров',

      // Common
      tags: ['comics'],
      comments: [],
      likes: [{ userId: UserId.Second }],

      // Counts
      commentsCount: INIT_COUNT_VALUE,
      likesCount: INIT_COUNT_VALUE,

      publicType: 'quote',
      publicStatus: 'draft',
    },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockPublics = getPublics();
  for (const publication of mockPublics) {
    await prismaClient.public.upsert({
      where: { publicId: publication.publicId },
      update: {},
      create: {
        publicId: publication.publicId,
        userId: publication.userId,

        // Repost
        isRepost: publication.isRepost,

        // VideoPublic
        title: publication.title ? publication.title : undefined,
        video: publication.video ? publication.video : undefined,

        // TextPublic
        notice: publication.notice ? publication.notice : undefined,
        text: publication.text ? publication.text : undefined,

        // QuotePublic
        quote: publication.quote ? publication.quote : undefined,
        author: publication.author ? publication.author : undefined,

        // PhotoPublic
        photo: publication.photo ? publication.photo : undefined,

        // LinkPublic
        link: publication.link ? publication.link : undefined,
        description: publication.description
          ? publication.description
          : undefined,

        // Counts
        commentsCount: publication.commentsCount,
        likesCount: publication.likesCount,

        // Common
        tags: publication.tags ? publication.tags : undefined,
        comments: publication.comments
          ? { create: publication.comments }
          : undefined,
        likes: publication.likes ? { create: publication.likes } : undefined,

        publicType: publication.publicType,
        publicStatus: publication.publicStatus,
      },
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
