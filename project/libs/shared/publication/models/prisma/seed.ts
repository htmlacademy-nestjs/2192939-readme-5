import { PrismaClient } from '@prisma/client';

const FIRST_PUBLIC_UUID = '749e2ffa-3bab-464e-b049-c82c1a434eb5';
const SECOND_PUBLIC_UUID = '598b72f1-5500-44c4-8159-c0e827923312';
const THIRD_PUBLIC_UUID = '4a582fd4-7167-41ce-94ac-174d990a2fb3';
const FOURTH_PUBLIC_UUID = '8a1af1cc-308f-436f-8585-9502431a6a29';
const FIFTH_PUBLIC_UUID = '75a10f99-92b1-4617-adc2-59d1316a999f';
const SIXTH_PUBLIC_UUID = 'e898ff23-8a50-46f5-a57d-67bae3c7b1f0';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getPublics() {
  return [
    {
      publicId: FIRST_PUBLIC_UUID,
      userId: FIRST_USER_ID,

      // Repost
      isRepost: false,
      originalUserId: FIRST_USER_ID,
      originalPublicId: FIRST_PUBLIC_UUID,

      // VideoPublic
      title: 'Movie',
      video:
        'https://www.youtube.com/watch?v=2BcYD_F3QrA&list=RD2BcYD_F3QrA&start_radio=1',

      // Common
      tags: ['sing', 'movie'],

      publicType: 'video',
      publicStatus: 'posted',
    },
    {
      publicId: SECOND_PUBLIC_UUID,
      userId: FIRST_USER_ID,

      // Repost
      isRepost: true,
      originalUserId: SECOND_USER_ID,
      originalPublicId: THIRD_PUBLIC_UUID,

      // TextPublic
      header:
        'Выбранный нами инновационный путь не стал ограничивающим фактором',
      notice: 'Новый закон накладывает вето на детский заливистый смех',
      text: 'Безусловно, сплочённость команды профессионалов способствует повышению качества экспериментов, поражающих по своей масштабности и грандиозности.',

      publicType: 'text',
      publicStatus: 'posted',
    },
    {
      publicId: FIFTH_PUBLIC_UUID,
      userId: SECOND_USER_ID,

      // Repost
      isRepost: false,
      originalUserId: SECOND_USER_ID,
      originalPublicId: FIFTH_PUBLIC_UUID,

      // PhotoPublic
      photo:
        'https://yandex.ru/images/search?text=%D0%9C%D0%BE%D1%80%D1%81%D0%BA%D0%B0%D1%8F%20%D0%A1%D0%B2%D0%B8%D0%BD%D0%BA%D0%B0&nl=1&source=morda',

      // Common
      tags: ['Животные'],
      comments: [
        {
          text: 'Дурное дело нехитрое: выбранный нами инновационный путь бодрит',
          userId: FIRST_USER_ID,
        },
        {
          text: 'Нет звука приятнее, чем далёкий барабанный бой',
          userId: FIRST_USER_ID,
        },
      ],
      likes: [{ userId: FIRST_USER_ID }],

      publicType: 'photo',
      publicStatus: 'posted',
    },
    {
      publicId: SIXTH_PUBLIC_UUID,
      userId: SECOND_USER_ID,

      // Repost
      isRepost: false,
      originalUserId: SECOND_USER_ID,
      originalPublicId: SIXTH_PUBLIC_UUID,

      // LinkPublic
      link: 'https://htmlacademy.ru/study',
      description: 'HTMLAcademy',

      publicType: 'link',
      publicStatus: 'posted',
    },
    {
      publicId: FOURTH_PUBLIC_UUID,
      userId: FIRST_USER_ID,

      // Repost
      isRepost: false,
      originalUserId: FIRST_USER_ID,
      originalPublicId: FOURTH_PUBLIC_UUID,

      // QuotePublic
      quote:
        'Может показаться странным, но чистосердечное признание облегчает душу',
      author: 'Ильф и Петров',

      // Common
      tags: ['Комиксы'],
      comments: [
        {
          text: 'Свободу слова не задушить, пусть даже зима близко',
          userId: SECOND_USER_ID,
        },
      ],
      likes: [{ userId: SECOND_USER_ID }],

      publicType: 'quote',
      publicStatus: 'posted',
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
        originalUserId: publication.originalPublicId,
        originalPublicId: publication.originalUserId,

        // VideoPublic
        title: publication.title ? publication.title : undefined,
        video: publication.video ? publication.video : undefined,

        // TextPublic
        header: publication.header ? publication.header : undefined,
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
