export interface Conference {
  id: number;
  title: string;
  description: string;
  date: string;
  notificationDate: string;
  deadline: string;
  location: string;
  website: string;
  createdDate: string;
}
export interface ConferencePagination {
  currentPage: number;
  itemPerPage: number;
  page: number;
}

export interface ConferenceWebsite {
  id: number;
  name: string;
}
