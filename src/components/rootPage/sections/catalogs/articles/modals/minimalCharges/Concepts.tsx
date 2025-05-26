import React, { useEffect, useState } from 'react'
import { storeModals } from '../../../../../../../zustand/Modals'
import { storeArticles } from '../../../../../../../zustand/Articles'
import TemplatesRequests from '../../../../../../../fuctions/Templates'
import { UnitsRequests } from '../../../../../../../fuctions/Units'
import { UserGroupsRequests } from '../../../../../../../fuctions/UserGroups'
import Select from '../../../../../Dynamic_Components/Select'
import useUserStore from '../../../../../../../zustand/General'
import { useSelectStore } from '../../../../../../../zustand/Select'
import './Concepts.css'

interface ConceptsProps {
  index: any; // Cambia `any` por el tipo específico de `index`, si lo conoces (ejemplo: `number` o `string`).
}

const Concepts: React.FC<ConceptsProps> = ({index}) => {
    const userState = useUserStore((state) => state.user);
    const user_id = userState.id;
  
    const selectedIds: any = useSelectStore((state) => state.selectedIds);
    const setSelectData: any = useSelectStore((state) => state.setSelectedId);
  
    const setModalSub = storeModals((state) => state.setModalSub);
    const modalSub = storeModals((state) => state.modalSub);
  
    const setMinimalCharges = storeArticles((state) => state.setMinimalCharges);
    const minimalCharges = storeArticles((state) => state.minimalCharges);
  
    const { getTemplates }: any = TemplatesRequests();
    const [templates, setTemplates] = useState<any>([]);
  
    const { getUnits }: any = UnitsRequests();
    const [units, setUnits] = useState<any>([]);
    const { getUserGroups }: any = UserGroupsRequests();
    const [userGroups, setUserGroups] = useState<any>([]);
  
    const [typeCharges, setTypeCharges] = useState<any>([]);
    const [discountVariable, setDiscountVariable] = useState<any>([]);
    const [multiplierVariable, setMultiplierVariable] = useState<any>([]);

    useEffect(() => {
      const fetch = async () => {
        try {
          const resultTemplates = await getTemplates(user_id);
          setTemplates({
            selectName: 'Por',
            options: 'nombre',
            dataSelect: resultTemplates,
          });
  
          setDiscountVariable({
            selectName: 'Variable de descuento',
            options: 'nombre',
            dataSelect: resultTemplates,
          });
  
          setMultiplierVariable({
            selectName: 'Variable de multiplicador',
            options: 'nombre',
            dataSelect: resultTemplates,
          });
  
          const resultUnits = await getUnits();
          setUnits({
            selectName: 'Unidades',
            options: 'nombre',
            dataSelect: resultUnits,
          });
  
          const resultUserGroup = await getUserGroups(user_id);
          setUserGroups({
            selectName: 'Grupos de usuarios',
            options: 'nombre',
            dataSelect: resultUserGroup,
          });
  
          setTypeCharges({
            selectName: 'Tipo de cargo',
            options: 'name',
            dataSelect: [
              {
                id: 1,
                name: 'Cargo mínimo de aumento',
              },
              {
                id: 2,
                name: 'Cargo mínimo de suma',
              },
              {
                id: 3,
                name: 'Cargo mínimo de descuento',
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetch();
    }, []);

    useEffect(() => {
        if(selectedIds) {
            const updatedCharges = [...minimalCharges];
            updatedCharges[index] = {
              ...updatedCharges[index],
              por: parseInt(selectedIds?.templates?.id, 10),
              variable_descuento: parseInt(selectedIds?.discountVariable?.id, 10),
              variable_multiplicacion: parseInt(selectedIds?.multiplierVariable?.id, 10),
              id_unidad: parseInt(selectedIds?.units?.id, 10),
              tipo: parseInt(selectedIds?.typeCharges?.id, 10),
              grupo_de_usuario: parseInt(selectedIds?.userGroups?.id, 10),
            };
            setMinimalCharges(updatedCharges);
        }
    }, [selectedIds])
    useEffect(() => {
      if(modalSub == 'modal-sub-minimal-charges') {
         seleccionar_datos()
      }
  }, [modalSub])
    const seleccionar_datos = () => {
      console.log('cargos minimos ver concepts in minimalcharge',minimalCharges);
      
      setSelectData('templates', minimalCharges[index].por)
      setSelectData('discountVariable', minimalCharges[index].variable_descuento)
      setSelectData('multiplierVariable', minimalCharges[index].variable_multiplicacion)
      setSelectData('units', minimalCharges[index].id_unidad)
      setSelectData('typeCharges', minimalCharges[index].tipo)
      setSelectData('userGroups', minimalCharges[index].grupo_de_usuario)
    }



    return (
        <div className={`overlay__modal-sub_minimal-charges_modal-articles ${modalSub == 'modal-sub-minimal-charges' ? 'active' : ''}`}>
            <div className={`popup__modal-sub_minimal-charges_modal-articles ${modalSub == 'modal-sub-minimal-charges' ? 'active' : ''}`}>
                <a className="btn-cerrar-popup__modal-sub_minimal-charges_modal-articles" onClick={() => setModalSub('')}>
                    <svg className='svg__close' xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
                </a>
                <p className='title__modals'>Mas campos de Cargo Minimo</p>
                <br />
                <hr />
                <br />
                <div className='row'>
                    <div className='col-3'>
                        <Select dataSelects={templates} instanceId='templates' nameSelect={'Por'}/>
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={discountVariable} instanceId='discountVariable' nameSelect={'Variable descuento'}/>
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={multiplierVariable} instanceId='multiplierVariable' nameSelect={'Multiplicador'}/>
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={units} instanceId='units' nameSelect={'Unidad'}/>
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={typeCharges} instanceId='typeCharges' nameSelect={'Tipo de Cargo'}/>
                    </div>
                    <div className='col-3'>
                        <Select dataSelects={userGroups} instanceId='userGroups' nameSelect={'Grupo de Usuario'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Concepts
