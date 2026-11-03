import { useState } from 'react'
import { addressFields, locations } from '../../config/locations.js'
import FormField from './FormField.jsx'

export default function AddressFields({ addressKey, address = {} }) {
  const [uf, setUf] = useState(address?.uf || '')
  const [city, setCity] = useState(address?.cidade || '')
  const states = [...new Set([...Object.keys(locations), address?.uf].filter(Boolean))]
  const cities = [...new Set([
    ...(locations[uf] || []),
    ...(uf === address?.uf && address?.cidade ? [address.cidade] : []),
  ])]

  return (
    <>
      <h3 className="full">{addressKey === 'enderecoCobranca' ? 'Endereço de cobrança' : 'Endereço do imóvel'}</h3>
      {addressFields.map(field => {
        const [key, label] = field
        if (key === 'uf') {
          return (
            <label className="field" key={key}>
              <span>Estado *</span>
              <select name={addressKey + '.uf'} required value={uf} onChange={event => { setUf(event.target.value); setCity('') }}>
                <option value="">Selecione o estado</option>
                {states.map(state => <option key={state}>{state}</option>)}
              </select>
            </label>
          )
        }
        if (key === 'cidade') {
          return (
            <label className="field" key={key}>
              <span>Cidade *</span>
              <select name={addressKey + '.cidade'} required value={city} onChange={event => setCity(event.target.value)}>
                <option value="">{uf ? 'Selecione a cidade' : 'Selecione um estado primeiro'}</option>
                {cities.map(item => <option key={item}>{item}</option>)}
              </select>
            </label>
          )
        }
        return <FormField key={key} field={[key, label]} prefix={addressKey + '.'} defaultValue={address?.[key]} />
      })}
    </>
  )
}
