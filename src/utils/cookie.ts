export const getCookie = (name: string): string =>{
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((cookie) => cookie.trim().startsWith(`${name}=`));
  const value = cookie?.split("=");
  return value ? value[1] : "";
}