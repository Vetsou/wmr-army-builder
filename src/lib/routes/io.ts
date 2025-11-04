export const fetchPublicData =
async <T>(publicPath: string): Promise<T> => {
  const response = await fetch(publicPath, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  if (response.ok) return response.json()
  throw new Error(`Error fetching data from: ${ publicPath }`)
}