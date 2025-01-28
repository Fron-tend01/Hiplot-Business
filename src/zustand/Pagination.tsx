
import { create } from 'zustand';


interface StoreState {
  totalPages: any;
  setTotalPages: (x: any) => void;

  page: any;
  setPage: (x: any) => void;

}

export const storePagination = create<StoreState>((set) => ({
  totalPages: [],
  setTotalPages: (x) => set({totalPages: x}),
  page: 1,
  setPage: (x) => set({page: x}),


}));

