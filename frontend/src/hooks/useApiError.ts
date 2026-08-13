import axios from 'axios'

export function getApiError(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) return error.response?.data?.message ?? 'Não foi possível concluir a operação.'
  return 'Ocorreu um erro inesperado.'
}
