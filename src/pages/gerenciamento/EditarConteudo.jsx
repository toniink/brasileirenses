import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const EditarConteudo = () => {
  const { tipo, id } = useParams();
  const [conteudo, setConteudo] = useState(null);

  useEffect(() => {
    api.get(`/${tipo}/${id}`) // Endpoint atual da sua API
      .then(response => setConteudo(response.data));
  }, [tipo, id]);

  return (
    <div>
      <h2>Editando {tipo} ID: {id}</h2>
      {/* Formulário usando os dados de `conteudo` */}
    </div>
  );
};

export default EditarConteudo;