import { Subscriber } from '@project/shared/app/types';
import { NewsletterDto } from '../dto/newsletter.dto';
import dayjs from 'dayjs';

export const getNewPublic = (
  { publics, id }: NewsletterDto,
  { dateNotify }: Subscriber
) => {
  const result = publics.filter(
    (publication) =>
      publication.userId !== id &&
      dayjs(publication.createAt).isAfter(dateNotify)
  );

  return result;
};
