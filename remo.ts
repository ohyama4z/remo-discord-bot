require('dotenv').config()

import axiosBase from "axios"

const axios = axiosBase.create({
  baseURL: `https://api.nature.global`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NATURE_REMO_TOKEN}`
  }
})

interface AirconSettingData {
  button: `on` | `off`,
  temp?: 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29,
  mode?: `強風` | `弱風` | `除湿` | `送風`
}
const setAircon = async (data: AirconSettingData): Promise<void> => {
  let param = ``
  if (data.button === `off`) {
    param = `button=power-off&`
  }

  if (data.temp != null) {
    param = `${param}temperature=${data.temp}&`
  }

  if (data.mode != null) {
    switch (data.mode) {
      case `強風`:
        param = `${param}operation_mode=cool&air_volume=2`
        break;
      
      case `弱風`:
        param = `${param}operation_mode=cool&air_volume=1`
        break;
    
      case `除湿`:
        param = `${param}operation_mode=dry`
        break

      default:
        param = `${param}operation_mode=blow`
        break;
    }
  }

  const airconId = `b0812da1-ea09-4c8b-8d61-6784b1f395f7`
  const res = await axios.post(`/1/appliances/${airconId}/aircon_settings/?${param}`)

  console.log(res.data)
}

export default {setAircon}