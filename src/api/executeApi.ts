import type { ExecuteRequestDto, ExecuteResponseDto } from '@types'

export async function executeCode(request: ExecuteRequestDto): Promise<ExecuteResponseDto> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  return await res.json()
}