
import { create } from 'zustand';

interface StoreState {
    modalSalesOrder: any;
    setModalSalesOrder: (x: any) => void;

    subModal: any;
    setSubModal: (x: any) => void;

    dataSaleOrder: any;
    setDataSaleOrder: (x: any) => void;

    saleOrders: any;
    setSaleOrders: (x: any) => void;

    dataGet: any;
    setDataGet: (x: any) => void;

    saleOrdersToUpdate: any;
    setSaleOrdersToUpdate: (x: any) => void;

    dataSaleOrders: any;
    setDataSaleOrders: (x: any) => void;
    
    IdArticle: any;
    setIdArticle: (x: any) => void;
}

export const storeSaleOrder = create<StoreState>((set) => ({
    IdArticle: [],
    setIdArticle: (x) => set({IdArticle: x}),

    dataSaleOrders: [],
    setDataSaleOrders: (x) => set({dataSaleOrders: x}),

    dataSaleOrder: [],       
    setDataSaleOrder: (x) => set({dataSaleOrder: x}),

    saleOrders: [],       
    setSaleOrders: (x) => set({saleOrders: x}),

    dataGet: {},       
    setDataGet: (x) => set({dataGet: x}),

    saleOrdersToUpdate: [],       
    setSaleOrdersToUpdate: (x) => set({saleOrdersToUpdate: x}),

    modalSalesOrder: '',
    setModalSalesOrder: (x) => set({modalSalesOrder: x}),

    subModal: '',
    setSubModal: (x) => set({subModal: x}),


}));

