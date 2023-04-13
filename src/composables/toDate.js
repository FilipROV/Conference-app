import { useDateFormat } from '@vueuse/core'

export function toDate(createDate) {
  let d = new Date(parseInt(createDate))
  let formatedD = useDateFormat(d, 'DD-MM-YYYY').value
  return formatedD;
}