import React, { useState } from 'react'
import { storePagination } from '../../../zustand/Pagination';
import { storeRequisitions } from '../../../zustand/Requisition';
import { RequisitionRequests } from '../../../fuctions/Requisition';
import './styles/Pagination.css'

const Pagination: React.FC = () => {
  const { dataGet }: any = storeRequisitions();
   const { getRequisition }: any = RequisitionRequests();

  const setTotalPages = storePagination((state: any) => state.setTotalPages);
  const setPage = storePagination((state: any) => state.setPage);
  const { page, totalPages }: any = storePagination();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

   const setRequisitions = storeRequisitions((state: any) => state.setRequisitions);


   // Manejar clic en botón "Siguiente"
   const handleNext = async () => {
    if (startIndex + itemsPerPage < totalPages.length) {
      setStartIndex((prev) => prev + 2);
    }
  };

  // Manejar clic en botón "Anterior"
  const handlePrev = async () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 2);
    }
  };

  // Cambiar página activa
  const changePage = async (p: number) => {
    const data = {
      id_sucursal: dataGet.id_sucursal,
      id_usuario: dataGet.id_usuario,
      id_area: dataGet.id_area,
      tipo: 0,
      desde: dataGet.desde,
      hasta: dataGet.hasta,
      status: dataGet.status,
      page: p
    };
    setPage(p);
    const resultRequisition = await getRequisition(data)
    setRequisitions(resultRequisition.data)
    setTotalPages(resultRequisition.total_pages)
  };

  // Obtener las páginas visibles
  const visiblePages = totalPages.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="pagination">
            <div className="items__container">
                <div className="button-prev" onClick={handlePrev}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
                </div>
                <div className="items">
                    {visiblePages.map((p: any) => (
                        <div className={`item ${p === page ? "active" : ""}`} key={p} onClick={() => changePage(p)}>
                            <p>{p}</p>
                        </div>
                    ))}
                </div>
                <div className="button-next" onClick={handleNext}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg>

                </div>
            </div>
        </div>
    )
}

export default Pagination
