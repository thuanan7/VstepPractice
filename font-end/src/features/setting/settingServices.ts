import { settingRequest } from '@/app/api';

export const changeAutoJob = async (status: boolean) => {
  try {
    const data = await settingRequest.changeStatusAutoRun(status);
    return data?.success || false;
  } catch (e) {
    return false;
  }
};
