import { eventRequest, IResp } from '@/app/api';
import { Conference, ConferencePagination, ConferenceWebsite } from '@/features/events/types';

export const getAllEvents = async (
  websiteId?: string | number,
  page?: string | null,
  keyword?: string | null,
): Promise<IResp<string | { data: Conference[]; paging: ConferencePagination; website: ConferenceWebsite[] }>> => {
  try {
    const rs = await eventRequest.getAll({ page, websiteId, keyword: keyword || '' });
    return {
      status: true,
      data: { data: rs?.data?.conferences || [], paging: rs?.data?.pagination, website: rs?.data?.websites || [] },
    };
  } catch (e: any) {
    if (e?.status === 401) {
      return { status: false, data: 'Login fail' };
    }
    return { status: false, data: 'Something went wrong' };
  }
};

export const deleteEvent = async (id: number): Promise<IResp<boolean | string>> => {
  try {
    const rs = await eventRequest.deleteById(id);
    return {
      status: rs?.success || false,
      data: rs?.success || false,
    };
  } catch (e: any) {
    if (e?.status === 401) {
      return { status: false, data: 'Login fail' };
    }
    return { status: false, data: 'Something went wrong' };
  }
};
