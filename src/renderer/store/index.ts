import { create } from 'zustand';

interface UserAction {
  windowFixed: boolean;
  setWindowFixed: (open: boolean) => void;
}

export type DataRecord = {
  text: string;
  createTime: number;
  id: string;
};

interface Datasource {
  records: DataRecord[];
  addRecord: (text: string) => void;
  deleteRecord: (id?: string) => void;

  selectedRecordId: string;
  setSelectedRecordId: (id: string) => void;

  search: string;
  setSearchValue: (search: string) => void;
}

export const useDatasource = create<Datasource>((set) => ({
  records: [],
  selectedRecordId: '',
  setSelectedRecordId: (id: string) => set({ selectedRecordId: id }),
  addRecord: (text: string) => {
    const createTime = new Date().valueOf();
    const id = `${createTime}`;
    set((state) => ({
      records: [
        {
          text,
          createTime,
          id,
        },
        ...state.records,
      ],
      selectedRecordId: id,
    }));
  },
  deleteRecord: (id) =>
    set((state: any) => {
      const newRecords = id
        ? state.records.filter((record: any) => record.id !== id)
        : [];

      return {
        records: newRecords,
        selectedRecordId: newRecords[0]?.id || '',
      };
    }),

  search: '',
  setSearchValue: (search: string) => set({ search }),
}));

export const useUserActions = create<UserAction>((set) => ({
  windowFixed: false,
  setWindowFixed: (open) => set({ windowFixed: open }),
}));
