export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export async function api(path:string, options:any={}, token?:string){
  const headers:any={...(options.headers||{})};
  if(!(options.body instanceof FormData)) headers['Content-Type']='application/json';
  if(token) headers.Authorization=`Bearer ${token}`;
  const res=await fetch(`${API}${path}`,{...options,headers});
  if(!res.ok) throw new Error((await res.json().catch(()=>({error:res.statusText}))).error||res.statusText);
  return res.json();
}
