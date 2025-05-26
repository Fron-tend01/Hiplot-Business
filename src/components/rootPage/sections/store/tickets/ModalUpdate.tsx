import { useState, useEffect } from "react"
import useUserStore from "../../../../../zustand/General";
import { storeStore } from "../../../../../zustand/Store";
import { storeTickets } from "../../../../../zustand/Tickets";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/l10n/es.js'
import './styles/ModalCreate.css'
import './styles/ModalUpdate.css'
import { storePurchaseOrders } from "../../../../../zustand/PurchaseOrders";
import APIs from "../../../../../services/services/APIs";
import ModalPurchaseOrders from "../../shopping/purchaseOrders/ModalPurchaseOrders";
import Swal from "sweetalert2";


const ModalUpdate = ({ updateTickets }: any) => {
    const { getStore }: any = storeStore()
    const { getPDFTickets }: any = storeTickets();
    const userState = useUserStore(state => state.user);
    const user_id = userState.id
    const [conceptos, setConceptos] = useState<any>([])
    useEffect(() => {
        getStore(user_id)
        setConceptos(updateTickets.conceptos)
    }, [updateTickets])



    const [subtotal] = useState<number>(0); // Assuming you have declared `setSubtotal` elsewhere

    const [discount] = useState<number>(0); // Assuming you have declared `setDiscount` elsewhere

    const [total] = useState<number>(0);

    const [IVA] = useState<any>(null)

    const pdf = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            // Supongamos que tienes el ID de la requisición
            await getPDFTickets(updateTickets.id);
            window.open(`http://hiplot.dyndns.org:84/api_dev/pdf_entrada/${updateTickets.id}`, '_blank');
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };


    const [purchaseOrderToUpdate, setPurchaseOrderToUpdate] = useState<any>(null);

    const setModal = storePurchaseOrders(state => state.setModal)
    const verOc = async (id_oc: number) => {
        const data = {
            id: id_oc,
            folio: 0,
            id_serie: 0,
            id_sucursal: 0,
            id_usuario: user_id,
            desde: new Date().toISOString().split('T')[0],
            hasta: new Date().toISOString().split('T')[0],
            status: 0
        }

        const result: any = await APIs.getPurchaseOrders(data);
        setModal('modal-purchase-orders-update')
        setPurchaseOrderToUpdate(result[0])
    }



    const handleEtiquetas = async () => {
        // Genera el contenido HTML
        const html = conceptos.map((c, i) => `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; font-size: 12px;">
      <span>${c.codigo} - ${c.descripcion}</span>
      <input type="number" id="etq-${i}" value="${c.cantidad}" min="1" style="width: 60px; padding: 2px 4px; font-size: 12px;" />
    </div>
  `).join('');

        const { isConfirmed } = await Swal.fire({
            title: 'Generar etiquetas',
            html: html,
            customClass: {
                popup: 'small-swal'
            },
            width: 500,
            confirmButtonText: 'Generar PDF',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            didOpen: () => {
                conceptos.forEach((_, i) => {
                    const input = document.getElementById(`etq-${i}`) as HTMLInputElement;
                    if (input) input.focus();
                });
            }
        });

        if (isConfirmed) {
            const etiquetas = conceptos.map((c, i) => {
                const input = document.getElementById(`etq-${i}`) as HTMLInputElement;
                return {
                    ...c,
                    etiquetas: input?.value ? parseInt(input.value) : c.cantidad
                };
            });

            generarEtiquetasPDF(etiquetas);
        }
    };
    const generarEtiquetasPDF3 = (datos: any[]) => {
        let html = `
<html>
  <head>
    <title>Etiquetas</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <style>
      @page {
        size: 90mm 62mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
        }
        .etiqueta {
          page-break-after: always;
        }
      }
      body {
        font-family: Arial, sans-serif;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .etiqueta {
        border: 1px solid #000;
        width: 90mm;
        height: 62mm;
        padding: 6mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
      }
      .info-texto {
        flex: 1;
        padding-right: 10px;
      }
      .info-texto p {
        margin: 3px 0;
      }
      .titulo {
        font-weight: bold;
        font-size: 13px;
      }
      .barcode-container {
        width: 20mm;
        height: 50mm;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        position: relative;
        }

        .barcode {
        transform: rotate(-90deg) !important;
        transform-origin: left top;
        width: 50mm;
        height: 20mm;
        }
         .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .encabezado img {
        height: 25px;
      }
    </style>
  </head>
  <body>
`;

        datos.forEach((item: any, index: number) => {
            for (let i = 0; i < item.etiquetas; i++) {
                const barcodeId = `barcode-${index}-${i}`;
                html += `
    <div class="etiqueta">
      <div class="info-texto">
        <div class="encabezado">
        <p class="titulo">${item.codigo}</p>
        <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8yIiBkYXRhLW5hbWU9IkNhcGEgMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjA0LjY2IDEyMy45MiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM1NGFmZTM7fS5jbHMtMntmaWxsOiMwMDI2M2E7fS5jbHMtM3tmaWxsOm5vbmU7c3Ryb2tlOiM1NGFmZTM7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjRweDt9PC9zdHlsZT48L2RlZnM+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI1LjQ2IiB5PSI4LjY5IiB3aWR0aD0iNzEuNjQiIGhlaWdodD0iNzEuNjQiIHJ4PSI2LjU2Ii8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjEuNTIsMjcuMDVhMy42MSwzLjYxLDAsMCwxLDMuOTUtMy45NSwzLjYxLDMuNjEsMCwwLDEsMy45NCwzLjk1VjM3LjloLjExYTEwLjYsMTAuNiwwLDAsMSw4LjgtNC4xNmM0Ljc1LDAsOS45MywyLjM4LDkuOTMsMTAuMzdWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFY0NS42N2MwLTMuMTgtMS41Ny01LjQ1LTUtNS40NWE2LjEyLDYuMTIsMCwwLDAtNiw2LjIxdjEzYzAsMi4xMS0uODcsMy45NC0zLjk0LDMuOTRzLTMuOTUtMS44My0zLjk1LTMuOTRaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjEuMDUsMjIuODlBNC4xMSw0LjExLDAsMSwxLDU3LDI3LDQuMDksNC4wOSwwLDAsMSw2MS4wNSwyMi44OVpNNTcuMTEsMzcuNjhjMC0yLjEuODYtMy45NCwzLjk0LTMuOTRTNjUsMzUuNTgsNjUsMzcuNjhWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMDMuMTEsMzMuNzRjNiwwLDEyLDIuMzgsMTIsNmEzLjI3LDMuMjcsMCwwLDEtMy4yOSwzLjQ1Yy0zLjA4LDAtMy4xOC0zLjYyLTguMTUtMy42Mi0yLjc2LDAtNC41NC43Ni00LjU0LDIuNDMsMCwxLjg0LDEuNzgsMi4yNyw0LjIxLDIuODFsMy4zLjc2YzQuNDgsMSw5LjgyLDIuOTEsOS44Miw4LjQyLDAsNi40Mi02LjIsOS4zOS0xMi4xNCw5LjM5LTcuMTMsMC0xMy4wNy0zLjE4LTEzLjA3LTcuMDdBMywzLDAsMCwxLDk0LjQ4LDUzYzMuNCwwLDMuNzIsNC44Niw5LjU1LDQuODYsMi44MSwwLDQuNTktMS4yNCw0LjU5LTIuODYsMC0yLTEuNzMtMi4zMy00LjUzLTNsLTQuNjUtMS4xM2MtNC41OS0xLjE0LTguMTUtMy04LjE1LTguMzJDOTEuMjksMzYuMTIsOTcuNjYsMzMuNzQsMTAzLjExLDMzLjc0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzNy4wOCwzMy43NGM5LjUsMCwxNC41OCw2LjQ4LDE0LjU4LDE0LjgsMCw3Ljg4LTMuODQsMTQuODQtMTQuNTgsMTQuODRzLTE0LjU4LTctMTQuNTgtMTQuODRDMTIyLjUsNDAuMjIsMTI3LjU4LDMzLjc0LDEzNy4wOCwzMy43NFptMCwyMy44MWM0LjcsMCw2LjY5LTQuMjEsNi42OS05LDAtNS4xMy0yLjEtOS02LjY5LTlzLTYuNywzLjg0LTYuNyw5QzEzMC4zOCw1My4zNCwxMzIuMzgsNTcuNTUsMTM3LjA4LDU3LjU1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTksOTEuMjNhMi43NCwyLjc0LDAsMCwxLDMtMywyLjc1LDIuNzUsMCwwLDEsMywzdjguMTRoLjA4YTYuNjEsNi42MSwwLDAsMSw1LjkyLTNjNi4zNCwwLDkuMjYsNS4zOSw5LjI2LDExLjE1LDAsNy43Ny00LjQxLDExLjQzLTkuNDIsMTEuNDMtMi45MiwwLTUuMzUtMS4yMy02LjM0LTMuNzhoLS4wOHYuOTRjMCwxLjg1LTEsMi44NC0yLjcyLDIuODRTOSwxMTcuOTIsOSwxMTYuMDdaTTE5LjUzLDEwMWMtMy42NiwwLTQuODEsMy41OC00LjgxLDYuNjYsMCwzLjQyLDEuMzEsNi41NCw0LjgxLDYuNTQsMy4yMS0uMDgsNC43Ny0zLDQuNzctNi41NEMyNC4zLDEwNC44OCwyMy4zNSwxMDEsMTkuNTMsMTAxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU2LjE3LDExNS45MWMwLDEuODEtLjgyLDMtMi43Miwzcy0yLjcxLTEuMTktMi43MS0zdi0uNzhoLS4wOGE4LjYyLDguNjIsMCwwLDEtNy4yOCwzLjc4Yy0zLjYyLDAtNy41Ny0xLjgxLTcuNTctNy45Vjk5LjMzYTIuNjYsMi42NiwwLDAsMSwzLTNjMi4zNSwwLDMsMS40LDMsM3YxMC40OWMwLDIuNDMsMS4yLDQuMTUsMy43OSw0LjE1YTQuNjUsNC42NSwwLDAsMCw0LjU2LTQuNzNWOTkuMzNjMC0xLjYuNjYtMywzLTNhMi42NiwyLjY2LDAsMCwxLDMsM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MC42NCw5Ni4zM2M0LjU3LDAsOS4xNywxLjgxLDkuMTcsNC41NmEyLjUsMi41LDAsMCwxLTIuNSwyLjY0Yy0yLjM1LDAtMi40My0yLjc2LTYuMjItMi43Ni0yLjA5LDAtMy40NS41OC0zLjQ1LDEuODVzMS4zNiwxLjczLDMuMjEsMi4xNGwyLjUxLjU4YzMuNDEuNzgsNy40OCwyLjIyLDcuNDgsNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlBMi4zMSwyLjMxLDAsMCwxLDY0LjA2LDExMWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNS0uOTQsMy41LTIuMTgsMC0xLjUyLTEuMzItMS43Ni0zLjQ2LTIuM2wtMy41NC0uODZjLTMuNDktLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDNjEuNjMsOTguMTQsNjYuNDksOTYuMzMsNzAuNjQsOTYuMzNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODkuNjQsODguMDZhMy4xMywzLjEzLDAsMSwxLTMuMTMsMy4xM0EzLjEzLDMuMTMsMCwwLDEsODkuNjQsODguMDZabS0zLDExLjI3YTMsMywwLDAsMSw2LDB2MTYuNThhMywzLDAsMCwxLTYsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05OS4zOCw5OS4zM2MwLTEuODEuODMtMywyLjcyLTNzMi43MSwxLjE5LDIuNzEsM3YuNzhoLjA5YTguNTksOC41OSwwLDAsMSw3LjI4LTMuNzhjMy42MiwwLDcuNTYsMS44MSw3LjU2LDcuOXYxMS42OGMwLDEuNi0uNjUsMy0zLDNhMi42NiwyLjY2LDAsMCwxLTMtM1YxMDUuNDJjMC0yLjQzLTEuMTktNC4xNS0zLjc5LTQuMTVhNC42Niw0LjY2LDAsMCwwLTQuNTYsNC43M3Y5LjkxYTIuNjYsMi42NiwwLDAsMS0zLDNjLTIuMzUsMC0zLTEuNC0zLTNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTMxLjI2LDEwOC43NWE1LjE4LDUuMTgsMCwwLDAsNS41NSw1LjQ3YzQuNTIsMCw0LjUyLTMsNi45NS0zYTIuNDgsMi40OCwwLDAsMSwyLjQ3LDIuMzRjMCwzLjYyLTUuOCw1LjMxLTkuNDIsNS4zMS04LjM5LDAtMTEuNTYtNS42OC0xMS41Ni0xMC45LDAtNyw0LjI0LTExLjY4LDExLjM1LTExLjY4LDYuOTEsMCwxMC44Niw0Ljg5LDEwLjg2LDkuODMsMCwyLjA2LS42MiwyLjU5LTIuNjMsMi41OVptMTAuNTMtMy40NWE1LjE1LDUuMTUsMCwwLDAtNS4wNi00Ljc4Yy0zLDAtNC44MiwxLjg2LTUuNDcsNC43OFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNjEsOTYuMzNjNC41NiwwLDkuMTcsMS44MSw5LjE3LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzQsMC0yLjQyLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDUuNTgtMy40NSwxLjg1czEuMzUsMS43MywzLjIsMi4xNGwyLjUxLjU4YzMuNDIuNzgsNy40OSwyLjIyLDcuNDksNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlhMi4zMSwyLjMxLDAsMCwxLDIuNDMtMi41MWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNDktLjk0LDMuNDktMi4xOCwwLTEuNTItMS4zMS0xLjc2LTMuNDUtMi4zbC0zLjU0LS44NmMtMy40OS0uODctNi4yMS0yLjMxLTYuMjEtNi4zNEMxNTIsOTguMTQsMTU2Ljg4LDk2LjMzLDE2MSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xODQuNzUsOTYuMzNjNC41NywwLDkuMTgsMS44MSw5LjE4LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzUsMC0yLjQzLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDYuNTgtMy40NiwxLjg1czEuMzYsMS43MywzLjIxLDIuMTRsMi41MS41OGMzLjQxLjc4LDcuNDksMi4yMiw3LjQ5LDYuNDEsMCw0LjktNC43Myw3LjE2LTkuMjYsNy4xNi01LjQzLDAtOS45NS0yLjQzLTkuOTUtNS4zOWEyLjMxLDIuMzEsMCwwLDEsMi40Mi0yLjUxYzIuNiwwLDIuODQsMy43LDcuMjgsMy43LDIuMTQsMCwzLjUtLjk0LDMuNS0yLjE4LDAtMS41Mi0xLjMyLTEuNzYtMy40NS0yLjNsLTMuNTQtLjg2Yy0zLjUtLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDMTc1Ljc1LDk4LjE0LDE4MC42LDk2LjMzLDE4NC43NSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTgsMzkuNjNoLTEuNzljLTIuMjEsMC0zLjEzLS44Ny0zLjEzLTIuNTlzLjkyLTIuNiwzLjEzLTIuNkgxNThWMzAuNWMwLTUsNC4xLTcuNjEsOC42OS03LjYxLDIuODYsMCw1LjE4LDEuMTMsNS4xOCwzLjc4YTIuNjQsMi42NCwwLDAsMS0yLjUzLDIuN2MtLjYsMC0xLjE0LS4xNi0xLjczLS4xNkExLjY0LDEuNjQsMCwwLDAsMTY1LjkxLDMxdjMuNGgyLjQzYzIuMzIsMCwzLjU2LjcxLDMuNTYsMi42cy0xLjI0LDIuNTktMy41NiwyLjU5aC0yLjQzVjU5LjQ0YTMuOTQsMy45NCwwLDAsMS03Ljg4LDBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTc5LjczLDM5LjYzaC0xLjM1Yy0yLjIxLDAtMy4xMy0uODctMy4xMy0yLjU5cy45Mi0yLjYsMy4xMy0yLjZoMS4zNXYtNC44YTMuOTUsMy45NSwwLDAsMSw3Ljg5LDB2NC44SDE5MGMyLjMyLDAsMy41Ny43MSwzLjU3LDIuNnMtMS4yNSwyLjU5LTMuNTcsMi41OWgtMi4zN1Y1NS4zOWMwLDEuMTkuNjUsMS44NCwyLDEuODRoMS4xM2EyLjQ3LDIuNDcsMCwwLDEsMi43NiwyLjY0YzAsMi4yNy0xLjk1LDMuNTEtNS43MywzLjUxLTUuNzIsMC04LjEtMi4zNy04LjEtN1oiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9Ijg2LjExIiB5PSIxMS4xNyIgd2lkdGg9IjExMS45OSIgaGVpZ2h0PSI2Ny4yNSIgcng9IjkuODIiLz48L3N2Zz4=" 
                 alt="Logo" />
        </div>
        <p>${item.descripcion}</p>
        <p>Proveedor: ${item.proveedor}</p>
        <p>Almacén: ${item.almacen}</p>
        <p>Fecha: ${updateTickets.fecha_creacion}</p>
        <p>Entrada: ${updateTickets.serie}-${updateTickets.folio}-${updateTickets.anio}</p>
      </div>
      <div class="barcode-container">
        <svg id="${barcodeId}" class="barcode"></svg>
      </div>
    </div>
    `;
            }
        });

        html += `
    <script>
      window.onload = function() {
        const etiquetas = document.querySelectorAll("svg[id^='barcode']");
        etiquetas.forEach(el => {
          const codigo = el.closest('.etiqueta')?.querySelector('.titulo')?.textContent || '000000';
          JsBarcode(el, codigo, {
            format: "CODE128",
            width: 10,
            height: 200,
            displayValue: false
          });
        });
        window.print();
      }
    </script>
  </body>
</html>
`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
        }
    };

    const generarEtiquetasPDF = (datos: any[]) => {
        console.log('datos etiquetas', datos);

        let html = `
<html>
  <head>
    <title>Etiquetas</title>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    <style>
      @page {
        size: 90mm 62mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
        }
        .etiqueta {
          page-break-after: always;
        }
      }
      body {
        font-family: Arial, sans-serif;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .etiqueta {
        border: 1px solid #000;
        width: 90mm;
        height: 62mm;
        padding: 2mm;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-size: 10px;
      }
      .etiqueta p {
        margin: 2px 0;
      }
      .titulo {
        font-weight: bold;
        font-size: 11px;
      }
      .barcode {
        margin-top: 4px;
        width: 100%;
      }
      .encabezado {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .encabezado img {
        height: 25px;
      }
    </style>
  </head>
  <body>
`;

        datos.forEach((item: any, index: number) => {
            for (let i = 0; i < item.etiquetas; i++) {
                const barcodeId = `barcode-${index}-${i}`;
                html += `
      <div class="etiqueta">
        <div class="encabezado">
        <p class="titulo">${item.codigo}</p>
        <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8yIiBkYXRhLW5hbWU9IkNhcGEgMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjA0LjY2IDEyMy45MiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM1NGFmZTM7fS5jbHMtMntmaWxsOiMwMDI2M2E7fS5jbHMtM3tmaWxsOm5vbmU7c3Ryb2tlOiM1NGFmZTM7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjRweDt9PC9zdHlsZT48L2RlZnM+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI1LjQ2IiB5PSI4LjY5IiB3aWR0aD0iNzEuNjQiIGhlaWdodD0iNzEuNjQiIHJ4PSI2LjU2Ii8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjEuNTIsMjcuMDVhMy42MSwzLjYxLDAsMCwxLDMuOTUtMy45NSwzLjYxLDMuNjEsMCwwLDEsMy45NCwzLjk1VjM3LjloLjExYTEwLjYsMTAuNiwwLDAsMSw4LjgtNC4xNmM0Ljc1LDAsOS45MywyLjM4LDkuOTMsMTAuMzdWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFY0NS42N2MwLTMuMTgtMS41Ny01LjQ1LTUtNS40NWE2LjEyLDYuMTIsMCwwLDAtNiw2LjIxdjEzYzAsMi4xMS0uODcsMy45NC0zLjk0LDMuOTRzLTMuOTUtMS44My0zLjk1LTMuOTRaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjEuMDUsMjIuODlBNC4xMSw0LjExLDAsMSwxLDU3LDI3LDQuMDksNC4wOSwwLDAsMSw2MS4wNSwyMi44OVpNNTcuMTEsMzcuNjhjMC0yLjEuODYtMy45NCwzLjk0LTMuOTRTNjUsMzUuNTgsNjUsMzcuNjhWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMDMuMTEsMzMuNzRjNiwwLDEyLDIuMzgsMTIsNmEzLjI3LDMuMjcsMCwwLDEtMy4yOSwzLjQ1Yy0zLjA4LDAtMy4xOC0zLjYyLTguMTUtMy42Mi0yLjc2LDAtNC41NC43Ni00LjU0LDIuNDMsMCwxLjg0LDEuNzgsMi4yNyw0LjIxLDIuODFsMy4zLjc2YzQuNDgsMSw5LjgyLDIuOTEsOS44Miw4LjQyLDAsNi40Mi02LjIsOS4zOS0xMi4xNCw5LjM5LTcuMTMsMC0xMy4wNy0zLjE4LTEzLjA3LTcuMDdBMywzLDAsMCwxLDk0LjQ4LDUzYzMuNCwwLDMuNzIsNC44Niw5LjU1LDQuODYsMi44MSwwLDQuNTktMS4yNCw0LjU5LTIuODYsMC0yLTEuNzMtMi4zMy00LjUzLTNsLTQuNjUtMS4xM2MtNC41OS0xLjE0LTguMTUtMy04LjE1LTguMzJDOTEuMjksMzYuMTIsOTcuNjYsMzMuNzQsMTAzLjExLDMzLjc0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzNy4wOCwzMy43NGM5LjUsMCwxNC41OCw2LjQ4LDE0LjU4LDE0LjgsMCw3Ljg4LTMuODQsMTQuODQtMTQuNTgsMTQuODRzLTE0LjU4LTctMTQuNTgtMTQuODRDMTIyLjUsNDAuMjIsMTI3LjU4LDMzLjc0LDEzNy4wOCwzMy43NFptMCwyMy44MWM0LjcsMCw2LjY5LTQuMjEsNi42OS05LDAtNS4xMy0yLjEtOS02LjY5LTlzLTYuNywzLjg0LTYuNyw5QzEzMC4zOCw1My4zNCwxMzIuMzgsNTcuNTUsMTM3LjA4LDU3LjU1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTksOTEuMjNhMi43NCwyLjc0LDAsMCwxLDMtMywyLjc1LDIuNzUsMCwwLDEsMywzdjguMTRoLjA4YTYuNjEsNi42MSwwLDAsMSw1LjkyLTNjNi4zNCwwLDkuMjYsNS4zOSw5LjI2LDExLjE1LDAsNy43Ny00LjQxLDExLjQzLTkuNDIsMTEuNDMtMi45MiwwLTUuMzUtMS4yMy02LjM0LTMuNzhoLS4wOHYuOTRjMCwxLjg1LTEsMi44NC0yLjcyLDIuODRTOSwxMTcuOTIsOSwxMTYuMDdaTTE5LjUzLDEwMWMtMy42NiwwLTQuODEsMy41OC00LjgxLDYuNjYsMCwzLjQyLDEuMzEsNi41NCw0LjgxLDYuNTQsMy4yMS0uMDgsNC43Ny0zLDQuNzctNi41NEMyNC4zLDEwNC44OCwyMy4zNSwxMDEsMTkuNTMsMTAxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU2LjE3LDExNS45MWMwLDEuODEtLjgyLDMtMi43Miwzcy0yLjcxLTEuMTktMi43MS0zdi0uNzhoLS4wOGE4LjYyLDguNjIsMCwwLDEtNy4yOCwzLjc4Yy0zLjYyLDAtNy41Ny0xLjgxLTcuNTctNy45Vjk5LjMzYTIuNjYsMi42NiwwLDAsMSwzLTNjMi4zNSwwLDMsMS40LDMsM3YxMC40OWMwLDIuNDMsMS4yLDQuMTUsMy43OSw0LjE1YTQuNjUsNC42NSwwLDAsMCw0LjU2LTQuNzNWOTkuMzNjMC0xLjYuNjYtMywzLTNhMi42NiwyLjY2LDAsMCwxLDMsM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MC42NCw5Ni4zM2M0LjU3LDAsOS4xNywxLjgxLDkuMTcsNC41NmEyLjUsMi41LDAsMCwxLTIuNSwyLjY0Yy0yLjM1LDAtMi40My0yLjc2LTYuMjItMi43Ni0yLjA5LDAtMy40NS41OC0zLjQ1LDEuODVzMS4zNiwxLjczLDMuMjEsMi4xNGwyLjUxLjU4YzMuNDEuNzgsNy40OCwyLjIyLDcuNDgsNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlBMi4zMSwyLjMxLDAsMCwxLDY0LjA2LDExMWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNS0uOTQsMy41LTIuMTgsMC0xLjUyLTEuMzItMS43Ni0zLjQ2LTIuM2wtMy41NC0uODZjLTMuNDktLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDNjEuNjMsOTguMTQsNjYuNDksOTYuMzMsNzAuNjQsOTYuMzNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODkuNjQsODguMDZhMy4xMywzLjEzLDAsMSwxLTMuMTMsMy4xM0EzLjEzLDMuMTMsMCwwLDEsODkuNjQsODguMDZabS0zLDExLjI3YTMsMywwLDAsMSw2LDB2MTYuNThhMywzLDAsMCwxLTYsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05OS4zOCw5OS4zM2MwLTEuODEuODMtMywyLjcyLTNzMi43MSwxLjE5LDIuNzEsM3YuNzhoLjA5YTguNTksOC41OSwwLDAsMSw3LjI4LTMuNzhjMy42MiwwLDcuNTYsMS44MSw3LjU2LDcuOXYxMS42OGMwLDEuNi0uNjUsMy0zLDNhMi42NiwyLjY2LDAsMCwxLTMtM1YxMDUuNDJjMC0yLjQzLTEuMTktNC4xNS0zLjc5LTQuMTVhNC42Niw0LjY2LDAsMCwwLTQuNTYsNC43M3Y5LjkxYTIuNjYsMi42NiwwLDAsMS0zLDNjLTIuMzUsMC0zLTEuNC0zLTNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTMxLjI2LDEwOC43NWE1LjE4LDUuMTgsMCwwLDAsNS41NSw1LjQ3YzQuNTIsMCw0LjUyLTMsNi45NS0zYTIuNDgsMi40OCwwLDAsMSwyLjQ3LDIuMzRjMCwzLjYyLTUuOCw1LjMxLTkuNDIsNS4zMS04LjM5LDAtMTEuNTYtNS42OC0xMS41Ni0xMC45LDAtNyw0LjI0LTExLjY4LDExLjM1LTExLjY4LDYuOTEsMCwxMC44Niw0Ljg5LDEwLjg2LDkuODMsMCwyLjA2LS42MiwyLjU5LTIuNjMsMi41OVptMTAuNTMtMy40NWE1LjE1LDUuMTUsMCwwLDAtNS4wNi00Ljc4Yy0zLDAtNC44MiwxLjg2LTUuNDcsNC43OFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNjEsOTYuMzNjNC41NiwwLDkuMTcsMS44MSw5LjE3LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzQsMC0yLjQyLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDUuNTgtMy40NSwxLjg1czEuMzUsMS43MywzLjIsMi4xNGwyLjUxLjU4YzMuNDIuNzgsNy40OSwyLjIyLDcuNDksNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlhMi4zMSwyLjMxLDAsMCwxLDIuNDMtMi41MWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNDktLjk0LDMuNDktMi4xOCwwLTEuNTItMS4zMS0xLjc2LTMuNDUtMi4zbC0zLjU0LS44NmMtMy40OS0uODctNi4yMS0yLjMxLTYuMjEtNi4zNEMxNTIsOTguMTQsMTU2Ljg4LDk2LjMzLDE2MSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xODQuNzUsOTYuMzNjNC41NywwLDkuMTgsMS44MSw5LjE4LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzUsMC0yLjQzLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDYuNTgtMy40NiwxLjg1czEuMzYsMS43MywzLjIxLDIuMTRsMi41MS41OGMzLjQxLjc4LDcuNDksMi4yMiw3LjQ5LDYuNDEsMCw0LjktNC43Myw3LjE2LTkuMjYsNy4xNi01LjQzLDAtOS45NS0yLjQzLTkuOTUtNS4zOWEyLjMxLDIuMzEsMCwwLDEsMi40Mi0yLjUxYzIuNiwwLDIuODQsMy43LDcuMjgsMy43LDIuMTQsMCwzLjUtLjk0LDMuNS0yLjE4LDAtMS41Mi0xLjMyLTEuNzYtMy40NS0yLjNsLTMuNTQtLjg2Yy0zLjUtLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDMTc1Ljc1LDk4LjE0LDE4MC42LDk2LjMzLDE4NC43NSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTgsMzkuNjNoLTEuNzljLTIuMjEsMC0zLjEzLS44Ny0zLjEzLTIuNTlzLjkyLTIuNiwzLjEzLTIuNkgxNThWMzAuNWMwLTUsNC4xLTcuNjEsOC42OS03LjYxLDIuODYsMCw1LjE4LDEuMTMsNS4xOCwzLjc4YTIuNjQsMi42NCwwLDAsMS0yLjUzLDIuN2MtLjYsMC0xLjE0LS4xNi0xLjczLS4xNkExLjY0LDEuNjQsMCwwLDAsMTY1LjkxLDMxdjMuNGgyLjQzYzIuMzIsMCwzLjU2LjcxLDMuNTYsMi42cy0xLjI0LDIuNTktMy41NiwyLjU5aC0yLjQzVjU5LjQ0YTMuOTQsMy45NCwwLDAsMS03Ljg4LDBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTc5LjczLDM5LjYzaC0xLjM1Yy0yLjIxLDAtMy4xMy0uODctMy4xMy0yLjU5cy45Mi0yLjYsMy4xMy0yLjZoMS4zNXYtNC44YTMuOTUsMy45NSwwLDAsMSw3Ljg5LDB2NC44SDE5MGMyLjMyLDAsMy41Ny43MSwzLjU3LDIuNnMtMS4yNSwyLjU5LTMuNTcsMi41OWgtMi4zN1Y1NS4zOWMwLDEuMTkuNjUsMS44NCwyLDEuODRoMS4xM2EyLjQ3LDIuNDcsMCwwLDEsMi43NiwyLjY0YzAsMi4yNy0xLjk1LDMuNTEtNS43MywzLjUxLTUuNzIsMC04LjEtMi4zNy04LjEtN1oiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9Ijg2LjExIiB5PSIxMS4xNyIgd2lkdGg9IjExMS45OSIgaGVpZ2h0PSI2Ny4yNSIgcng9IjkuODIiLz48L3N2Zz4=" 
                 alt="Logo" />
        </div>
        <p>${item.descripcion}</p>
        <p>Proveedor: ${item.proveedor}</p>
        <p>Almacén: ${item.almacen}</p>
        <p>Fecha: ${updateTickets.fecha_creacion}</p>
        <p>Entrada: ${updateTickets.serie}-${updateTickets.folio}-${updateTickets.anio}</p>
        <svg id="${barcodeId}" class="barcode"></svg>
      </div>
      `;
            }
        });

        html += `
    <script>
      window.onload = function() {
        const etiquetas = document.querySelectorAll("svg[id^='barcode']");
        etiquetas.forEach(el => {
          const codigo = el.previousElementSibling?.querySelector('.titulo')?.textContent || '000000';
          JsBarcode(el, codigo, {
            format: "CODE128",
            width: 1.8,
            height: 35,
            displayValue: false
          });
        });
        window.print();
      }
    </script>
  </body>
</html>
`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.focus();
        }
    };


    //     const generarEtiquetasPDF = (datos: any[]) => {
    //         let html = `
    // <html>
    //   <head>
    //     <title>Etiquetas</title>
    //     <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
    //     <style>
    //       @media print {
    //         .etiqueta {
    //           page-break-inside: avoid;
    //         }
    //       }
    //       body {
    //         font-family: Arial, sans-serif;
    //         display: flex;
    //         flex-wrap: wrap;
    //         gap: 0.8cm;
    //         padding: 1cm;
    //       }
    //       .etiqueta {
    //         border: 1px solid #000;
    //         width: 6.5cm;
    //         height: 4.5cm;
    //         padding: 6px;
    //         box-sizing: border-box;
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: space-between;
    //         font-size: 10px;
    //       }
    //       .etiqueta p {
    //         margin: 2px 0;
    //       }
    //       .titulo {
    //         font-weight: bold;
    //         font-size: 11px;
    //       }
    //       .barcode {
    //         margin-top: 4px;
    //         width: 100%;
    //       }
    //       .encabezado {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //       }
    //       .encabezado img {
    //         height: 25px;
    //       }
    //     </style>
    //   </head>
    //   <body>
    // `;

    //         datos.forEach((item: any, index: number) => {
    //             for (let i = 0; i < item.etiquetas; i++) {
    //                 const barcodeId = `barcode-${index}-${i}`;
    //                 html += `
    //       <div class="etiqueta">
    //         <div>
    //           <div class="encabezado">
    //             <p class="titulo">${item.codigo}</p>
    //             <img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8yIiBkYXRhLW5hbWU9IkNhcGEgMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjA0LjY2IDEyMy45MiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM1NGFmZTM7fS5jbHMtMntmaWxsOiMwMDI2M2E7fS5jbHMtM3tmaWxsOm5vbmU7c3Ryb2tlOiM1NGFmZTM7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjRweDt9PC9zdHlsZT48L2RlZnM+PHJlY3QgY2xhc3M9ImNscy0xIiB4PSI1LjQ2IiB5PSI4LjY5IiB3aWR0aD0iNzEuNjQiIGhlaWdodD0iNzEuNjQiIHJ4PSI2LjU2Ii8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjEuNTIsMjcuMDVhMy42MSwzLjYxLDAsMCwxLDMuOTUtMy45NSwzLjYxLDMuNjEsMCwwLDEsMy45NCwzLjk1VjM3LjloLjExYTEwLjYsMTAuNiwwLDAsMSw4LjgtNC4xNmM0Ljc1LDAsOS45MywyLjM4LDkuOTMsMTAuMzdWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFY0NS42N2MwLTMuMTgtMS41Ny01LjQ1LTUtNS40NWE2LjEyLDYuMTIsMCwwLDAtNiw2LjIxdjEzYzAsMi4xMS0uODcsMy45NC0zLjk0LDMuOTRzLTMuOTUtMS44My0zLjk1LTMuOTRaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNjEuMDUsMjIuODlBNC4xMSw0LjExLDAsMSwxLDU3LDI3LDQuMDksNC4wOSwwLDAsMSw2MS4wNSwyMi44OVpNNTcuMTEsMzcuNjhjMC0yLjEuODYtMy45NCwzLjk0LTMuOTRTNjUsMzUuNTgsNjUsMzcuNjhWNTkuNDRjMCwyLjExLS44NiwzLjk0LTMuOTQsMy45NHMtMy45NC0xLjgzLTMuOTQtMy45NFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMDMuMTEsMzMuNzRjNiwwLDEyLDIuMzgsMTIsNmEzLjI3LDMuMjcsMCwwLDEtMy4yOSwzLjQ1Yy0zLjA4LDAtMy4xOC0zLjYyLTguMTUtMy42Mi0yLjc2LDAtNC41NC43Ni00LjU0LDIuNDMsMCwxLjg0LDEuNzgsMi4yNyw0LjIxLDIuODFsMy4zLjc2YzQuNDgsMSw5LjgyLDIuOTEsOS44Miw4LjQyLDAsNi40Mi02LjIsOS4zOS0xMi4xNCw5LjM5LTcuMTMsMC0xMy4wNy0zLjE4LTEzLjA3LTcuMDdBMywzLDAsMCwxLDk0LjQ4LDUzYzMuNCwwLDMuNzIsNC44Niw5LjU1LDQuODYsMi44MSwwLDQuNTktMS4yNCw0LjU5LTIuODYsMC0yLTEuNzMtMi4zMy00LjUzLTNsLTQuNjUtMS4xM2MtNC41OS0xLjE0LTguMTUtMy04LjE1LTguMzJDOTEuMjksMzYuMTIsOTcuNjYsMzMuNzQsMTAzLjExLDMzLjc0WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTEzNy4wOCwzMy43NGM5LjUsMCwxNC41OCw2LjQ4LDE0LjU4LDE0LjgsMCw3Ljg4LTMuODQsMTQuODQtMTQuNTgsMTQuODRzLTE0LjU4LTctMTQuNTgtMTQuODRDMTIyLjUsNDAuMjIsMTI3LjU4LDMzLjc0LDEzNy4wOCwzMy43NFptMCwyMy44MWM0LjcsMCw2LjY5LTQuMjEsNi42OS05LDAtNS4xMy0yLjEtOS02LjY5LTlzLTYuNywzLjg0LTYuNyw5QzEzMC4zOCw1My4zNCwxMzIuMzgsNTcuNTUsMTM3LjA4LDU3LjU1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTksOTEuMjNhMi43NCwyLjc0LDAsMCwxLDMtMywyLjc1LDIuNzUsMCwwLDEsMywzdjguMTRoLjA4YTYuNjEsNi42MSwwLDAsMSw1LjkyLTNjNi4zNCwwLDkuMjYsNS4zOSw5LjI2LDExLjE1LDAsNy43Ny00LjQxLDExLjQzLTkuNDIsMTEuNDMtMi45MiwwLTUuMzUtMS4yMy02LjM0LTMuNzhoLS4wOHYuOTRjMCwxLjg1LTEsMi44NC0yLjcyLDIuODRTOSwxMTcuOTIsOSwxMTYuMDdaTTE5LjUzLDEwMWMtMy42NiwwLTQuODEsMy41OC00LjgxLDYuNjYsMCwzLjQyLDEuMzEsNi41NCw0LjgxLDYuNTQsMy4yMS0uMDgsNC43Ny0zLDQuNzctNi41NEMyNC4zLDEwNC44OCwyMy4zNSwxMDEsMTkuNTMsMTAxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU2LjE3LDExNS45MWMwLDEuODEtLjgyLDMtMi43Miwzcy0yLjcxLTEuMTktMi43MS0zdi0uNzhoLS4wOGE4LjYyLDguNjIsMCwwLDEtNy4yOCwzLjc4Yy0zLjYyLDAtNy41Ny0xLjgxLTcuNTctNy45Vjk5LjMzYTIuNjYsMi42NiwwLDAsMSwzLTNjMi4zNSwwLDMsMS40LDMsM3YxMC40OWMwLDIuNDMsMS4yLDQuMTUsMy43OSw0LjE1YTQuNjUsNC42NSwwLDAsMCw0LjU2LTQuNzNWOTkuMzNjMC0xLjYuNjYtMywzLTNhMi42NiwyLjY2LDAsMCwxLDMsM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik03MC42NCw5Ni4zM2M0LjU3LDAsOS4xNywxLjgxLDkuMTcsNC41NmEyLjUsMi41LDAsMCwxLTIuNSwyLjY0Yy0yLjM1LDAtMi40My0yLjc2LTYuMjItMi43Ni0yLjA5LDAtMy40NS41OC0zLjQ1LDEuODVzMS4zNiwxLjczLDMuMjEsMi4xNGwyLjUxLjU4YzMuNDEuNzgsNy40OCwyLjIyLDcuNDgsNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlBMi4zMSwyLjMxLDAsMCwxLDY0LjA2LDExMWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNS0uOTQsMy41LTIuMTgsMC0xLjUyLTEuMzItMS43Ni0zLjQ2LTIuM2wtMy41NC0uODZjLTMuNDktLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDNjEuNjMsOTguMTQsNjYuNDksOTYuMzMsNzAuNjQsOTYuMzNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNODkuNjQsODguMDZhMy4xMywzLjEzLDAsMSwxLTMuMTMsMy4xM0EzLjEzLDMuMTMsMCwwLDEsODkuNjQsODguMDZabS0zLDExLjI3YTMsMywwLDAsMSw2LDB2MTYuNThhMywzLDAsMCwxLTYsMFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik05OS4zOCw5OS4zM2MwLTEuODEuODMtMywyLjcyLTNzMi43MSwxLjE5LDIuNzEsM3YuNzhoLjA5YTguNTksOC41OSwwLDAsMSw3LjI4LTMuNzhjMy42MiwwLDcuNTYsMS44MSw3LjU2LDcuOXYxMS42OGMwLDEuNi0uNjUsMy0zLDNhMi42NiwyLjY2LDAsMCwxLTMtM1YxMDUuNDJjMC0yLjQzLTEuMTktNC4xNS0zLjc5LTQuMTVhNC42Niw0LjY2LDAsMCwwLTQuNTYsNC43M3Y5LjkxYTIuNjYsMi42NiwwLDAsMS0zLDNjLTIuMzUsMC0zLTEuNC0zLTNaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTMxLjI2LDEwOC43NWE1LjE4LDUuMTgsMCwwLDAsNS41NSw1LjQ3YzQuNTIsMCw0LjUyLTMsNi45NS0zYTIuNDgsMi40OCwwLDAsMSwyLjQ3LDIuMzRjMCwzLjYyLTUuOCw1LjMxLTkuNDIsNS4zMS04LjM5LDAtMTEuNTYtNS42OC0xMS41Ni0xMC45LDAtNyw0LjI0LTExLjY4LDExLjM1LTExLjY4LDYuOTEsMCwxMC44Niw0Ljg5LDEwLjg2LDkuODMsMCwyLjA2LS42MiwyLjU5LTIuNjMsMi41OVptMTAuNTMtMy40NWE1LjE1LDUuMTUsMCwwLDAtNS4wNi00Ljc4Yy0zLDAtNC44MiwxLjg2LTUuNDcsNC43OFoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNjEsOTYuMzNjNC41NiwwLDkuMTcsMS44MSw5LjE3LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzQsMC0yLjQyLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDUuNTgtMy40NSwxLjg1czEuMzUsMS43MywzLjIsMi4xNGwyLjUxLjU4YzMuNDIuNzgsNy40OSwyLjIyLDcuNDksNi40MSwwLDQuOS00LjczLDcuMTYtOS4yNSw3LjE2LTUuNDMsMC0xMC0yLjQzLTEwLTUuMzlhMi4zMSwyLjMxLDAsMCwxLDIuNDMtMi41MWMyLjU5LDAsMi44NCwzLjcsNy4yOCwzLjcsMi4xNCwwLDMuNDktLjk0LDMuNDktMi4xOCwwLTEuNTItMS4zMS0xLjc2LTMuNDUtMi4zbC0zLjU0LS44NmMtMy40OS0uODctNi4yMS0yLjMxLTYuMjEtNi4zNEMxNTIsOTguMTQsMTU2Ljg4LDk2LjMzLDE2MSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xODQuNzUsOTYuMzNjNC41NywwLDkuMTgsMS44MSw5LjE4LDQuNTZhMi41LDIuNSwwLDAsMS0yLjUxLDIuNjRjLTIuMzUsMC0yLjQzLTIuNzYtNi4yMS0yLjc2LTIuMSwwLTMuNDYuNTgtMy40NiwxLjg1czEuMzYsMS43MywzLjIxLDIuMTRsMi41MS41OGMzLjQxLjc4LDcuNDksMi4yMiw3LjQ5LDYuNDEsMCw0LjktNC43Myw3LjE2LTkuMjYsNy4xNi01LjQzLDAtOS45NS0yLjQzLTkuOTUtNS4zOWEyLjMxLDIuMzEsMCwwLDEsMi40Mi0yLjUxYzIuNiwwLDIuODQsMy43LDcuMjgsMy43LDIuMTQsMCwzLjUtLjk0LDMuNS0yLjE4LDAtMS41Mi0xLjMyLTEuNzYtMy40NS0yLjNsLTMuNTQtLjg2Yy0zLjUtLjg3LTYuMjEtMi4zMS02LjIxLTYuMzRDMTc1Ljc1LDk4LjE0LDE4MC42LDk2LjMzLDE4NC43NSw5Ni4zM1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTgsMzkuNjNoLTEuNzljLTIuMjEsMC0zLjEzLS44Ny0zLjEzLTIuNTlzLjkyLTIuNiwzLjEzLTIuNkgxNThWMzAuNWMwLTUsNC4xLTcuNjEsOC42OS03LjYxLDIuODYsMCw1LjE4LDEuMTMsNS4xOCwzLjc4YTIuNjQsMi42NCwwLDAsMS0yLjUzLDIuN2MtLjYsMC0xLjE0LS4xNi0xLjczLS4xNkExLjY0LDEuNjQsMCwwLDAsMTY1LjkxLDMxdjMuNGgyLjQzYzIuMzIsMCwzLjU2LjcxLDMuNTYsMi42cy0xLjI0LDIuNTktMy41NiwyLjU5aC0yLjQzVjU5LjQ0YTMuOTQsMy45NCwwLDAsMS03Ljg4LDBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTc5LjczLDM5LjYzaC0xLjM1Yy0yLjIxLDAtMy4xMy0uODctMy4xMy0yLjU5cy45Mi0yLjYsMy4xMy0yLjZoMS4zNXYtNC44YTMuOTUsMy45NSwwLDAsMSw3Ljg5LDB2NC44SDE5MGMyLjMyLDAsMy41Ny43MSwzLjU3LDIuNnMtMS4yNSwyLjU5LTMuNTcsMi41OWgtMi4zN1Y1NS4zOWMwLDEuMTkuNjUsMS44NCwyLDEuODRoMS4xM2EyLjQ3LDIuNDcsMCwwLDEsMi43NiwyLjY0YzAsMi4yNy0xLjk1LDMuNTEtNS43MywzLjUxLTUuNzIsMC04LjEtMi4zNy04LjEtN1oiLz48cmVjdCBjbGFzcz0iY2xzLTMiIHg9Ijg2LjExIiB5PSIxMS4xNyIgd2lkdGg9IjExMS45OSIgaGVpZ2h0PSI2Ny4yNSIgcng9IjkuODIiLz48L3N2Zz4=" 
    //             alt="Logo" />
    //           </div>
    //           <p>${item.descripcion}</p>
    //           <p>Cantidad: ${item.cantidad}</p>
    //           <p>Unidad: ${item.unidad}</p>
    //           <p>Proveedor: ${item.proveedor}</p>
    //           <p>Almacén: ${item.almacen}</p>
    //         </div>
    //         <svg id="${barcodeId}" class="barcode"></svg>
    //       </div>
    //     `;
    //             }
    //         });

    //         html += `
    //     <script>
    //       window.onload = function() {
    //         const etiquetas = document.querySelectorAll("svg[id^='barcode']");
    //         etiquetas.forEach(el => {
    //           const codigo = el.previousElementSibling?.querySelector('.titulo')?.textContent || '000000';
    //           JsBarcode(el, codigo, {
    //             format: "CODE128",
    //             width: 1.8,
    //             height: 35,
    //             displayValue: true
    //           });
    //         });
    //         window.print();
    //       }
    //     </script>
    //   </body>
    // </html>
    // `;

    //         const printWindow = window.open('', '_blank');
    //         if (printWindow) {
    //             printWindow.document.write(html);
    //             printWindow.document.close();
    //             printWindow.focus();
    //         }
    //     };




    return (

        <div className='conatiner__update_tickets'>
            <div className="row">
                <div className="col-12">
                    <div className="card ">
                        <div className="card-body bg-standar">
                            <h3 className="text">{updateTickets.serie}-{updateTickets.folio}-{updateTickets.anio}</h3>
                            <hr />
                            <div className='row'>
                                <div className='col-6 md-col-12'>
                                    <span className='text'>Creado por: <b>{updateTickets.usuario_crea}</b></span><br />
                                    <span className='text'>Fecha de Creación: <b>{updateTickets.fecha_creacion}</b></span><br />

                                </div>
                                <div className='col-6 md-col-12'>
                                    <span className='text'>Empresa: <b>{updateTickets.empresa}</b></span><br />
                                    <span className='text'>Sucursal: <b>{updateTickets.sucursal}</b></span><br />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <span className='text'>Comentarios: {updateTickets.comentarios}</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table__modal_update_tickets">
                <div>
                    <div className='table__numbers'>
                        <p className='text'>Total de conceptos</p>
                        <div className='quantities_tables'>{conceptos?.length}</div>
                    </div>
                </div>
                <div className="table">
                    <div className='table__head'>
                        <div className='thead'>
                            <div className='th'>
                                <p className=''>Articulo</p>
                            </div>
                            <div className='th'>
                                <p className=''>Cant</p>
                            </div>
                            <div className='th'>
                                <p className=''>Unidad</p>
                            </div>
                            <div className='th'>
                                <p className=''>Prov</p>
                            </div>
                            <div className='th'>
                                <p className=''>Almacen</p>
                            </div>
                            <div className='th'>
                                <p className=''>OC</p>
                            </div>
                            <div className='th'>
                                <p className=''>Coment</p>
                            </div>
                        </div>
                    </div>
                    {conceptos?.length > 0 ? (
                        <div className='table__body'>
                            {conceptos.map((concept: any, index: any) => (
                                <div className='tbody__container' key={index}>
                                    <div className='tbody'>
                                        <div className='td'>
                                            <p className="folio-identifier">{concept.codigo}-{concept.descripcion}</p>
                                        </div>
                                        <div className="td">
                                            <p className="amount-identifier">{concept.cantidad}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.unidad}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.proveedor}</p>
                                        </div>
                                        <div className="td">
                                            <p>{concept.almacen}</p>
                                        </div>
                                        <div className="td">
                                            <button className='btn__general-gray' onClick={() => verOc(concept.data_oc.id_oc)}>{concept.data_oc.folio}</button>
                                        </div>
                                        <div className="td">
                                            <p>{concept.comentarios}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='text'>No hay aritculos que mostrar</p>
                    )}
                </div>
            </div>
            <div className='row__three'>
                <div className='btns'>
                    <div className='subtotal'>
                        <div>
                            <p className='name'>Subtotal</p>
                            <p className='value'>$ {subtotal}</p>
                        </div>
                    </div>
                    <div className='discount'>
                        <div>
                            <p className='name'>Descuento</p>
                            <p className='value'>$ {discount}</p>
                        </div>
                    </div>
                    <div className='urgency'>
                        <div>
                            <p className='name'>Urgencia</p>
                            <p className='value'>$ {IVA}</p>
                        </div>
                    </div>
                    <div className='total'>
                        <div>
                            <p className='name'>Total</p>
                            <p className='value'>$ {total}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row__four">
                <div>
                    <button className="btn__general-purple" onClick={pdf}>PDF</button>
                </div>
                <button className="btn__general-purple" onClick={handleEtiquetas}>
                    Imprimir etiquetas
                </button>
            </div>
            <ModalPurchaseOrders purchaseOrderToUpdate={purchaseOrderToUpdate} />
        </div>

    )
}

export default ModalUpdate
